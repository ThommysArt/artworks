import { CogIcon, PlusIcon, ScaleIcon, CalendarDaysIcon, PaletteIcon } from "lucide-react"

export const navItems = [
    { title: "New", icon: PlusIcon, href: "/artworks/new" },
    { title: "Artworks", icon: PaletteIcon, href: "/artworks" },
    { title: "Exhibitions", icon: CalendarDaysIcon, href: "/exhibitions" },
    { title: "Auctions", icon: ScaleIcon, href: "/auctions" },
    { title: "Profile", icon: CogIcon, href: "/profile" }
]