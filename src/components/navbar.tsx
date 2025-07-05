"use client"

import { BadgePercentIcon, HomeIcon, UserRoundIcon, LayoutDashboardIcon } from "lucide-react"
import { EyeIcon } from "lucide-react"
import React from 'react'
import { FloatingDock } from "./ui/floating-dock"
import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"

export const Navbar = () => {
    const navItems = [
        { title: "Home", icon: (<HomeIcon />), href: "/" },
        { title: "Exhibitions", icon: (<EyeIcon />), href: "/exhibitions" },
        { title: "Auctions", icon: (<BadgePercentIcon />), href: "/auctions" },
        { title: "Dashboard", icon: (<LayoutDashboardIcon />), href: "/dashboard" },
        { title: "Profile", icon: <UserRoundIcon />, href: "/profile" }
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center gap-4">
            <FloatingDock items={navItems} />
        </div>
    )
}
