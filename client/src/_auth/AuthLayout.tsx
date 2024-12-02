import { Outlet, Navigate, Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-accent dark:bg-dark-3 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <div className="absolute right-40 top-5 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-600 opacity-20 blur-[100px]"></div>
      <div className="absolute left-40 bottom-20 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-600 opacity-20 blur-[100px]"></div>
      <section className="flex flex-1 justify-center items-center flex-col py-10 relative h-screen">
        <Link
          to="/"
          className={buttonVariants({
            variant: "ghost",
            size: "lg",
            className:
              "text-sm text-muted-foreground underline bg-accent border absolute left-5 top-5",
          })}
        >
          <Icons.left className="w-4 h-4 mr-1.5" />
          Home
        </Link>
        <Outlet />
      </section>
    </div>
  );
}