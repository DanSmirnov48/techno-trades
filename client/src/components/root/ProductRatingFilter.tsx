import { Product } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useGetProducts } from "@/lib/react-query/queries";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ratingStyle } from "@/lib/utils";
import { useRatingFilterStore } from "@/hooks/store";
import { useEffect } from "react";
import { Label } from "../ui/label";

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
        <Rating value={value} readOnly itemStyles={ratingStyle} style={{ maxWidth: 100 }} />
        <Label htmlFor={`rating-${value}`} className="text-sm ml-2">{`${value} or more (${count})`}</Label>
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
      <h4 className="text-sm font-sans mb-1 mt-4">By Rating</h4>
      {sortedRatingsWithCount.map(({ value, count }) => (
        <RatingFilter key={value} value={value} count={count} />
      ))}
    </>
  );
};

export const ProductRatingFilter: React.FC = () => {
  const { data } = useGetProducts();
  useEffect(() => {
    useRatingFilterStore.getState().removeAllRatings();
  }, []);

  return renderRatingFilters(data?.data.products || []);
};