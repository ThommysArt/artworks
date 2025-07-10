"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarUser } from "./sidebar-user";
import { navItems } from "@/lib/naviagtions";

export const AppSidebar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname.includes(path);
    return (
        <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
            <div className="flex items-center justify-center gap-2 p-4">
                <span className="text-2xl font-semibold">ArtSphere</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Organisation</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.title}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarUser />
        </SidebarFooter>
        <SidebarRail />
        </Sidebar>
    )
}
