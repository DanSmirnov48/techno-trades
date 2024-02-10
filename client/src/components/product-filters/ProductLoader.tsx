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
        <div className="col-span-1 flex flex-col gap-5 w-full h-full items-center justify-center">
          <img className="opacity-10 animate-pulse h-64 w-64" src="/images/image-placeholder.png" />
        </div>
        <div className="col-span-4 flex flex-col gap-5 w-full h-full items-center justify-center">
          <Skeleton className="h-10 w-4/5" />
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
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-10 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );

  const renderProductGridLoader = (index: number) => (
    <Card key={index} className="mb-4">
      <CardContent className="flex flex-col gap-8 my-6">
        <div className="flex items-center justify-center">
          <img className="opacity-10 animate-pulse h-64 w-64" src="/images/image-placeholder.png" />
        </div>
        <div className="col-span-4 flex flex-col gap-6 w-full h-full items-center justify-center">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
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
          {[...Array(12)].map((_, index) => renderProductLoader(index))}
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