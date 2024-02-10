import { Product } from "@/types";
import { useEffect } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import "@smastrom/react-rating/style.css";
import { ratingStyle } from "@/lib/utils";
import { Rating } from "@smastrom/react-rating";
import { useRatingFilterStore } from "@/hooks/store";
import { useGetProducts } from "@/lib/react-query/queries";

const renderRatingFilters = (products: Product[]) => {
  interface RatingFilterProps {
    value: number;
    count: number;
  }

  const RatingFilter: React.FC<RatingFilterProps> = ({ value, count }) => {
    const { selectedRatings, addSelectedRating, removeSelectedRating } = useRatingFilterStore();

    const handleRatingChange = () => {
      if (selectedRatings.includes(value)) {
        removeSelectedRating(value);
      } else {
        addSelectedRating(value);
      }
    };

    return (
      <div className="flex flex-row mx-0 my-1 justify-start items-center">
        <Checkbox
          id={`rating-${value}`}
          checked={selectedRatings.includes(value)}
          onCheckedChange={handleRatingChange}
          className="mr-1"
        />
        <Rating value={value} readOnly itemStyles={ratingStyle} style={{ maxWidth: 120 }} />
        <Label htmlFor={`rating-${value}`} className="font-jost text-base ml-2 dark:text-light-2 transform transition duration-500 ease-in-out">{`${value} or more (${count})`}</Label>
      </div>
    );
  };

  const getRatingsWithCount = (products: Product[]): { value: number; count: number }[] => {
    const ratingCounts: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      ratingCounts[i] = 0;
    }

    products
      .filter((product) => product.rating !== undefined && product.rating > 0)
      .forEach((product) => {
        const rating = product.rating as number;
        for (let i = 1; i <= rating; i++) {
          ratingCounts[i] += 1;
        }
      });

    const ratingsWithCount = Object.keys(ratingCounts).map((value) => ({
      value: parseInt(value, 10),
      count: ratingCounts[value as any],
    }));

    return ratingsWithCount;
  };

  const sortedRatingsWithCount = getRatingsWithCount(products).sort((a, b) => b.value - a.value);

  return (
    <>
      {sortedRatingsWithCount.map(({ value, count }) => (
        <RatingFilter key={value} value={value} count={count} />
      ))}
    </>
  );
};

const ProductRatingFilter: React.FC = () => {
  const { data } = useGetProducts();
  useEffect(() => {
    useRatingFilterStore.getState().removeAllRatings();
  }, []);

  return renderRatingFilters(data?.data.products || []);
};

export default ProductRatingFilter