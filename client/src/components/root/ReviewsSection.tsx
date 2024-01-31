import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Progress } from "@/components/ui/progress";
import { formatDate, ratingStyle } from "@/lib/utils";
import { Product, Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ReviewFormProps = {
  product: Product;
};

const ReviewsSection = ({ product }: ReviewFormProps) => {

  function testReview(idx: number) {
    return (
      <div key={idx} className="mt-5 border-t border-gray-200">
        <div className="flex items-center my-4">
          <Avatar className="h-10 w-10 me-4">
            <AvatarFallback>F U</AvatarFallback>
          </Avatar>
          <div className="font-medium dark:text-white">
            <p>Jese Leos <span className="block text-sm text-gray-500 dark:text-gray-400">Joined on August 2014</span></p>
          </div>
        </div>
        <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
          <Rating
            value={Math.floor(Math.random() * 5) + 1}
            readOnly
            className="mr-2 max-w-[100px]"
            itemStyles={ratingStyle}
          />
          <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">Thinking to buy another one!</h3>
        </div>
        <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Reviewed in the United Kingdom on <span>March 3, 2017</span></p></footer>
        <p className="mb-2 text-gray-500 dark:text-gray-400">This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems.</p>
        <p className="mb-3 text-gray-500 dark:text-gray-400">It is obviously not the same build quality as those very expensive watches. But that is like comparing a Citroën to a Ferrari. This watch was well under £100! An absolute bargain.</p>
        <a href="#" className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read more</a>
        <aside>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">19 people found this helpful</p>
          <div className="flex items-center mt-3">
            <a href="#" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Helpful</a>
            <a href="#" className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600">Report abuse</a>
          </div>
        </aside>
      </div>
    );
  }

  const calculatePercentage = (rating: number): number => {
    const ratingCount = product.numReviews;
    return ratingCount !== 0 ? (getReviewCountByRating(rating) / ratingCount) * 100 : 0;
  };

  const getReviewCountByRating = (rating: number): number => {
    return product.reviews?.filter((review: Review) => review.rating === rating).length || 0;
  };

  const renderStarRatings = () => {
    return [5, 4, 3, 2, 1].map((rating) => (
      <div key={rating} className="flex items-center mt-1">
        <p className="pr-4">{`${rating} star`}</p>
        <Progress value={calculatePercentage(rating)} className="h-3 max-w-sm" />
        <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {getReviewCountByRating(rating)}
        </span>
      </div>
    ));
  };

  return (
    <section className="reviews-section font-jost" id="reviews">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mb-10">
        <div className="">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Customer reviews & ratings</h1>
            <div className="flex flex-row">
              <Rating
                value={product.rating}
                readOnly
                className="mr-2 max-w-[100px]"
                itemStyles={ratingStyle}
              />
              <h1>({product.rating} out of 5)</h1>
            </div>
            <h1>Based on {product.numReviews} reviews</h1>
          </div>
        </div>
        <div className="">{renderStarRatings()}</div>
      </div>
      <div>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, idx) => (
            <div key={idx} className="mt-5 border-t border-gray-200">
              <div className="flex items-center my-4">
                <Avatar className="h-10 w-10 me-2">
                  <AvatarImage
                    src={review.user.photo && review.user.photo.url}
                    alt={review.user.firstName}
                    className="object-cover"
                  />
                  <AvatarFallback>{review.user.firstName.slice(0, 1)}{review.user.lastName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="font-medium dark:text-white">
                  <p>{review.name}<span className="block text-sm text-gray-500 dark:text-gray-400">Joined on {formatDate(review.user.createdAt.toString(), "year-month")}</span></p>
                </div>
              </div>
              <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                <Rating
                  value={review.rating}
                  readOnly
                  className="mr-2 max-w-[100px]"
                  itemStyles={ratingStyle}
                />
                <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">{review.title}</h3>
              </div>
              <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400"><p>Reviewed in the United Kingdom on <span>{formatDate(review.createdAt.toString(), "year-month")}</span></p></footer>
              <p className="mb-2 text-gray-500 dark:text-gray-400">{review.comment}</p>
              <a href="#" className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read more</a>
              <aside>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">19 people found this helpful</p>
                <div className="flex items-center mt-3">
                  <a href="#" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Helpful</a>
                  <a href="#" className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600">Report abuse</a>
                </div>
              </aside>
            </div>
          ))
        ) : (
          [...Array(3)].map((_, idx) => testReview(idx))
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
