import { Link } from "react-router-dom";
import { Product } from "@/types/index";
import AddToCartButton from "./AddToCartButton";
import AddToFavoritesButton from "./AddToFavoritesButton";
import { calculateDiscountPercentage, cn, formatPrice, isProductAddedWithinNDays, ratingStyle } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Icons } from "../icons";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

type ListProductListProps = {
  products: Product[];
};

const ListProductList = ({ products }: ListProductListProps) => {
  return (
    <>
      <ul className="w-full grid grid-cols-1 gap-7">
        {products.map((product) => (
          <div key={product._id} className={`${product.isDiscounted
            ? 'relative overflow-hidden rounded-xl p-[5px] backdrop-blur-3xl'
            : 'relative bg-white border rounded-xl shadow-md '}`}
          >
            {product.isDiscounted && <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />}
            <div className={`grid grid-flow-col gap-4 relative bg-white rounded-xl p-4 shadow-lg ring-1 ring-inset ring-dark-4/20 card-shine-effect ${product.isDiscounted && 'backdrop-blur-3xl'}`}>
              {isProductAddedWithinNDays({ product, nDays: 14 }) &&
                <img src="/images/new.png" alt={product.name} className="absolute z-30 w-[100px] h-[100px] select-none" />
              }

              <div className="col-span-2 flex flex-col gap-5 w-full h-full py-5 select-none">
                <Carousel className="w-full max-w-[18rem]">
                  <CarouselContent>
                    {product.image.map((_, index) => (
                      <CarouselItem key={index}>
                        <Card className="p-1">
                          <CardContent
                            className="flex aspect-square items-center justify-center p-6 cursor-grab"
                            onMouseDown={(e) => e.currentTarget.style.cursor = "grabbing"}
                            onMouseUp={(e) => e.currentTarget.style.cursor = "grab"}
                            onMouseLeave={(e) => e.currentTarget.style.cursor = "grab"}
                          >
                            <img className="min-h-[13rem] min-w-[13rem] w-52 h-52 object-scale-down" src={product.image[index].url} />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              <div className="col-span-8 flex flex-col gap-5 w-full h-full py-5">
                <Link to={`/products/${product.slug}`} className="text-2xl font-medium tracking-wide text-dark-4">
                  {product.name}
                </Link>
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
                <div className="flex flex-row gap-3">
                  {product.isDiscounted &&
                    <>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">Epic Deal</span>
                      <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-base font-semibold text-sky-800 ring-1 ring-inset ring-sky-600/20">
                        {calculateDiscountPercentage({ normalPrice: product.price, discountedPrice: product.discountedPrice })}% off
                      </span>
                    </>
                  }
                  {product.countInStock === 0 &&
                    <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-base font-semibold text-red-800 ring-1 ring-inset ring-red-600/20">Out of Stock</span>
                  }
                  {(product.countInStock <= 5 && product.countInStock !== 0) &&
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
                <AddToFavoritesButton product={product} variant="icon" />
              </div>

            </div>
          </div>
        ))}
      </ul>
    </>
  );
};

export default ListProductList;