import { Icons } from "../shared";
import { MobileProductFilters } from ".";
import { useSorting } from "@/hooks/store";
import { showPerPage, sortCategories } from "@/constants/idnex";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ProductSorting: React.FC = () => {
  const {
    isChecked, setSort,
    selectedSort, toggleCheckbox,
    selectedShowPerPage, setShowPerPage,
  } = useSorting();

  return (
    <div className="flex justify-between mb-3 transform transition duration-500 ease-in-out">
      <div className="flex flex-row gap-7">
        <>
          <Select onValueChange={(value) => setSort(value)} value={selectedSort}>
            <SelectTrigger className="h-14 w-[300px] bg-background dark:bg-dark-4 transform transition duration-500 ease-in-out">
              <SelectValue placeholder={sortCategories[0].label} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {sortCategories.map((status, index) => (
                  <SelectItem key={index} value={status.value}>
                    <span>{status.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
        <>
          <Select
            onValueChange={(value) => setShowPerPage(+value)}
            value={selectedShowPerPage.toString()}
          >
            <SelectTrigger className="h-14 w-[150px] bg-background dark:bg-dark-4 transform transition duration-500 ease-in-out">
              <SelectValue placeholder={showPerPage[0].label} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {showPerPage.map((status, index) => (
                  <SelectItem key={index} value={status.value.toString()}>
                    <span>{status.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      </div>
      <div className="hidden xl:block">
        <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-lg bg-background dark:bg-dark-4 p-2 transform transition duration-500 ease-in-out'>
          <input
            type='checkbox'
            className='sr-only'
            checked={isChecked}
            onChange={() => toggleCheckbox()}
          />
          <span
            className={`flex items-center space-x-[6px] rounded-md py-2 px-[20px] text-base font-medium 
            ${!isChecked ? 'text-primary bg-[#f4f7ff] dark:bg-dark-2' : 'text-body-color'}`}
          >
            <Icons.list className="mr-2" />
            List
          </span>
          <span
            className={`flex items-center space-x-[6px] rounded-md py-2 px-[20px] text-base font-medium 
            ${isChecked ? 'text-primary bg-[#f4f7ff] dark:bg-dark-2' : 'text-body-color'}`}
          >
            <Icons.grid className="mr-2" />
            Grid
          </span>
        </label>
      </div>
      <MobileProductFilters />
    </div>
  );
};

export default ProductSorting;