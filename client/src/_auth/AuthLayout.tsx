import { Outlet, Navigate, Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared";

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
            className="hidden xl:block h-[100vh] w-1/2 object-cover bg-no-repeat"
          />
          <section className="flex flex-1 justify-center items-center flex-col py-10 relative">
            <Link
              to="/"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "text-sm text-muted-foreground underline bg-accent/50 absolute left-5 top-5",
              })}
            >
              <Icons.left className="w-4 h-4 mr-1.5"/>
              Home
            </Link>
            <Outlet />
          </section>
        </>
      )}
    </>
  );
}