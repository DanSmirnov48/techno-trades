import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import { Cart, CkeckoutSuccess, Deals, Explore, Home, NotFound, ProductDetails } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import { SigninForm, SignupForm } from "./_auth/forms";
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "./_dashboard/DashboardLayout";
import { Dashboard, Account, Tables, ProductCreateForm, Notifications, Appearance, Favourites } from "./_dashboard/pages";

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
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout-success" element={<CkeckoutSuccess />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/account/:id" element={<Account />} />
          <Route path="/dashboard/notifications/:id" element={<Notifications />} />
          <Route path="/dashboard/appearance/:id" element={<Appearance />} />
          <Route path="/dashboard/favourites/:id" element={<Favourites />} />

          {/* User Dashboard Routes FOR ADMINS*/}
          <Route path="/dashboard/data-tables" element={<Tables />} />
          <Route path="/dashboard/product" element={<ProductCreateForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster expand={false} position="top-right" richColors closeButton className=""/>
    </main>
  );
}