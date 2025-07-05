"use client"
import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from '@/components/navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <div className="flex flex-col min-h-screen w-screen overflow-x-hidden">
                {children}
                <Navbar />
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout