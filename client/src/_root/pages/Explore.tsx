import { ProductFilter, GridProductList, ListProductList } from "@/components/root";
import { useFiltering } from "@/hooks/store";
import { useGetProducts } from "@/lib/react-query/queries";

const Explore = () => {
  const { data, isPending: isProductLoading } = useGetProducts();
  const { selectedBrands } = useFiltering();

  const filteredProducts =
    data &&
    data.data.products.filter((product: { brand: string }) => {
      if (selectedBrands.length === 0) return true;
      return selectedBrands.includes(product.brand);
    });

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center bg-gray-100">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <div className="flex flex-row h-screen">
          <div className="basis-1/4">
            {isProductLoading ? (
              "loading..."
            ) : (
              <ProductFilter />
            )}
          </div>
          <div className="flex flex-col basis-3/4 ml-5">
            {isProductLoading ? (
              "loading..."
            ) : (
              true ?
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