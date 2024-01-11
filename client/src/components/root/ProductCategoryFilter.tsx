import { useCategoryFilter } from "@/hooks/store";
import { categories } from "../tables/products-table/filters";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useGetProducts } from "@/lib/react-query/queries";
import { useEffect } from "react";

const ProductCategoryFilter = () => {
  const { selectedCategories, toggleCategory, setCategories } =
    useCategoryFilter();
  const { data } = useGetProducts();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const categoriesParam = urlSearchParams.get("categories");
    if (categoriesParam) {
      const decodedCategories = categoriesParam
        .split(",")
        .map((category) => decodeURIComponent(category));
      setCategories(decodedCategories);
    }
  }, [setCategories]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (selectedCategories.length === 0) {
      urlSearchParams.delete("categories");
    } else {
      urlSearchParams.set(
        "categories",
        selectedCategories
          .map((category) => encodeURIComponent(category))
          .join(",")
      );
    }

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  }, [selectedCategories]);

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};

    data?.data.products.forEach((product: { category: string }) => {
      categories.forEach((category) => {
        if (product.category === category.value) {
          counts[category.value] = (counts[category.value] || 0) + 1;
        }
      });
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div>
      <h4>By Category</h4>
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-row mx-0 my-1 justify-start items-center"
        >
          <Checkbox
            id={category.value}
            checked={selectedCategories.includes(category.value)}
            onCheckedChange={() => toggleCategory(category.value)}
          />
          <Label htmlFor={category.value} className="text-sm ml-2 capitalize">
            {`${category.label} (${categoryCounts[category.value] || 0})`}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default ProductCategoryFilter;
