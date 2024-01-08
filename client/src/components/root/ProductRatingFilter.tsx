import { Product } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useGetProducts } from "@/lib/react-query/queries";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ratingStyle } from "@/lib/utils";
import { useRatingFiltering } from "@/hooks/store";
import { useEffect } from "react";
import { Label } from "../ui/label";



const renderRatingFilters = (products: Product[]) => {
  interface RatingFilterProps {
    value: number;
    count: number;
  }

  const RatingFilter: React.FC<RatingFilterProps> = ({ value, count }) => {
    const { minRating, maxRating, setRating } = useRatingFiltering();

    const handleRatingChange = () => {
      if (minRating === value) {
        setRating(null, null);
      } else {
        setRating(value, 5);
      }
    };

    return (
      <div className="flex flex-row mx-0 my-1 justify-start items-center">
        <Checkbox
          id="rating"
          checked={minRating === value}
          onCheckedChange={handleRatingChange}
          className="mr-1"
        />
        <Rating value={value} readOnly itemStyles={ratingStyle} style={{ maxWidth: 100 }} />
        <Label htmlFor="rating" className="text-sm ml-2">{`${value} or more (${count})`}</Label>
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
        // Increment the count for the current rating and all lower ratings
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
    useRatingFiltering.getState().setRating(null, null);
  }, []);

  return renderRatingFilters(data?.data.products || []);
};








// const renderRatingFilters = (products: Product[]) => {
//   interface RatingFilterProps {
//     value: number;
//     count: number;
//   }

//   const RatingFilter: React.FC<RatingFilterProps> = ({ value, count }) => {
//     return (
//       <div className="flex flex-row mx-0 my-1 justify-start items-center">
//         <Checkbox
//           // checked={false}
//           // onCheckedChange={(value: any) => console.log(value)}
//           className="mr-1"
//         />
//         <Rating
//           value={value}
//           readOnly
//           itemStyles={ratingStyle}
//           style={{ maxWidth: 100 }}
//         />
//         <h1 className="text-sm ml-2">{`${value} or more (${count})`}</h1>
//       </div>
//     );
//   };

//   const getRatingsWithCount = ( products: Product[] ): { value: number; count: number }[] => {
//     const ratingCounts: { [key: number]: number } = {};
//     for (let i = 1; i <= 5; i++) {
//       ratingCounts[i] = 0;
//     }

//     products
//       .filter((product) => product.rating !== undefined && product.rating > 0)
//       .forEach((product) => {
//         const rating = product.rating as number;
//         ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
//       });

//     const ratingsWithCount = Object.keys(ratingCounts).map((value) => ({
//       value: parseInt(value, 10),
//       count: ratingCounts[value as any],
//     }));

//     return ratingsWithCount;
//   };

//   const sortedRatingsWithCount = getRatingsWithCount(products).sort((a, b) => b.value - a.value);

//   return (
//     <>
//       <h4 className="text-sm font-sans mb-1 mt-4">By Rating</h4>
//       {sortedRatingsWithCount.map(({ value, count }) => (
//         <RatingFilter key={value} value={value} count={count} />
//       ))}
//     </>
//   );
// };

// export const ProductRatingFilter: React.FC = () => {
//   const { data } = useGetProducts();
//   return renderRatingFilters(data?.data.products);
// };
