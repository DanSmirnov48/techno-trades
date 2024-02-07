import { type SidebarNavItem } from "@/types"

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      label: "",
      for: "all",
      href: "/dashboard/account/",
      icon: "user",
      variant: "ghost",
      items: [],
    },
    {
      title: "My Oders",
      label: "",
      for: "all",
      href: "/dashboard/my-orders/",
      icon: "orders",
      variant: "default",
      items: [],
    },
    {
      title: "Notifications",
      label: "",
      for: "all",
      href: "/dashboard/notifications/",
      icon: "bell",
      variant: "ghost",
      items: [],
    },
    {
      title: "Appearance",
      label: "",
      for: "all",
      href: "/dashboard/appearance/",
      icon: "theme",
      variant: "default",
      items: [],
    },
    {
      title: "Favourites",
      label: "",
      for: "all",
      href: "/dashboard/favourites/",
      icon: "heart",
      variant: "ghost",
      items: [],
    },
    {
      title: "Data Table",
      label: "",
      for: "admin",
      href: "/dashboard/data-tables",
      icon: "table",
      variant: "ghost",
      items: [],
    },
    {
      title: "Create Product",
      label: "",
      for: "admin",
      href: "/dashboard/product",
      icon: "add",
      variant: "default",
      items: [],
    },
  ],
}