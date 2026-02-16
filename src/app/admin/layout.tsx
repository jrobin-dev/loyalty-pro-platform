"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/use-user-profile"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { cn } from "@/lib/utils"
import { LanguageProvider } from "@/contexts/language-context"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { profile, loading } = useUserProfile()
    const router = useRouter()

    useEffect(() => {
        if (!loading && profile) {
            if (profile.role !== "SUPER_ADMIN") {
                router.replace("/dashboard")
            }
        } else if (!loading && !profile) {
            router.replace("/login")
        }
    }, [profile, loading, router])

    useEffect(() => {
        const saved = localStorage.getItem("adminSidebarCollapsed")
        if (saved) {
            setIsCollapsed(JSON.parse(saved))
        }
    }, [])

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem("adminSidebarCollapsed", JSON.stringify(newState))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-indigo-500/20" />
                </div>
            </div>
        )
    }

    if (!profile || profile.role !== "SUPER_ADMIN") {
        return null
    }

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-background text-foreground relative font-sans">
                <div className="bg-noise" />

                <AdminSidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />

                <div className={cn(
                    "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:ml-20" : "md:ml-64"
                )}>
                    <AdminHeader
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
