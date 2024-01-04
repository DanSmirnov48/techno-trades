import { Separator } from "../ui/separator";
import ProductBrandFilters from "./ProductBrandFilters";
import { ProductRatingFilter } from "./ProductRatingFilter";

const ProductFilters: React.FC = () => {
  return (
    <div className="bg-white h-full rounded-2xl shadow-xl">
      <h1 className="text-left text-2xl font-semibold py-4 px-8 text-dark-4">Filters</h1>
      <Separator />
      <div className="flex flex-col h-full mx-8">
        <ProductBrandFilters />
        <ProductRatingFilter />
      </div>
    </div>
  );
};

export default ProductFilters;
