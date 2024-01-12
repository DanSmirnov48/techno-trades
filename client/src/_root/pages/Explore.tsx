import { ProductFilters, ProductSorting, GridProductList, ListProductList } from "@/components/root";
import { FilterLoader } from "@/components/root/FilterLoader";
import { ProductLoader } from "@/components/root/ProductLoader";
import { useSorting, useBrandFilter, useStockFiltering, usePriceFilterStore, sortCategories, useRatingFilterStore, useCategoryFilter, useProductStore } from "@/hooks/store";
import { useGetFilteredProducts, useGetPaginatedProducts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagination, PaginationContent } from "@/components/ui/pagination"

const Explore = () => {
  const location = useLocation();

  const { hideOutOfStock } = useStockFiltering();
  const { isChecked, selectedShowPerPage, selectedSort } = useSorting();

  const { selectedRanges, addSelectedRange, removeSelectedRange } = usePriceFilterStore();
  const { selectedCategories, toggleCategory, setCategories } = useCategoryFilter();
  const { selectedBrands, toggleBrand, setBrands } = useBrandFilter();
  const { selectedRatings, addSelectedRating, removeSelectedRating } = useRatingFilterStore();

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending: isProductLoading, refetch } = useGetPaginatedProducts(currentPage, selectedShowPerPage);

  const totalPages = Math.ceil((data?.data.totalProducts || 0) / selectedShowPerPage);

  const filteredProducts = useProductStore((state) => state.filteredProducts);

  const { mutateAsync, isPending } = useGetFilteredProducts()

  useEffect(() => {
    const handle = async () => {
      await mutateAsync({
        prices: selectedRanges,
        brands: selectedBrands,
        categories: selectedCategories,
        ratings: selectedRatings
      })
    }
    handle()
    return
  }, [
    selectedRanges, addSelectedRange, removeSelectedRange,
    selectedBrands, toggleBrand, setBrands,
    selectedCategories, toggleCategory, setCategories,
    selectedRatings, addSelectedRating, removeSelectedRating,
  ])
// 
  const filteredAndSortedProducts = filteredProducts && filteredProducts
    .filter((product: { countInStock: number }) => {
      if (hideOutOfStock === true && product.countInStock === 0) return false;
      return true;
    })
    .sort((a, b) => {
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

  useEffect(() => {
    refetch();
  }, [selectedShowPerPage]);

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-100">
      <div className="w-full px-2.5 md:px-10 my-20 max-w-screen-2xl">
        <div className="flex flex-row min-h-[65rem]">
          <div className="basis-1/4">
            {isProductLoading ? <FilterLoader /> : <ProductFilters />}
          </div>
          <div className="flex flex-col basis-3/4 ml-5">
            {!isProductLoading && <ProductSorting />}
            {(isProductLoading || isPending) ? <ProductLoader /> : (
              isChecked ? (
                filteredAndSortedProducts && <GridProductList products={filteredAndSortedProducts} />
              ) : (
                filteredAndSortedProducts && <ListProductList products={filteredAndSortedProducts} />
              )
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