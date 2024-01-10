import { Separator } from "../ui/separator";
import HideOutOfStock from "./HideOutOfStock";
import ProductBrandFilters from "./ProductBrandFilters";
import { ProductPriceFilter } from "./ProductPriceFilter";
import { ProductRatingFilter } from "./ProductRatingFilter";
import AppliedFilters from "./AppliedFilters";

const ProductFilters: React.FC = () => {
  return (
    <div className="bg-white h-full rounded-2xl shadow-xl">
      <h1 className="text-left text-2xl font-semibold py-4 px-8 text-dark-4">
        Filters
      </h1>
      <Separator />
      <div className="flex flex-col h-full mx-8">
        <AppliedFilters/>
        <HideOutOfStock />
        <ProductPriceFilter />
        <ProductBrandFilters />
        <ProductRatingFilter />
      </div>
    </div>
  );
};

export default ProductFilters;