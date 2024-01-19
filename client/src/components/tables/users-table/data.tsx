import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useGetAllUsers } from "@/lib/react-query/queries";

export default function UsersTable() {
  const { data, isLoading } = useGetAllUsers();
  return isLoading ? (
    <>
      <h1>loading</h1>
    </>
  ) : (
    //@ts-ignore
    <DataTable columns={columns} data={data?.data} />
  );
}
