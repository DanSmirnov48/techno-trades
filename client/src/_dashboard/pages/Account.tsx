import { useState, useEffect } from "react";
import LastSignIn from "../forms/LastSignIn";
import CloseAccount from "../forms/CloseAccount";
import UpdateProfile from "../forms/UpdateProfile";
import ResetPassword from "../forms/ResetPassword";
import { Shell } from "@/components/dashboard/shell";
import { useUserContext } from "@/context/AuthContext";
import { Header } from "@/components/dashboard/header";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateUserEmail from "../forms/UpdateUserEmail";

export default function DashboardAccount() {
  const location = useLocation();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('account');
  const { user } = useUserContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['account', 'password', 'address'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/account/${user._id}?tab=${value}`);
  };
  return (
    <Shell>
      <Header
        title="Account"
        description="Manage your personal and account deatils."
        size="default"
      />
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger disabled value="address">Address</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <LastSignIn />
          <UpdateProfile />
          <UpdateUserEmail />
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
