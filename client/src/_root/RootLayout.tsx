import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full 4xl:flex">
      
      <Navbar />

      <section className="flex flex-1 min-h-screen">
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
