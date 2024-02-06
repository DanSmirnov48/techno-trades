import { useGetProducts } from "@/lib/react-query/queries";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { usePriceFilterStore } from "@/hooks/store";
import { priceRanges } from "@/constants/idnex";

interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (selectedRange: { min: number; max: number } | null) => void;
  isChecked: boolean;
  productCount: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ min, max, onChange, isChecked, productCount }) => {
  const handleCheckboxChange = () => {
    const newRange = isChecked ? null : { min, max };
    onChange(newRange);
  };

  return (
    <div className="flex flex-row mx-0 my-1 justify-start items-center">
      <Checkbox id="price" className="mr-1" onCheckedChange={handleCheckboxChange} checked={isChecked} />
      <Label htmlFor="price" className="font-jost text-base ml-2 dark:text-light-2 transform transition duration-500 ease-in-out">{`£${min} to £${max} (${productCount})`}</Label>
    </div>
  );
};

export const ProductPriceFilter: React.FC = () => {
  const { selectedRanges, addSelectedRange, removeSelectedRange } = usePriceFilterStore();
  const [productsCountByRange, setProductsCountByRange] = useState<{ [key: string]: number }>({});
  const { data } = useGetProducts();

  const handlePriceFilterChange = (newRange: { min: number; max: number } | null, min: number, max: number) => {
    if (newRange) {
      addSelectedRange(newRange);
    } else {
      removeSelectedRange(min, max);
    }
  };

  useEffect(() => {
    const countByRange: { [key: string]: number } = {};
    priceRanges.forEach(({ min, max }) => {
      const count = data?.data.products.filter((product: { price: number; }) => product.price >= min && product.price <= max).length || 0;
      countByRange[`${min}-${max}`] = count;
    });
    setProductsCountByRange(countByRange);
  }, [data?.data.products]);

  return (
    <>
      {priceRanges.map(({ min, max }, idx) => (
        <PriceFilter
          key={idx}
          min={min}
          max={max}
          onChange={(newRange) => handlePriceFilterChange(newRange, min, max)}
          isChecked={selectedRanges.some((range) => range.min === min && range.max === max)}
          productCount={productsCountByRange[`${min}-${max}`] || 0}
        />
      ))}
    </>
  );
};