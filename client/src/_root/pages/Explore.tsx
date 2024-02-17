import { useEffect, useState } from "react";
import { GridProductList, ListProductList } from "@/components/shared";
import { Pagination, PaginationContent } from "@/components/ui/pagination"
import { useGetFilteredProducts, useGetPaginatedProducts } from "@/lib/react-query/queries";
import { FilterLoader, ProductFilters, ProductLoader, ProductSearch, ProductSorting } from "@/components/product-filters";
import { useSorting, useBrandFilter, useStockFiltering, usePriceFilterStore, useRatingFilterStore, useCategoryFilter, useProductStore } from "@/hooks/store";

const Explore = () => {

  const { hideOutOfStock } = useStockFiltering();
  const { isChecked, selectedShowPerPage, selectedSort } = useSorting();

  const { selectedRanges } = usePriceFilterStore();
  const { selectedCategories } = useCategoryFilter();
  const { selectedBrands } = useBrandFilter();
  const { selectedRatings } = useRatingFilterStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isPending: isProductLoading } = useGetPaginatedProducts(currentPage, selectedShowPerPage);

  const filteredProducts = useProductStore((state) => state.filteredProducts);
  const totalProducts = useProductStore((state) => state.totalProducts);

  const totalPages = Math.ceil(totalProducts / selectedShowPerPage);

  const { mutateAsync: filterProducts, isPending: filteredProductsLoading } = useGetFilteredProducts()

  useEffect(() => {
    const handle = async () => {
      await filterProducts({
        hideOutOfStock: hideOutOfStock,
        prices: selectedRanges,
        brands: selectedBrands,
        categories: selectedCategories,
        ratings: selectedRatings,
        page: currentPage,
        pageSize: selectedShowPerPage,
        sort: selectedSort
      })
    }
    handle()
    return
  }, [
    hideOutOfStock,
    selectedRanges,
    selectedBrands,
    selectedCategories,
    selectedRatings,
    currentPage,
    selectedShowPerPage,
    selectedSort
  ])

  return (
    <div className="flex flex-col flex-1 items-center bg-[#F3F3F3] dark:bg-dark-2 transform transition duration-500 ease-in-out">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <ProductSearch />
        <div className="flex flex-row min-h-[65rem]">
          <div className="basis-1/4 hidden xl:block">
            {isProductLoading ? <FilterLoader /> : <ProductFilters />}
          </div>
          <div className="flex flex-col xl:basis-3/4 lg:basis-full xl:ml-5">
            {!filteredProductsLoading && <ProductSorting />}
            {filteredProductsLoading ? <ProductLoader displayType={isChecked ? 'grid' : 'list'} showFilterLoader /> : (filteredProducts && totalProducts > 0) ? (
              isChecked ? (
                <GridProductList products={filteredProducts} />
              ) : (
                <ListProductList products={filteredProducts} />
              )
            ) : (
              <div className="flex flex-col items-center w-full justify-center h-full gap-3">
                <img src="/images/2762885.png" className="w-[30rem] object-contain" />
                <h1 className="text-4xl text-muted-foreground font-medium">Uh-oh! Looks like we can't keep up with you!</h1>
                <p className="text-xl text-muted-foreground font-extralight">Try removing some of the filters</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex rounded-xl border-2 shadow-lg bg-white dark:bg-dark-4 my-5 transform transition duration-500 ease-in-out">
          <Pagination>
            <PaginationContent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Explore;