import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/dashboard/side-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardConfig } from "@/config/dashboard";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <div className="container xl:px-0 flex-1 items-start md:grid md:grid-cols-[100px_minmax(0,1fr)] md:gap-1 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-5 bg-light-1 dark:bg-dark-2 transform transition duration-700 ease-in-out">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-4rem)] xl:w-full md:w-20 shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-2 pr-2">
            <SidebarNav items={dashboardConfig.sidebarNav} className="p-4" />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
