import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { BadgeCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ratingStyle } from "@/lib/utils";
import { Product, Review } from "@/types";

type ReviewFormProps = {
  product: Product;
};

const ReviewsSection = ({ product }: ReviewFormProps) => {

  function testReview(idx: number) {
    return (
      <div key={idx} className="mt-5 border-t border-gray-200">
        <div className="py-5 flex space-x-6 gap-20">
          <div className="flex-none">
            <div className="flex-auto flex flex-col gap-4">
              <Rating
                value={Math.floor(Math.random() * 5) + 1}
                readOnly
                className="mr-2 max-w-[100px]"
                itemStyles={ratingStyle}
              />
              <div>
                <h4 className="font-semibold">Bessie Cooper</h4>
                <h4 className="font-medium text-gray-900">March 14, 2021</h4>
              </div>
              <div className="flex flex-row">
                <BadgeCheck className="text-white fill-green-500 h-6 w-6 mr-1" />{" "}
                Verified
              </div>
            </div>
          </div>
          <div className="flex-auto flex flex-col gap-4">
            <h4 className="font-semibold">Great product, smooth purchase</h4>
            <h4 className="font-medium text-dark-4">
              Almost completed building my replacement website and very pleased
              with the result. Although the customization is great the theme's
              features and Customer Support have also been great..
            </h4>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <h1>Was this helpful?</h1>
          <ThumbsUp className="w-4 h-5 pb-1 fill-gray-700 ml-5 mr-1 hover:fill-green-600 cursor-pointer" />
          {Math.floor(Math.random() * 40) + 1}
          <ThumbsDown className="w-4 h-5 fill-gray-700 ml-2 mr-1 hover:fill-red-600 cursor-pointer" />
          {Math.floor(Math.random() * 40) + 1}
        </div>
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
              <div className="py-5 flex space-x-6 gap-20">
                <div className="flex-none">
                  <div className="flex-auto flex flex-col gap-4">
                    <Rating
                      value={review.rating}
                      readOnly
                      className="mr-2 max-w-[100px]"
                      itemStyles={ratingStyle}
                    />
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <h4 className="font-medium text-gray-900">{new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'medium',
                      }).format(new Date(review.createdAt))}</h4>
                    </div>
                    <div className="flex flex-row">
                      <BadgeCheck className="text-white fill-green-500 h-6 w-6 mr-1" />
                      Verified
                    </div>
                  </div>
                </div>
                <div className="flex-auto flex flex-col gap-4">
                  <h4 className="font-semibold">{review.title}</h4>
                  <h4 className="font-medium text-dark-4">{review.comment}</h4>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <h1>Was this helpful?</h1>
                <ThumbsUp className="w-4 h-5 pb-1 fill-gray-700 ml-5 mr-1 hover:fill-green-600 cursor-pointer" />
                {Math.floor(Math.random() * 40) + 1}
                <ThumbsDown className="w-4 h-5 fill-gray-700 ml-2 mr-1 hover:fill-red-600 cursor-pointer" />
                {Math.floor(Math.random() * 40) + 1}
              </div>
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
