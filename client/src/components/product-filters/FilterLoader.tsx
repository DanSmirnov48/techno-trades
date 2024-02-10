import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const FilterLoader = () => {
  return (
    <Card className="h-full mb-4">
      <CardContent className="flex flex-col gap-16 mt-12">
        <div className="col-span-4 flex flex-col gap-4 ml-3">
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="col-span-4 flex flex-col gap-4 ml-3">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="col-span-4 flex flex-col gap-4 ml-3">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="col-span-4 flex flex-col gap-4 ml-3">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterLoader