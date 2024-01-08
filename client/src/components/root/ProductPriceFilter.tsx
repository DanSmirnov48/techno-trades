import { Product } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useGetProducts } from "@/lib/react-query/queries";
import { useState } from "react";
import { Label } from "../ui/label";

interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (selectedRange: { min: number; max: number } | null) => void;
  isChecked: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ min, max, onChange, isChecked }) => {
  const handleCheckboxChange = () => {
    const newRange = isChecked ? null : { min, max };
    onChange(newRange);
  };

  return (
    <div className="flex flex-row mx-0 my-1 justify-start items-center">
      <Checkbox id="price" className="mr-1" onCheckedChange={handleCheckboxChange} checked={isChecked} />
      <Label htmlFor="price" className="text-sm ml-2">{`£${min} to £${max}`}</Label>
    </div>
  );
};

const renderPriceFilters = (products: Product[]) => {
  const priceRanges: { min: number; max: number }[] = [
    { min: 100, max: 499 },
    { min: 500, max: 999 },
    { min: 1000, max: 5000 },
  ];

  const [selectedRanges, setSelectedRanges] = useState<{ min: number; max: number }[]>([]);

  const handlePriceFilterChange = (newRange: { min: number; max: number } | null, min: number, max: number) => {
    // If a range is selected, add it to the array
    if (newRange) {
      setSelectedRanges([...selectedRanges, newRange]);
    } else {
      // If the checkbox is unchecked, remove the corresponding range from the array
      const updatedRanges = selectedRanges.filter(
        (range) => range.min !== min || range.max !== max
      );
      setSelectedRanges(updatedRanges);
    }
  };

  // Calculate the overall minimum and maximum values from all selected ranges
  const overallMin = Math.min(...selectedRanges.map((range) => range.min));
  const overallMax = Math.max(...selectedRanges.map((range) => range.max));

  return (
    <>
      <h4 className="text-sm font-sans mb-1 mt-4">By Price</h4>
      {priceRanges.map(({ min, max }, idx) => (
        <PriceFilter
          key={idx}
          min={min}
          max={max}
          onChange={(newRange) => handlePriceFilterChange(newRange, min, max)}
          isChecked={
            selectedRanges.some((range) => range.min === min && range.max === max)
          }
        />
      ))}
      <div>
        <p>£{overallMin} to £{overallMax}</p>
      </div>
    </>
  );
};

export const ProductPriceFilter: React.FC = () => {
  const { data } = useGetProducts();
  return renderPriceFilters(data?.data.products || []); // Pass an empty array if data is undefined
};