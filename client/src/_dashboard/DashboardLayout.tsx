import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "@/components/dashboard/side-nav-with-tooltip";
import { dashboardConfig } from "@/config/dashboard";
import useDashboardStore from "@/hooks/useDashboard";

export const DashboardLayout = () => {
  const { isCollapsed, defaultSizes, setCollapsed, setDefaultSizes } = useDashboardStore();

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
              <Nav isCollapsed={isCollapsed} links={dashboardConfig.sidebarNav} />
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