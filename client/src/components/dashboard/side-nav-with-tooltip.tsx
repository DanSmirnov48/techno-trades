import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from '../shared';
import { SidebarNavItem } from "@/types";
import { ChevronLeftIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
    isCollapsed: boolean;
    links: SidebarNavItem[];
}

export function Nav({ isCollapsed, links, className, ...props }: NavProps) {
    const location = useLocation();
    const { user, isAdmin } = useUserContext();
    return (
        <div
            data-collapsed={isCollapsed}
            className={cn(
                "group flex flex-col gap-4 py-8 data-[collapsed=true]:py-10",
                className
            )}
            {...props}
        >
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) => {
                    const Icon = link.icon ? Icons[link.icon] : ChevronLeftIcon;
                    const isActive = link.href && location.pathname.includes(link.href);

                    return isCollapsed ? (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                {link.href ? (
                                    <Link
                                        to={link.for === "all" ? link.href + user._id : link.href}
                                        aria-label={link.title}
                                        target={link.external ? "_blank" : ""}
                                        rel={link.external ? "noreferrer" : ""}
                                    >
                                        <span
                                            className={cn(
                                                "group flex items-center rounded-md px-3 py-2 dark:text-muted-foreground text-sm mr-2 font-medium hover:bg-accent hover:text-accent-foreground",
                                                isActive ? "bg-accent" : "transparent",
                                                link.disabled && "cursor-not-allowed opacity-60"
                                            )}
                                        >
                                            <Icon className={cn("h-6 w-6", isActive && "fill-purple-300")} aria-hidden="true" />
                                            <span className="sr-only">{link.title}</span>
                                        </span>
                                    </Link>
                                ) : (
                                    <span
                                        className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
                                    >
                                        {link.title}
                                    </span>
                                )}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-4">
                                {link.title}
                                {link.label && (
                                    <span className="ml-auto text-muted-foreground">
                                        {link.label}
                                    </span>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <React.Fragment key={index}>
                            {link.href ? (
                                <Link
                                    to={link.for === "all" ? link.href + user._id : link.href}
                                    aria-label={link.title}
                                    target={link.external ? "_blank" : ""}
                                    rel={link.external ? "noreferrer" : ""}
                                >
                                    <span
                                        className={cn(
                                            "group flex items-center rounded-md px-3 py-2 text-base dark:text-muted-foreground font-jost font-medium hover:bg-accent hover:text-accent-foreground",
                                            isActive ? "bg-accent font-semibold" : "transparent",
                                            link.disabled && "cursor-not-allowed opacity-60"
                                        )}
                                    >
                                        <Icon className={cn("mr-4 h-6 w-6", isActive && "fill-purple-300")} aria-hidden="true" />
                                        <span>{link.title}</span>
                                    </span>
                                </Link>
                            ) : (
                                <span className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline">
                                    {link.title}
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>
        </div>
    );
}
