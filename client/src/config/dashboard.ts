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
      title: "My Oders",
      for: "all",
      href: "/dashboard/my-orders/",
      icon: "orders",
      items: [],
    },
    {
      title: "Notifications",
      for: "all",
      href: "/dashboard/notifications/",
      icon: "bell",
      items: [],
    },
    {
      title: "Appearance",
      for: "all",
      href: "/dashboard/appearance/",
      icon: "theme",
      items: [],
    },
    {
      title: "Favourites",
      for: "all",
      href: "/dashboard/favourites/",
      icon: "heart",
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