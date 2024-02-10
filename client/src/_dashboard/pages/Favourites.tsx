import { Shell } from "@/components/dashboard/shell";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/dashboard/header";
import FavoredProducts from "@/components/dashboard/favored-products";

export default function DashboardFavourites() {
  return (
    <Shell>
      <Header title="Favourites" description="Manage your favourite products" />

      <div className="grid gap-10">
        <Separator />
        <FavoredProducts />
      </div>
    </Shell>
  );
}
