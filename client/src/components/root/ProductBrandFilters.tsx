import { useGetProducts } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types";
import { useBrandFilter } from "@/hooks/store";
import { Label } from "../ui/label";

const ProductBrandFilter: React.FC = () => {
  const { data } = useGetProducts();
  const { selectedBrands, toggleBrand, setBrands } = useBrandFilter();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const brandsParam = urlSearchParams.get('brands');
    if (brandsParam) {
      const decodedBrands = brandsParam
        .split(',')
        .map((brand) => decodeURIComponent(brand));
      setBrands(decodedBrands);
    }
  }, [setBrands]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (selectedBrands.length === 0) {
      urlSearchParams.delete('brands');
    } else {
      urlSearchParams.set(
        'brands',
        selectedBrands.map((brand) => encodeURIComponent(brand)).join(',')
      );
    }

    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, [selectedBrands]);

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
    <>
      {uniqueBrandsWithCount.map(({ name, count }) => (
        <div
          key={name}
          className="flex flex-row mx-0 my-1 justify-start items-center"
        >
          <Checkbox
            id="brand"
            checked={selectedBrands.includes(name)}
            onCheckedChange={() => toggleBrand(name)}
            aria-label={`Select ${name} brand`}
          />
          <Label htmlFor="brand" className="ml-2 font-jost text-base dark:text-light-2 transform transition duration-500 ease-in-out">{`${name} (${count})`}</Label>
        </div>
      ))}
    </>
  );
};

export default ProductBrandFilter;