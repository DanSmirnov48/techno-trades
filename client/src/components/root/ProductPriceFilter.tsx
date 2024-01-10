import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { usePriceFilterStore } from "@/hooks/store";

interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (selectedRange: PriceRange | null) => void;
  isChecked: boolean;
}

interface PriceRange {
  min: number;
  max: number;
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

export const ProductPriceFilter: React.FC = () => {
  const { selectedRanges, addSelectedRange, removeSelectedRange } = usePriceFilterStore();

  const handlePriceFilterChange = (newRange: PriceRange | null, min: number, max: number) => {
    if (newRange) {
      addSelectedRange(newRange);
    } else {
      removeSelectedRange(min, max);
    }
  };

  const priceRanges: { min: number; max: number }[] = [
    { min: 100, max: 499 },
    { min: 500, max: 999 },
    { min: 1000, max: 5000 },
  ];

  return (
    <>
      <h4 className="text-sm font-sans mb-1 mt-4">By Price</h4>
      {priceRanges.map(({ min, max }, idx) => (
        <PriceFilter
          key={idx}
          min={min}
          max={max}
          onChange={(newRange) => handlePriceFilterChange(newRange, min, max)}
          isChecked={selectedRanges.some((range) => range.min === min && range.max === max)}
        />
      ))}
    </>
  );
};