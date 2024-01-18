import { Link } from "react-router-dom";
import { Product } from "@/types/index";
import AddToCartButton from "./AddToCartButton";
import AddToFavoritesButton from "./AddToFavoritesButton";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";

type GridProductListProps = {
  products: Product[];
};

const GridProductList = ({ products }: GridProductListProps) => {
  return (
    <>
      <ul className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
        {products.map((product) => (
          <li key={product._id} className="relative">
            {product.isDiscounted &&
              <span className="absolute top-0 left-0 px-6 py-2 rounded-tl-xl rounded-br-xl bg-purple-100 text-lg font-medium text-purple-800 ring-1 ring-inset ring-purple-600/30">
                {calculateDiscountPercentage({ normalPrice: product.price, discountedPrice: product.discountedPrice })}%
              </span>
            }
            <div className="flex w-full  flex-col self-center overflow-hidden border rounded-xl bg-white shadow-xl">
              <div className="h-12 flex items-start justify-end">
                <AddToFavoritesButton product={product} variant="button" />
              </div>
              <Link to={`/products/${product.slug}`}>
                <div className="select-none relative mx-3 flex h-60 overflow-hidden rounded-xl bg-white items-top justify-center">
                  <img
                    className="w-44 h-44 object-scale-down"
                    src={product.image[0].url}
                    alt="post"
                  />
                </div>
              </Link>

              <div className="flex flex-col px-5 pb-5 gap-4">
                <h5 className="text-xl tracking-tight text-dark-4">
                  {product.name}
                </h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-dark-4">
                    {product?.isDiscounted ? (
                      <>
                        <span>{product && formatPrice(product.discountedPrice!, { currency: "GBP" })}</span>
                        <span className="ml-3 text-base font-normal text-gray-500 line-through dark:text-gray-400">
                          {product && formatPrice(product.price, { currency: "GBP" })}
                        </span>
                      </>
                    ) : (
                      product && formatPrice(product.price, { currency: "GBP" })
                    )}
                  </span>
                </div>

                <AddToCartButton product={product} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default GridProductList;
