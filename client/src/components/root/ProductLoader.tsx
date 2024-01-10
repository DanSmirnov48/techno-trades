import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductLoader() {

  const renderLoader = (index: number) => (
    <Card key={index} className="mb-4">
      <CardContent className="grid grid-flow-col gap-4 m-5">
        <div className="col-span-1 flex flex-col gap-5 w-full h-full items-center justify-center">
          <img className="opacity-10 animate-pulse h-52 w-52" src="/images/image-placeholder.png" />
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

  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="flex flex-row gap-7">
          <Skeleton className=" bg-white h-14 w-[300px] border-2" />
          <Skeleton className=" bg-white h-14 w-[150px] border-2" />
        </div>
        <div>
          <Skeleton className=" bg-white h-14 w-[220px] border-2" />
        </div>
      </div>
      <div>
        {[...Array(5)].map((_, index) => renderLoader(index))}
      </div>
    </>
  );
}