import { useGetProducts } from "@/lib/react-query/queries";
import { useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types";
import { useFiltering } from "@/hooks/store";

const ProductBrandFilter: React.FC = () => {
    const { data } = useGetProducts();
    const { selectedBrands, toggleBrand, setBrands } = useFiltering();

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

    const uniqueBrandsWithCount:
        { name: string; count: number }[] = Object.keys(brandCounts).map((brand) => ({
            name: brand,
            count: brandCounts[brand],
        }));

    return (

        <div className="mb-4">
            <h4 className="text-sm font-sans mb-1 mt-4">By Brand</h4>
            {uniqueBrandsWithCount.map(({ name, count }) => (
                <div
                    key={name}
                    className="flex flex-row mx-0 my-1 justify-start items-center"
                >
                    <Checkbox
                        checked={selectedBrands.includes(name)}
                        onCheckedChange={() => toggleBrand(name)}
                        aria-label={`Select ${name} brand`}
                    />
                    <h1 className="text-sm ml-2">{`${name} (${count})`}</h1>
                </div>
            ))}
        </div>

    );
};

export default ProductBrandFilter;