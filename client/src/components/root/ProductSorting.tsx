import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Icons } from "../icons";
import { useSorting } from "@/hooks/store";
import { showPerPage, sortCategories } from "@/constants/idnex";

const ProductSorting: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    isChecked, setSort,
    selectedSort, toggleCheckbox,
    selectedShowPerPage, setShowPerPage,
  } = useSorting();

  // // Update URL search params when sorting options change
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   params.set('sort', selectedSort);
  //   params.set('show', selectedShowPerPage);
  //   navigate({ search: `?${params.toString()}` });
  // }, [location.search, navigate, selectedSort, selectedShowPerPage]);

  // // Parse URL search params on component mount
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const sortParam = params.get('sort');
  //   const showParam = params.get('show');

  //   if (sortParam && sortCategories.some((category) => category.value === sortParam)) {
  //     setSort(sortParam);
  //   }

  //   if (showParam && showPerPage.some((option) => option.value === showParam)) {
  //     setShowPerPage(showParam);
  //   }
  // }, [location.search, setSort, setShowPerPage]);

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
      <div>
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
    </div>
  );
};

export default ProductSorting;