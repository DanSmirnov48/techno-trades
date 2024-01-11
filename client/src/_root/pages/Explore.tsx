import { ProductFilters, ProductSorting, GridProductList, ListProductList } from "@/components/root";
import { FilterLoader } from "@/components/root/FilterLoader";
import { ProductLoader } from "@/components/root/ProductLoader";
import { useSorting, useFiltering, useStockFiltering, usePriceFilterStore, sortCategories, useRatingFilterStore, useCategoryFilter } from "@/hooks/store";
import { useGetPaginatedProducts, useGetProducts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagination, PaginationContent } from "@/components/ui/pagination"

const Explore = () => {
  const location = useLocation();
  const { isChecked, selectedShowPerPage, selectedSort } = useSorting();
  const { selectedBrands } = useFiltering();
  const { hideOutOfStock } = useStockFiltering();
  const { selectedRanges } = usePriceFilterStore();
  const { selectedRatings } = useRatingFilterStore();
  const { selectedCategories } = useCategoryFilter();

  const highestPrice = selectedRanges.length > 0 ? Math.max(...selectedRanges.map((range) => range.max)) : null;
  const lowestPrice = selectedRanges.length > 0 ? Math.min(...selectedRanges.map((range) => range.min)) : null;

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending: isProductLoading, refetch } = useGetPaginatedProducts(currentPage, selectedShowPerPage);
  // const { data, isPending: isProductLoading, refetch } = useGetProducts();

  const totalPages = Math.ceil((data?.data.totalProducts || 0) / selectedShowPerPage);

  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const filteredAndSortedProducts = data && data.data.products
    .filter((product:
      {
        countInStock: number;
        brand: string;
        rating: number;
        category: string;
        isDiscounted: boolean;
        discountedPrice: number;
        price: number;
      }) => {
      if (hideOutOfStock === true && product.countInStock === 0) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (selectedRatings.length > 0 && !selectedRatings.includes(product.rating)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (category && product.category !== category) return false;
      if (selectedRanges.length > 0 && lowestPrice && highestPrice) {
        if (product.price < lowestPrice || product.price > highestPrice) return false;
      }
      return true;
    })
    .sort((a: {
      brand: string;
      isDiscounted: boolean;
      discountedPrice: number;
      price: number;
      customerRating: number;
    }, b: {
      brand: string;
      isDiscounted: boolean;
      discountedPrice: number;
      price: number;
      customerRating: number;
    }) => {
      const effectivePriceA = a.isDiscounted ? a.discountedPrice : a.price;
      const effectivePriceB = b.isDiscounted ? b.discountedPrice : b.price;

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
          return b.customerRating - a.customerRating;
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
            {isProductLoading ? <ProductLoader /> : filteredAndSortedProducts.length > 0 ? (
              isChecked ? (
                <GridProductList products={filteredAndSortedProducts} />
              ) : (
                <ListProductList products={filteredAndSortedProducts} />
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