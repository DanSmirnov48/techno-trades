import { useGetProducts } from "@/lib/react-query/queries";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { usePriceFilterStore } from "@/hooks/store";

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
      <Label htmlFor="price" className="text-sm ml-2">{`£${min} to £${max} (${productCount})`}</Label>
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

  const priceRanges: { min: number; max: number }[] = [
    { min: 10, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 5000 },
  ];

  useEffect(() => {
    const countByRange: { [key: string]: number } = {};
    priceRanges.forEach(({ min, max }) => {
      const count = data?.data.products.filter((product: { price: number; }) => product.price >= min && product.price <= max).length || 0;
      countByRange[`${min}-${max}`] = count;
    });
    setProductsCountByRange(countByRange);
  }, [data?.data.products]);

  return (
    <div>
      <h4>By Price</h4>
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
    </div>
  );
};