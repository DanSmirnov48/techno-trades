import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import { SigninForm, SignupForm } from "./_auth/forms";
// import { Toaster } from "./components/ui/toaster";
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "./_dashboard/DashboardLayout";
import { Dashboard, Account, Tables, ProductCreateForm } from "./_dashboard/pages";

export default function App() {
  return (
    <main className="flex">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* Public Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/account/:id" element={<Account />} />

          {/* User Dashboard Routes FOR ADMINS*/}
          <Route path="/dashboard/data-tables" element={<Tables />} />
          <Route path="/dashboard/product" element={<ProductCreateForm />} />
        </Route>
      </Routes>
      <Toaster expand={false} position="top-right" richColors closeButton className=""/>
    </main>
  );
}