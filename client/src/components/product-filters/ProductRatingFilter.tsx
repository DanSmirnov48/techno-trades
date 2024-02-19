import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import "@smastrom/react-rating/style.css";
import { ratingStyle } from "@/lib/utils";
import { Rating } from "@smastrom/react-rating";
import { useRatingFilterStore } from "@/hooks/store";

const ProductRatingFilter: React.FC = () => {
  const RatingFilter: React.FC<{ value: number }> = ({ value }) => {
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
        <Label htmlFor={`rating-${value}`} className="font-jost text-base ml-2 dark:text-light-2 transform transition duration-500 ease-in-out">{`${value} or more`}</Label>
      </div>
    );
  };

  return (
    <>
      {[5, 4, 3, 2, 1].map((value) => (
        <RatingFilter key={value} value={value} />
      ))}
    </>
  );
};

export default ProductRatingFilter