import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetProducts } from "@/lib/react-query/queries/product-queries";

export default function ProductsTable() {
  const { data, isLoading } = useGetProducts();
  return isLoading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <DataTable columns={columns} data={data?.data.products} />
  );
}
