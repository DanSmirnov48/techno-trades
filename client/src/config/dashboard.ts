import { type SidebarNavItem } from "@/types"

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      for: "all",
      href: "/dashboard/account/",
      icon: "user",
      items: [],
    },
  ],
}