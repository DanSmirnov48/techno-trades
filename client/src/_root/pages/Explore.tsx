import { ProductFilters, ProductSorting, GridProductList, ListProductList } from "@/components/root";
import { FilterLoader } from "@/components/root/FilterLoader";
import { ProductLoader } from "@/components/root/ProductLoader";
import { useSorting, useFiltering, useRatingFiltering, useStockFiltering } from "@/hooks/store";
import { useGetPaginatedProducts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pagination, PaginationContent } from "@/components/ui/pagination"

const Explore = () => {
  const location = useLocation();
  const { isChecked, selectedShowPerPage } = useSorting();
  const { selectedBrands } = useFiltering();
  const { hideOutOfStock } = useStockFiltering();
  const { minRating, maxRating } = useRatingFiltering()

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending: isProductLoading, refetch } = useGetPaginatedProducts(currentPage, selectedShowPerPage);

  const totalPages = Math.ceil((data?.data.totalProducts || 0) / selectedShowPerPage);

  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  const filteredProducts = data && data.data.products.filter((product: { brand: string; category: string; countInStock: number; }) => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
    if (category && product.category !== category) return false;
    if (hideOutOfStock === true && product.countInStock === 0) return false;
    return true;
  });

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
            {isProductLoading ? <ProductLoader /> : (
              isChecked ?
                <GridProductList products={filteredProducts} />
                :
                <ListProductList products={filteredProducts} />
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