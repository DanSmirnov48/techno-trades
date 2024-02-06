import { Separator } from "../ui/separator";
import HideOutOfStock from "./HideOutOfStock";
import ProductBrandFilters from "./ProductBrandFilters";
import { ProductPriceFilter } from "./ProductPriceFilter";
import { ProductRatingFilter } from "./ProductRatingFilter";
import AppliedFilters from "./AppliedFilters";
import ProductCategoryFilter from "./ProductCategoryFilter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const ProductFilters: React.FC = () => {
  return (
    <div className="bg-background dark:bg-dark-4 h-full rounded-2xl shadow-xl transform transition duration-500 ease-in-out">
      <h1 className="text-left text-2xl font-semibold py-4 px-8 text-dark-4 dark:text-white/80">
        Filters
      </h1>
      <Separator />

      <div className="flex flex-col mx-8 gap-4 my-4">
        <AppliedFilters />
        <HideOutOfStock />
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={["price", "category", "brands", "rating"]}>
        {/* <Accordion type="multiple" className="w-full" defaultValue={["applied-filters", "price", "category", "brands", "rating"]}>
        <AccordionItem value="applied-filters">
            <AccordionTrigger>Applied Filters</AccordionTrigger>
            <AccordionContent>
              <AppliedFilters />
            </AccordionContent>
          </AccordionItem> */}

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <ProductPriceFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" >
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <ProductCategoryFilter />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <ProductBrandFilters />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <ProductRatingFilter />
          </AccordionContent>
        </AccordionItem>

      </Accordion>

    </div>
  );
};

export default ProductFilters;