import { ProductFilters, ProductSorting, GridProductList, ListProductList } from "@/components/root";
import { useSorting, useFiltering, useRatingFiltering } from "@/hooks/store";
import { useGetProducts } from "@/lib/react-query/queries";
import { useLocation } from "react-router-dom";

const Explore = () => {
  const location = useLocation();
  const { isChecked } = useSorting();
  const { selectedBrands } = useFiltering();
  const { minRating, maxRating } = useRatingFiltering()
  const { data, isPending: isProductLoading } = useGetProducts();

  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const filteredProducts = data && data.data.products.filter((product: { brand: string; category: string; }) => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (category && product.category !== category) return false;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center bg-gray-100">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <div className="flex flex-row h-screen">
          <div className="basis-1/4">
            {isProductLoading ? (
              "loading..."
            ) : (
              <ProductFilters />
            )}
          </div>
          <div className="flex flex-col basis-3/4 ml-5">
            <ProductSorting />
            {isProductLoading ? (
              "loading..."
            ) : (
              isChecked ?
                <GridProductList products={filteredProducts} />
                :
                <ListProductList products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;