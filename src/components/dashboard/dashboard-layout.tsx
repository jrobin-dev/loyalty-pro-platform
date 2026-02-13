"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

import { useUserProfile } from "@/hooks/use-user-profile"
import { SuspendedScreen } from "@/components/dashboard/suspended-alert"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { profile, loading } = useUserProfile()

    // Load collapsed state from local storage on mount (optional, nice to have)
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

    // Suspension Check
    if (!loading && profile?.tenants && profile.tenants.length > 0) {
        const currentTenant = profile.tenants[0]
        if (currentTenant.status === 'SUSPENDED') {
            return <SuspendedScreen />
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white relative font-sans">
            {/* Ambient Noise Texture */}
            <div className="bg-noise" />

            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
            />

            {/* Main Content Area */}
            <div className={cn(
                "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                {/* Header / Navbar */}
                <DashboardNavbar
                    isCollapsed={isCollapsed}
                    isOpen={sidebarOpen}
                    toggleCollapse={toggleCollapse}
                    onOpenMobileSidebar={() => setSidebarOpen(true)}
                >
                    {/* Search Bar within Navbar */}
                    <div className="relative group w-full max-w-[500px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                            placeholder="Buscar clientes, premios, transacciones..."
                            className="w-full bg-secondary/50 border-border/60 focus:bg-background focus:ring-emerald-500/20 pl-10 rounded-xl transition-all shadow-sm"
                        />
                    </div>
                </DashboardNavbar>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
