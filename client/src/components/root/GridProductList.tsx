import { Link } from "react-router-dom";
import { Product } from "@/types/index";
import AddToCartButton from "./AddToCartButton";
import AddToFavoritesButton from "./AddToFavoritesButton";
import { calculateDiscountPercentage, cn } from "@/lib/utils";

type GridProductListProps = {
  products: Product[];
};

const GridProductList = ({ products }: GridProductListProps) => {
  return (
    <>
      <ul className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
        {products.map((product) => (
          <li key={product._id} className="relative h-[400px] mb-28">
            <div className="flex w-full  flex-col self-center overflow-hidden rounded-xl bg-white shadow-xl">
              <div className={cn("h-12 flex items-start", { "justify-between": product.isDiscounted === true, "justify-end": product.isDiscounted === false })}>
                {product.isDiscounted &&
                  <span className="rounded-md bg-purple-50 m-3 px-2 py-1 text-lg font-medium text-purple-800 ring-1 ring-inset ring-purple-600/20">
                    {calculateDiscountPercentage({ normalPrice: product.price, discountedPrice: product.discountedPrice })}
                  </span>
                }
                <AddToFavoritesButton product={product} />
              </div>
              <Link to={`/products/${product.slug}`}>
                <div className="relative mx-3 flex h-60 overflow-hidden rounded-xl bg-white items-top justify-center">
                  <img
                    className="w-44 h-4w-44 object-scale-down"
                    src={product.image[0].url}
                    alt="post"
                  />
                </div>
              </Link>

              <div className="px-5 pb-5">
                <h5 className="text-xl tracking-tight text-dark-4 h-20">
                  {product.name}
                </h5>

                <div className="mt-2 mb-5 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-dark-4">
                    £{product.price}
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
