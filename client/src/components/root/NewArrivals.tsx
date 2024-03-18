import { Product } from "@/types";
import { Link } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { useGetProducts } from "@/lib/react-query/queries/product-queries";

const NewArrivals: FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const { data: products, isLoading: allProductsLoading } = useGetProducts();

  useEffect(() => {
    if (!allProductsLoading && products) {
      const sortedProducts = products.data.products.sort(
        (a: Product, b: Product) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : null;
          const dateB = b.createdAt ? new Date(b.createdAt) : null;
          if (dateA && dateB) {
            return dateB.getTime() - dateA.getTime();
          } else if (dateA) {
            return -1;
          } else if (dateB) {
            return 1;
          }
          return 0;
        }
      );
      const productsInSameCategory = sortedProducts.slice(0, 3);
      setNewProducts(productsInSameCategory);
    }
  }, [allProductsLoading, products]);

  return allProductsLoading ? (
    <>
      <h1>Loading...</h1>
    </>
  ) : (

    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 bg-[#F3F3F3] dark:bg-dark-4 transform transition duration-700 ease-in-out rounded-xl">
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32 font-jost">
        <h1 className="text-dark-3 dark:text-white/80 text-3xl">New Arrivals</h1>

        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
          {newProducts.map((product) => (
            <Link to={`/products/${product.slug}`} key={product._id}>
              <div className="group relative">
                <div className="transform group-hover:-translate-y-3 transition-transform duration-700 ease-out">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 sm:h-64">
                    <img
                      src={product.image[0].url}
                      alt={product.name}
                      className="h-full w-full object-contain object-center p-5"
                    />
                  </div>
                  <div className="transform origin-center group-hover:scale-125 group-hover:translate-x-14 transition-transform duration-700 ease-out">
                    <h3 className="mt-6 text-sm text-gray-500 dark:text-white/80 capitalize">{product.category}</h3>
                    <p className="text-base font-semibold text-gray-900 dark:text-white/90">{product.name}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
