"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUserProfile } from "@/hooks/use-user-profile"
import { SuspendedScreen } from "@/components/dashboard/suspended-alert"
import { LanguageProvider } from "@/contexts/language-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { profile, loading } = useUserProfile()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !profile) {
            router.replace("/login")
        }
    }, [loading, profile, router])

    useEffect(() => {
        const saved = localStorage.getItem("sidebarCollapsed")
        if (saved) {
            setIsCollapsed(JSON.parse(saved))
        }
    }, [])

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-emerald-500/20" />
                </div>
            </div>
        )
    }

    if (!profile) {
        return null // Evitar flash de contenido mientras se redirecciona
    }

    if (profile?.tenants && profile.tenants.length > 0) {
        if (profile.tenants[0].status === 'SUSPENDED') {
            return <SuspendedScreen />
        }
    }

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-background text-foreground relative font-sans">
                <div className="bg-noise" />

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />

                <div className={cn(
                    "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:ml-20" : "md:ml-64"
                )}>
                    {/* DashboardNavbar sin props según la versión manual del usuario */}
                    <DashboardNavbar
                        isCollapsed={isCollapsed}
                        isOpen={sidebarOpen}
                        toggleCollapse={toggleCollapse}
                        onOpenMobileSidebar={() => setSidebarOpen(true)}
                    />

                    <main className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto">
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </LanguageProvider>
    )
}
