import { Shell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTable from '@/components/tables/products-table/data'

export default function Dashboard() {
  return (
    <Shell variant={"default"}>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="products">Products</TabsTrigger>
          <TabsTrigger className="w-full" value="orders">Orders</TabsTrigger>
          <TabsTrigger className="w-full" value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable />
        </TabsContent>
        <TabsContent value="orders">
          <h1>Orders</h1>
        </TabsContent>
        <TabsContent value="users">
          <h1>Users</h1>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
