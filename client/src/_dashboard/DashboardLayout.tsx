import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import { dashboardConfig } from "@/config/dashboard";
import useDashboardStore from "@/hooks/useDashboard";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "@/components/dashboard/side-nav-with-tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export const DashboardLayout = () => {
  const { user } = useUserContext();
  const { isCollapsed, defaultSizes, setCollapsed, setDefaultSizes } = useDashboardStore();

  const userLinks = dashboardConfig.sidebarNav.filter(link => link.for === 'all');
  const adminLinks = dashboardConfig.sidebarNav.filter(link => link.for === 'admin');

  return (
    <div className="flex min-h-screen flex-col w-full">
      <div className="container xl:px-0 flex-1">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => setDefaultSizes(sizes)}
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultSizes[0]}
              collapsedSize={7}
              collapsible={true}
              minSize={15}
              maxSize={25}
              onCollapse={() => setCollapsed(true)}
              onExpand={() => setCollapsed(false)}
              className={cn(isCollapsed && "min-w-[50px] transition-all duration-500 ease-in-out")}
            >
              <Nav isCollapsed={isCollapsed} links={userLinks} className="pb-6" />
              {user.role === "admin" &&
                <>
                  <Separator />
                  <Nav isCollapsed={isCollapsed} links={adminLinks} className="py-6" />
                </>
              }
            </ResizablePanel>
            <ResizableHandle withHandle className="w-[3px] bg-dark-4/20 dark:bg-light-3/50" />
            <ResizablePanel defaultSize={defaultSizes[1]}>
              <main className="flex w-full flex-col overflow-hidden">
                <Outlet />
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </div>
  );
};