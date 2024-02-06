import { GridProductList } from "@/components/root";
import { ProductLoader } from "@/components/root/ProductLoader";
import { useGetProducts } from "@/lib/react-query/queries";
import { Product } from "@/types";

const Deals = () => {
  const { data, isPending: isProductLoading } = useGetProducts();

  const filteredProducts =
    data &&
    data.data.products.filter((product: Product) => product.isDiscounted === true);

  return (
    <div className="flex flex-col flex-1 items-center">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <div className="flex flex-row">
          {isProductLoading ? <ProductLoader displayType="grid"/> : <GridProductList products={filteredProducts} />}
        </div>
      </div>
    </div>
  );
}

export default Deals