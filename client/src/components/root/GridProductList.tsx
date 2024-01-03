import { Link } from "react-router-dom";
import { Product } from "@/types/index";
import AddToCartButton from "./AddToCartButton";
import AddToFavoritesButton from "./AddToFavoritesButton";
import { calculateDiscountPercentage, cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useState } from "react";

type GridProductListProps = {
  products: Product[];
  showFavoritesButton?: boolean;
  showCartButton?: boolean;
  showRating?: boolean;
};

const GridProductList = ({ products }: GridProductListProps) => {

  const ratingStyle = {
    itemShapes: Star,
    activeFillColor: "#ffb700",
    inactiveFillColor: "#fbf1a9",
  };

  const [isChecked, setIsChecked] = useState(true)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  function switchGrid() {
    return (
      <>
        <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-2xl bg-white p-2'>
          <input
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span
            className={`flex items-center space-x-[6px] rounded-lg py-2 px-[20px] text-base font-medium 
            ${!isChecked ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'}`}
          >
            <Icons.list className="mr-2" />
            List
          </span>
          <span
            className={`flex items-center space-x-[6px] rounded-lg py-2 px-[20px] text-base font-medium 
            ${isChecked ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'}`}
          >
            <Icons.grid className="mr-2" />
            Grid
          </span>
        </label>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-3">
        {switchGrid()}
      </div>

      {isChecked ? (
        <>
          <ul className="w-full grid grid-cols-1 gap-7">
            {products.slice(0, 4).map((product) => (
              <li key={product._id} className="grid grid-flow-col gap-4 relative bg-white rounded-xl p-4 shadow-lg ring-1 ring-inset ring-dark-4/20">
                <div className="col-span-3 flex flex-col gap-5 w-full h-full py-5">
                  <Link to={`/products/${product.slug}`}>
                    <div className="relative flex overflow-hidden items-center justify-center">
                      <img className="w-52 h-52" src={product.image[0].url} />
                    </div>
                  </Link>
                </div>
                <div className="col-span-8 flex flex-col gap-5 w-full h-full py-5">
                  <h1 className="text-2xl font-medium tracking-wide text-dark-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center">
                    <Rating
                      value={product?.rating || 0}
                      readOnly
                      className="max-w-[120px]"
                      itemStyles={ratingStyle}
                    />
                    <h1 className="ml-2">(65)</h1>
                  </div>
                  <ul className="max-w-md space-y-2 text-dark-4 font-medium list-disc list-inside dark:text-gray-400">
                    <li>Capacity: 10.4 litres</li>
                    <li>Dual baskets</li>
                    <li>7 preset functions</li>
                    <li>2 independent cooking zones</li>
                    <li>Touchscreen controls</li>
                    <li>Dishwasher safe parts</li>
                    <li>2 year guarantee</li>
                  </ul>
                </div>
                <div className="col-span-1 flex flex-col gap-5 w-full h-full py-5">
                  <span className="text-2xl font-semibold text-dark-4">
                    £{product.price}
                  </span>
                  <div className="flex flex-row gap-3">
                    {product.isDiscounted &&
                      <>
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">Epic Deal</span>
                        <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-base font-semibold text-sky-800 ring-1 ring-inset ring-sky-600/20">
                          {calculateDiscountPercentage({ normalPrice: product.price, discountedPrice: product.discountedPrice })} off
                        </span>
                      </>
                    }
                    {product.countInStock <= 5 &&
                      <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-base font-semibold text-red-800 ring-1 ring-inset ring-red-600/20">Low Stock</span>
                    }
                  </div>
                  <div className="w-full h-20 bg-gray-100 rounded-lg flex flex-col justify-center text-sm p-2">
                    <div className="flex items-center my-0.5"><Icons.truck /><h1 className="ml-2">Delivery available</h1> </div>
                    <div className="flex items-center my-0.5"><Icons.store /> <h1 className="ml-2">Free collection (subject to availability)</h1></div>
                  </div>
                  <Link to={`/products/${product.slug}`}
                    className={cn(buttonVariants(), "w-full bg-dark-1 py-6 text-white text-base hover:bg-dark-4")}
                  >
                    View Rroduct
                  </Link>
                  <AddToCartButton product={product} />
                </div>
                <div className="absolute top-0 right-0">
                  <AddToFavoritesButton product={product} />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
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
      )}
    </>
  );
};

export default GridProductList;
