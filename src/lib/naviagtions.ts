import { BadgePercentIcon, HomeIcon, UserRoundIcon, LayoutDashboardIcon, EyeIcon } from "lucide-react"

export const navItems = [
    { title: "Artworks", icon: HomeIcon, href: "/artworks" },
    { title: "Exhibitions", icon: EyeIcon, href: "/exhibitions" },
    { title: "Auctions", icon: BadgePercentIcon, href: "/auctions" },
    { title: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
    { title: "Profile", icon: UserRoundIcon, href: "/profile" }
]