import { Shell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTable from '@/components/tables/products-table/data'
import OrdersTable from '@/components/tables/orders-table/data'
import UsersTable from "@/components/tables/users-table/data";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('products');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['products', 'orders', 'users'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/data-tables?tab=${value}`);
  };

  return (
    <Shell variant={"default"}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="products">Products</TabsTrigger>
          <TabsTrigger className="w-full" value="orders">Orders</TabsTrigger>
          <TabsTrigger className="w-full" value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTable />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}