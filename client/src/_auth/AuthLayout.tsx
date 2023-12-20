import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthLayout() {

  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <img
            src="https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
}