import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <section className="flex flex-1 min-h-screen bg-background font-sans antialiased">
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
