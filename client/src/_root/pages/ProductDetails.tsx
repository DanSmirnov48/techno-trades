import { useGetProductBySlug, useGetProducts } from "@/lib/react-query/queries";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { calculateDiscountPercentage, cn, formatPrice, isProductAddedWithinNDays, ratingStyle } from "@/lib/utils";
import { AddToCartButton } from "@/components/root";
import { useEffect, useState } from "react";
import { Product, ProductImage } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ReviewsSection from "@/components/root/ReviewsSection";
import ProductReviewForm from "@/components/root/ProductReviewForm";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { data: product, isLoading: productLoading } = useGetProductBySlug(slug);
  const { data: allProducts, isLoading: allProductsLoading } = useGetProducts();

  const [mainImage, setMainImage] = useState<ProductImage>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!productLoading && !allProductsLoading && product && allProducts) {
      const productsInSameCategory = allProducts.data.products.filter(
        (p: Product) => p.category === product.category && p.slug !== slug
      );
      setRelatedProducts(productsInSameCategory);
      setMainImage(product.image[0])
    }
  }, [product, allProducts, slug, productLoading, allProductsLoading]);

  function imageSection() {
    return (
      <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
        <div className="sticky top-0 overflow-hidden ">
          <div className="relative mb-6 lg:mb-10 lg:h-96">
            <img
              className="object-contain w-full lg:h-full cursor-pointer"
              src={mainImage?.url}
              alt=""
              onClick={() => setOpen(true)}
            />
          </div>
          <div className="flex-wrap hidden -mx-2 md:flex">
            {product?.image.map((image) => (
              <div key={image._id} className="w-1/2 p-2 sm:w-1/4">
                <a
                  className="block border p-2 border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                  href="#"
                  onClick={() => setMainImage(image)}
                >
                  <img
                    className="object-contain w-full lg:h-28 cursor-pointer"
                    src={image.url}
                    alt=""
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function infoSection() {
    return (
      <div className="mb-6 ">
        <div className="flex items-center space-x-2">
          {product?.isDiscounted &&
            <>
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">Epic Deal</span>
              <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-base font-semibold text-sky-800 ring-1 ring-inset ring-sky-600/20">
                {calculateDiscountPercentage({ normalPrice: product.price, discountedPrice: product.discountedPrice })} off
              </span>
            </>
          }
          {product && product.countInStock === 0 &&
            <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-base font-semibold text-red-800 ring-1 ring-inset ring-red-600/20">Out of Stock</span>
          }
          {product && (product.countInStock <= 5 && product.countInStock !== 0) &&
            <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-base font-semibold text-red-800 ring-1 ring-inset ring-red-600/20">Low Stock</span>
          }
          {product && isProductAddedWithinNDays({ product, nDays: 75 }) &&
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-1 text-base font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20">New Arrival</span>
          }
        </div>

        <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
          {product?.name}
        </h2>
        <div className="flex flex-wrap items-center mb-6">
          <Rating
            value={product?.rating || 0}
            readOnly
            className="mr-2 max-w-[100px]"
            itemStyles={ratingStyle}
          />

          <Link
            to={"/"}
            className="mb-4 text-xs underline hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 lg:mb-0"
          >
            View {product?.brand} page
          </Link>
        </div>
        <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
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
        </p>
      </div>
    );
  }

  function spectsSection() {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">
          System Specs :
        </h2>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl">
          <div className="p-3 lg:p-5 ">
            <div className="p-2 rounded-xl lg:p-6 dark:bg-gray-800 bg-gray-50">
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                <div className="w-full mb-4 md:w-2/5">
                  <div className="flex ">
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-diagram-3 w-7 h-7"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
                        ></path>
                      </svg>
                    </span>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        No. of cores
                      </p>
                      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                        12 Cores
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="w-full mb-4 md:w-2/5">
                  <div className="flex ">
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-gpu-card w-7 h-7"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path>
                        <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"></path>
                        <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z"></path>
                      </svg>
                    </span>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Graphic
                      </p>
                      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                        Intel UHD
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="w-full mb-4 lg:mb-0 md:w-2/5">
                  <div className="flex ">
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="w-7 h-7 bi bi-cpu"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"></path>
                      </svg>
                    </span>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Processor
                      </p>
                      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                        INTEL 80486
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="w-full mb-4 lg:mb-0 md:w-2/5">
                  <div className="flex ">
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-clock-history w-7 h-7"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path>
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path>
                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path>
                      </svg>
                    </span>
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Frequency
                      </p>
                      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                        3.5 GHz
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return productLoading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <section className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-20 py-10 dark:bg-gray-800">
      <div className="max-w-full px-4 mx-auto">
        <Button
          className={cn("mb-10 text-sm bg-dark-1")}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 w-6 h-6" />
          Back
        </Button>
        <div className="flex flex-wrap mb-24 -mx-4 ">
          {imageSection()}
          <div className="w-full px-4 md:w-1/2">
            <div className="lg:pl-20 font-jost">
              {infoSection()}
              {spectsSection()}
              <AddToCartButton product={product!} />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-screen-lg h-[calc(60vh)]">
                  <img
                    className="object-contain max-w-2xl h-full m-auto"
                    src={mainImage?.url}
                    alt=""
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <>
          <div className="flex flex-row justify-between items-center my-4 font-jost mt-[10rem]">
            <h1 className="text-dark-3 text-3xl">You might also like</h1>
          </div>

          <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 bg-[#F3F3F3] rounded-xl">
            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-12 font-jost">
              <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                {relatedProducts.map((product) => (
                  <Link to={`/products/${product.slug}`} key={product._id}>
                    <div className="group relative">
                      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                        <img
                          src={product.image[0].url}
                          alt={product.name}
                          className="h-full w-full object-contain object-center p-2"
                        />
                      </div>
                      <h3 className="mt-6 text-sm text-gray-500">£{product.price}</h3>
                      <p className="text-base font-semibold text-gray-900">{product.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
        <div className="container p-0 my-20">
          {product && <ProductReviewForm product={product} />}
        </div>
        <div className="container p-0 my-20">
          <ReviewsSection />
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;