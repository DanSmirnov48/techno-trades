import { Shell } from "@/components/dashboard/shell";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/dashboard/header";
import { columns } from "@/components/tables/archive-table/columns";
import { DataTable } from "@/components/tables/products-table/data-table";
import { useGetArchivedProducts } from "@/lib/react-query/queries/product-queries";

const Archive = () => {
    const { data, isLoading } = useGetArchivedProducts();

    return isLoading ? (
        <>
            <h1>loading</h1>
        </>
    ) : (
        <Shell>
            <Header
                title="Archive"
                description="Manage all the Archived prioducts here."
            />
            <Separator />
            <DataTable columns={columns} data={data?.data.products} />
        </Shell>
    );
};

export default Archive;
