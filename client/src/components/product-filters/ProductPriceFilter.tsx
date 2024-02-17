import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { priceRanges } from "@/constants/idnex";
import { usePriceFilterStore } from "@/hooks/store";

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
      <Label htmlFor="price" className="font-jost text-base ml-2 dark:text-light-2 transform transition duration-500 ease-in-out">{`£${min} to £${max}`}</Label>
    </div>
  );
};

const ProductPriceFilter: React.FC = () => {
  const { selectedRanges, addSelectedRange, removeSelectedRange } = usePriceFilterStore();

  selectedRanges.length > 0 && console.log(selectedRanges[0].min + " - " + selectedRanges[selectedRanges.length - 1].max);

  const handlePriceFilterChange = (newRange: { min: number; max: number } | null, min: number, max: number) => {
    if (newRange) {
      addSelectedRange(newRange);
    } else {
      removeSelectedRange(min, max);
    }
  };

  return (
    <>
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

export default ProductPriceFilter