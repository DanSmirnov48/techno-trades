import {
  useFiltering,
  usePriceFilterStore,
  useRatingFilterStore,
} from "@/hooks/store";
import { Button } from "../ui/button";
import { Star, X } from "lucide-react";

const AppliedFilters = () => {
  //-------------------------------BRANDS-----------------------------------------------------
  const { selectedBrands, removeBrand, removeAllBrands } = useFiltering();
  //-------------------------------PRICES-----------------------------------------------------
  const { selectedRanges, removeSelectedRange, removeAllRanges } = usePriceFilterStore();
  //-------------------------------RATING-----------------------------------------------------
  const { selectedRatings, removeSelectedRating, removeAllRatings } = useRatingFilterStore();

  function clearAllFilter() {
    selectedBrands.length !== 0 && removeAllBrands();
    selectedRanges.length !== 0 && removeAllRanges();
    selectedRatings.length !== 0 && removeAllRatings();
  }
  return (
    <div>
      {(selectedRanges.length !== 0 ||
        selectedBrands.length !== 0 ||
        selectedRatings.length !== 0) && (
        <div className="flex flex-wrap my-4">
          {selectedRanges.map(({ min, max }, idx) => (
            <div key={`range-${idx}`} className="flex items-center mb-2 mr-1">
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">
                {`£${min} to £${max}`}
                <X
                  className="cursor-pointer ml-1 text-black"
                  onClick={() => removeSelectedRange(min, max)}
                />
              </span>
            </div>
          ))}

          {selectedBrands.map((brand, idx) => (
            <div key={`brand-${idx}`} className="flex items-center mb-2 mr-1">
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">
                {brand}
                <X
                  className="cursor-pointer ml-1 text-black"
                  onClick={() => removeBrand(brand)}
                />
              </span>
            </div>
          ))}
          {selectedRatings.map((rating, idx) => (
            <div key={`rating-${idx}`} className="flex items-center mb-2 mr-1">
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-base font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20">
                <Star className="fill-yellow-400 text-yellow-500 mr-1" />
                {rating} or more
                <X
                  className="cursor-pointer ml-1 text-black"
                  onClick={() => removeSelectedRating(rating)}
                />
              </span>
            </div>
          ))}
        </div>
      )}
      {selectedBrands.length + selectedRanges.length > 3 && (
        <Button className="w-full" onClick={clearAllFilter}>
        Clear All
        </Button>
      )}
    </div>
  );
};

export default AppliedFilters;