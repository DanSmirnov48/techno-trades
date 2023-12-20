import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateProfile from "../forms/UpdateProfile";
import ResetPassword from "../forms/ResetPassword";
import CloseAccount from "../forms/CloseAccount";

export default function DashboardAccount() {
  return (
    <Shell>
      <Header
        title="Account"
        description="Manage your personal and account deatils."
        size="default"
      />
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <UpdateProfile />
          <CloseAccount />
        </TabsContent>
        <TabsContent value="password">
          <ResetPassword />
        </TabsContent>
        <TabsContent value="address">

        </TabsContent>
      </Tabs>
    </Shell>
  );
}
