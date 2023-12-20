import { Icons } from "@/components/icons"

export type Image = {
    _id?: string;
    fileKey: string;
    fileName: string;
    fileUrl: string;
};

export type IUser = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: Image;
    role: string;
};

export type INewUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
};


//-------------NAV TYPES----------------------------------
export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
}

export type SidebarNavItem = {
    title: string
    for: "all" | "admin"
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
} & (
        | {
            href: string
            items?: never
        }
        | {
            href?: string
            items: NavItem[]
        }
    )

export type DashboardConfig = {
    mainNav: NavItem[]
    sidebarNav: SidebarNavItem[]
}