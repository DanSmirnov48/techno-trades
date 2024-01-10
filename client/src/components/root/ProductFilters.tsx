import { useFiltering, usePriceFilterStore, useRatingFilterStore } from "@/hooks/store";
import { Separator } from "../ui/separator";
import HideOutOfStock from "./HideOutOfStock";
import ProductBrandFilters from "./ProductBrandFilters";
import { ProductPriceFilter } from "./ProductPriceFilter";
import { ProductRatingFilter } from "./ProductRatingFilter";
import { Button } from "../ui/button";
import { Star, X } from "lucide-react";

const ProductFilters: React.FC = () => {
  //-------------------------------BRANDS-----------------------------------------------------
  const { selectedBrands, removeBrand, removeAllBrands } = useFiltering();

  //-------------------------------PRICES-----------------------------------------------------
  const { selectedRanges, removeSelectedRange, removeAllRanges } = usePriceFilterStore();
  const overallMin = Math.min(...selectedRanges.map((range) => range.min));
  const overallMax = Math.max(...selectedRanges.map((range) => range.max));

  //-------------------------------RATING-----------------------------------------------------
  const { selectedRatings, removeSelectedRating, removeAllRatings } = useRatingFilterStore();
  const highestRating = selectedRatings.length > 0 ? Math.max(...selectedRatings) : null;
  const lowestRating = selectedRatings.length > 0 ? Math.min(...selectedRatings) : null;

  function clearAllFilter() {
    selectedBrands.length !== 0 && removeAllBrands()
    selectedRanges.length !== 0 && removeAllRanges()
    selectedRatings.length !== 0 && removeAllRatings()
  }

  return (
    <div className="bg-white h-full rounded-2xl shadow-xl">
      <h1 className="text-left text-2xl font-semibold py-4 px-8 text-dark-4">
        Filters
      </h1>
      <Separator />

      {(selectedRanges.length !== 0 ||
        selectedBrands.length !== 0 ||
        selectedRatings.length !== 0
      ) && (
          <div className="flex flex-wrap mx-8 my-4">
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
        <div className="mx-8">
          <Button className="w-full" onClick={clearAllFilter}>Clear All</Button>
        </div>
      )}

      <div className="flex flex-col h-full mx-8">
        <HideOutOfStock />
        <ProductPriceFilter />
        <ProductBrandFilters />
        <ProductRatingFilter />
      </div>
    </div>
  );
};

export default ProductFilters;