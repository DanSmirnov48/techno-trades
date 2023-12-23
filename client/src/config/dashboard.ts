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
    {
      title: "Data Table",
      for: "admin",
      href: "/dashboard/data-tables",
      icon: "table",
      items: [],
    },
    {
      title: "Create Product",
      for: "admin",
      href: "/dashboard/product",
      icon: "add",
      items: [],
    },
  ],
}