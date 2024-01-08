import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { BadgeCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ratingStyle } from "@/lib/utils";

const ReviewsSection = () => {

  function testReview() {
    return (
      <div className="mt-5 border-t border-gray-200">
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

  return (
    <section className="reviews-section font-jost">

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mb-10">
        <div className="">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Customer reviews & ratings</h1>
            <div className="flex flex-row">
              <Rating
                value={4.5}
                readOnly
                className="mr-2 max-w-[100px]"
                itemStyles={ratingStyle}
              />
              <h1>(4.7 out of 5)</h1>
            </div>
            <h1>Based on 3,498 reviews</h1>
          </div>
        </div>
        <div className="">
          <div className="flex items-center mt-1">
            <p className="pr-4">5 star</p>
            <Progress value={70} className="h-3 max-w-sm" />
            <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              70
            </span>
          </div>
          <div className="flex items-center mt-1">
            <p className="pr-4">4 star</p>
            <Progress value={17} className="h-3 max-w-sm" />
            <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              17
            </span>
          </div>
          <div className="flex items-center mt-1">
            <p className="pr-4">3 star</p>
            <Progress value={9} className="h-3 max-w-sm" />
            <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              8
            </span>
          </div>
          <div className="flex items-center mt-1">
            <p className="pr-4">2 star</p>
            <Progress value={4} className="h-3 max-w-sm" />
            <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              4
            </span>
          </div>
          <div className="flex items-center mt-1">
            <p className="pr-4">1 star</p>
            <Progress value={10} className="h-3 max-w-sm" />
            <span className="pl-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              1
            </span>
          </div>
        </div>
      </div>
      {testReview()}
      {testReview()}
      {testReview()}
    </section>
  );
};

export default ReviewsSection;
