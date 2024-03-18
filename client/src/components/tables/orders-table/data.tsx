import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetOrders } from "@/lib/react-query/queries/order-queries";

export default function Table() {
  const { data, isLoading } = useGetOrders();

  {!isLoading && console.log(data.orders)}

  return isLoading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    <DataTable columns={columns} data={data.orders} />
  );
}
