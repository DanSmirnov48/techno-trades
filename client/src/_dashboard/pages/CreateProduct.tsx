import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";
import ProductCreateForm from "../forms/ProductCreateForm";

export default function DashboardAccount() {
  return (
    <Shell>
      <Header
        title="Create new Product"
        size="default"
      />
      <div className="grid gap-10">
        <ProductCreateForm />
      </div>
    </Shell>
  );
}
