import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import { Cart, CkeckoutSuccess, Deals, Explore, Home, NotFound, ProductDetails } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import { SigninForm, SignupForm } from "./_auth/forms";
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "./_dashboard/DashboardLayout";
import { Dashboard, Account, Tables, ProductCreateForm, Notifications, Appearance, Favourites, Orders } from "./_dashboard/pages";
import ProtectedRoute, { ProtectedRouteProps, UserRole } from "./components/ProtectedRoute";
import { useUserContext } from "./context/AuthContext";

export default function App() {
  const { isAuthenticated, user } = useUserContext();

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: isAuthenticated,
    redirectPath: '/sign-in',
    currentRole: user.role as UserRole,
  };

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
          <Route path="/dashboard" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard />} allowedRoles={['admin', "user"]} />} />
          <Route path="/dashboard/account/:id" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Account />} allowedRoles={['admin', "user"]} />} />
          <Route path="/dashboard/my-orders/:id" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Orders />} allowedRoles={['admin', "user"]} />} />
          <Route path="/dashboard/notifications/:id" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Notifications />} allowedRoles={['admin', "user"]} />} />
          <Route path="/dashboard/appearance/:id" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Appearance />} allowedRoles={['admin', "user"]} />} />
          <Route path="/dashboard/favourites/:id" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Favourites />} allowedRoles={['admin', "user"]} />} />

          {/* User Dashboard Routes FOR ADMINS*/}
          <Route path="/dashboard/data-tables" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Tables />} allowedRoles={['admin']} />} />
          <Route path="/dashboard/product" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<ProductCreateForm />} allowedRoles={['admin']} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster expand={false} position="top-right" richColors closeButton className="" />
    </main>
  );
}