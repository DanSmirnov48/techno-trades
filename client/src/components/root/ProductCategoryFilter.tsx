import { useCategoryFilter } from "@/hooks/store";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useGetProducts } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { categoriesValues } from "@/constants/idnex";

const ProductCategoryFilter = () => {
  const { selectedCategories, toggleCategory, setCategories } = useCategoryFilter();
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
      categoriesValues.forEach((category) => {
        if (product.category === category) {
          counts[category] = (counts[category] || 0) + 1;
        }
      });
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <>
      {categoriesValues.map((category, index) => (
        <div
          key={index}
          className="flex flex-row mx-0 my-1 justify-start items-center"
        >
          <Checkbox
            id={category}
            checked={selectedCategories.includes(category)}
            onCheckedChange={() => toggleCategory(category)}
          />
          <Label htmlFor={category} className="ml-2 capitalize font-jost text-base dark:text-light-2 transform transition duration-500 ease-in-out">
            {`${category} (${categoryCounts[category] || 0})`}
          </Label>
        </div>
      ))}
    </>
  );
};

export default ProductCategoryFilter;
