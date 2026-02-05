"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

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

            {/* Main Content */}
            <div className={cn(
                "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu className="text-white" />
                    </button>
                    <span className="font-bold">Dashboard</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
