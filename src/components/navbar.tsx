"use client"

import React from 'react'
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { navItems } from "@/lib/naviagtions"

export const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname();

    const isActive = (path: string) => pathname.includes(path);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex w-full items-center justify-center py-3">
            <div className="flex items-center rounded-full border">
                {navItems.map((item) => (
                    <Button 
                        key={item.title} 
                        variant={isActive(item.href) ? "default" : "ghost"}
                        onClick={() => router.push(item.href)}
                        className="p-6 size-12 rounded-full"
                        >
                        <item.icon className="size-6" />
                    </Button>
                ))}
            </div>
        </div>
    )
}
