import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import AuthLayout from "./_auth/AuthLayout";
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "./_dashboard/DashboardLayout";
import { useUserContext } from "./context/AuthContext";
import { authRoutes, dashboardRoutes, publicRoutes } from "./config";
import ProtectedRoute, { ProtectedRouteProps } from "./components/root/ProtectedRoute";

export default function App() {
  const { isAuthenticated, user, isLoading } = useUserContext();

  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: isAuthenticated,
    redirectPath: '/auth/sign-in',
    userId: user._id,
    accountType: user.accountType,
    loading: isLoading
  };

  return (
    <main className="flex">
      <Routes>
        <Route element={<AuthLayout />}>
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.outlet} />
          ))}
        </Route>

        <Route element={<RootLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute
                    {...defaultProtectedRouteProps}
                    {...route.protectedRouteProps}
                    outlet={route.outlet}
                    allowedAccountTypes={route.allowedAccountTypes}
                  />
                ) : (
                  route.outlet
                )
              }
            />
          ))}
        </Route>

        <Route element={<DashboardLayout />}>
          {dashboardRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  {...defaultProtectedRouteProps}
                  {...route.additionalProps}
                  outlet={route.outlet}
                  allowedAccountTypes={route.allowedAccountTypes}
                />
              }
            />
          ))}
        </Route>
      </Routes>
      <Toaster expand={false} position="top-right" richColors closeButton className="" />
    </main>
  );
}