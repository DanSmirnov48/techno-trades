import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useCategoryFilter } from "@/hooks/store";
import { categoriesValues } from "@/constants/idnex";

const ProductCategoryFilter = () => {
  const { selectedCategories, toggleCategory } = useCategoryFilter();

  return (
    <>
      {categoriesValues.sort().map((category, index) => (
        <div
          key={index}
          className="flex flex-row mx-0 my-1 justify-start items-center"
        >
          <Checkbox
            id={category}
            checked={selectedCategories.includes(category)}
            onCheckedChange={() => toggleCategory(category)}
          />
          <Label htmlFor={category} className="ml-2 capitalize font-jost text-base dark:text-light-2 transform transition duration-500 ease-in-out">
            {category}
          </Label>
        </div>
      ))}
    </>
  );
};

export default ProductCategoryFilter;
