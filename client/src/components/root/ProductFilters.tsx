import { useGetProducts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types";

interface ProductFilterProps {
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ setSelectedBrands }) => {
  const { data } = useGetProducts();
  const [selectedBrands, setSelectedBrandsLocal] = useState<string[]>([]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const brandsParam = urlSearchParams.get("brands");
    if (brandsParam) {
      const decodedBrands = brandsParam
        .split(",")
        .map((brand) => decodeURIComponent(brand));
      setSelectedBrandsLocal(decodedBrands);
    }
  }, [setSelectedBrands]);

  const handleBrandChange = (brand: string) => {
    const isSelected = selectedBrands.includes(brand);
    if (isSelected) {
      setSelectedBrandsLocal(
        selectedBrands.filter((selectedBrand) => selectedBrand !== brand)
      );
    } else {
      setSelectedBrandsLocal([...selectedBrands, brand]);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (selectedBrands.length === 0) {
      urlSearchParams.delete("brands");
    } else {
      urlSearchParams.set(
        "brands",
        selectedBrands.map((brand) => encodeURIComponent(brand)).join(",")
      );
    }

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);

    setSelectedBrands(selectedBrands);
  }, [selectedBrands, setSelectedBrands]);

  const brandCounts: { [key: string]: number } = {};
  
  data?.data.products?.forEach((product: Product) => {
    const brand = product.brand;
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  const uniqueBrandsWithCount: { name: string; count: number }[] = Object.keys(brandCounts).map((brand) => ({
    name: brand,
    count: brandCounts[brand],
  }));

  return (
    <div className="bg-white h-full rounded-2xl shadow-xl">
      <h1 className="text-left text-2xl font-semibold py-4 px-8 text-dark-4">
        Filters
      </h1>
      <div className="flex flex-col h-full mx-8">
        <div className="mb-4">
          <h4 className="text-sm font-sans mb-1 mt-4">By Brand</h4>
          {uniqueBrandsWithCount.map(({ name, count }) => (
            <div
              key={name}
              className="flex flex-row mx-0 my-1 justify-start items-center"
            >
              <Checkbox
                checked={selectedBrands.includes(name)}
                onCheckedChange={() => handleBrandChange(name)}
                aria-label={`Select ${name} brand`}
              />
              <h1 className="text-sm ml-2">{`${name} (${count})`}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
