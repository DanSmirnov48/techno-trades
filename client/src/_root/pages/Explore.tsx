import { ProductFilters, ProductSorting, GridProductList, ListProductList } from "@/components/root";
import { FilterLoader } from "@/components/root/FilterLoader";
import { ProductLoader } from "@/components/root/ProductLoader";
import { useSorting, useBrandFilter, useStockFiltering, usePriceFilterStore, useRatingFilterStore, useCategoryFilter, useProductStore } from "@/hooks/store";
import { useGetFilteredProducts, useGetPaginatedProducts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent } from "@/components/ui/pagination"
import { sortCategories } from "@/constants/idnex";

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
        pageSize: selectedShowPerPage
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
    selectedShowPerPage
  ])

  const filteredAndSortedProducts = filteredProducts && filteredProducts.sort((a, b) => {
    const effectivePriceA = a.isDiscounted ? a.discountedPrice! : a.price;
    const effectivePriceB = b.isDiscounted ? b.discountedPrice! : b.price;

    switch (selectedSort) {
      case sortCategories[1].value: // "brandAsc"
        return a.brand.localeCompare(b.brand);
      case sortCategories[2].value: // "brandDesc"
        return b.brand.localeCompare(a.brand);
      case sortCategories[3].value: // "priceAsc"
        return effectivePriceA - effectivePriceB;
      case sortCategories[4].value: // "priceDesc"
        return effectivePriceB - effectivePriceA;
      case sortCategories[5].value: // "customerRating"
        return b.rating - a.rating;
      default:
        return 0;
    }
  })

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-100">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <div className="flex flex-row min-h-[65rem]">
          <div className="basis-1/4">
            {isProductLoading ? <FilterLoader /> : <ProductFilters />}
          </div>
          <div className="flex flex-col basis-3/4 ml-5">
            {!filteredProductsLoading && <ProductSorting />}
            {filteredProductsLoading ? <ProductLoader /> : totalProducts > 0 ? (
              isChecked ? (
                filteredAndSortedProducts && <GridProductList products={filteredAndSortedProducts} />
              ) : (
                filteredAndSortedProducts && <ListProductList products={filteredAndSortedProducts} />
              )
            ) : (
              <div className="flex flex-col items-center w-full justify-center h-full gap-3">
                <img src="/public/images/2762885.png" className="w-[30rem] object-contain" />
                <h1 className="text-4xl text-muted-foreground font-medium">Uh-oh! Looks like we can't keep up with you!</h1>
                <p className="text-xl text-muted-foreground font-extralight">Try removing some of the filters</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex rounded-xl border-2 shadow-lg bg-white my-5">
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