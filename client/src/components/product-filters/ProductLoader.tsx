import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductLoaderProps {
  displayType: 'grid' | 'list';
  showFilterLoader?: boolean;
}

const ProductLoader = ({ displayType, showFilterLoader = false }: ProductLoaderProps) => {

  const renderProductLoader = (index: number) => {
    if (displayType === 'grid') {
      return renderProductGridLoader(index);
    } else if (displayType === 'list') {
      return renderProductListLoader(index);
    }
    return null;
  };

  const renderProductListLoader = (index: number) => (
    <Card key={index} className="mb-4">
      <CardContent className="grid grid-flow-col gap-4 my-12">
        <div className="col-span-2 flex flex-col gap-5 w-full h-full items-center justify-center bg-gray-100/50 rounded-xl dark:bg-gray-700">
          <svg className="w-40 h-40 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="col-span-4 flex flex-col gap-5 w-full h-full items-center justify-center">
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="col-span-4 flex flex-col gap-5 w-full h-full items-center justify-center">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-10 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );

  const renderProductGridLoader = (index: number) => (
    <Card key={index} className="mb-4">
      <CardContent className="flex flex-col gap-8 my-6">
        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded sm:h-[12rem] dark:bg-gray-700">
          <svg className="w-28 h-28 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="flex flex-col gap-8 w-full h-full items-center justify-center">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const renderProductFilterLoader = () => (
    <div className="flex justify-between mb-3">
      <div className="flex flex-row gap-7">
        <Skeleton className=" bg-white h-14 w-[300px] border-2" />
        <Skeleton className=" bg-white h-14 w-[150px] border-2" />
      </div>
      <div>
        <Skeleton className=" bg-white h-14 w-[220px] border-2" />
      </div>
    </div>
  )

  return (
    <>
      {showFilterLoader && renderProductFilterLoader()}

      {displayType === 'grid' ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
          {[...Array(9)].map((_, index) => renderProductLoader(index))}
        </div>
      ) : (
        <div className="w-full">
          {[...Array(5)].map((_, index) => renderProductLoader(index))}
        </div>
      )}
    </>
  );
}

export default ProductLoader