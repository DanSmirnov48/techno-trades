import { CardSkeleton } from "@/components/dashboard/card-skeleton";
import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";

export default function Dashboard() {
  return (
    <Shell className="">
      <Header
        title="Dashboard"
        description="Manage Dashboard Settings here..."
      />
      <div className="grid gap-10">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </Shell>
  );
}
