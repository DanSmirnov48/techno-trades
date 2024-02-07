import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import React from "react";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "@/components/dashboard/side-nav-with-tooltip";
import { dashboardConfig } from "@/config/dashboard";

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [sizes, setSizes] = React.useState<number[]>([25, 75])

  return (
    <div className="flex min-h-screen flex-col w-full">
      <div className="container xl:px-0 flex-1">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => setSizes(sizes)}
            className="h-full max-h-[1400px] items-stretch"
          >
            <ResizablePanel
              defaultSize={sizes[0]}
              collapsedSize={7}
              collapsible={true}
              minSize={15}
              maxSize={25}
              onCollapse={() => setIsCollapsed(true)}
              onExpand={() => setIsCollapsed(false)}
              className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
            >
              <Nav isCollapsed={isCollapsed} links={dashboardConfig.sidebarNav} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={sizes[1]}>
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