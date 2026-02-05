"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    CreditCard,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    QrCode,
    Gift,
    ChevronLeft,
    ChevronRight,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useBusiness } from "@/hooks/use-business"

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isCollapsed: boolean
    toggleCollapse: () => void
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname()
    const { business } = useBusiness()

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Clientes", href: "/dashboard/customers" },
        { icon: QrCode, label: "Escanear", href: "/dashboard/scan" },
        { icon: Gift, label: "Premios", href: "/dashboard/rewards" },
        { icon: CreditCard, label: "Planes", href: "/dashboard/plans" },
        { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full bg-sidebar border-r border-white/10 z-50 transition-all duration-300 flex flex-col",
                    isCollapsed ? "w-20" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            LoyaltyPro
                        </h1>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        className="ml-auto hover:bg-white/10"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,255,148,0.2)]"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer - User Profile */}
                <div className="p-4 border-t border-white/10">
                    {!isCollapsed && (
                        <div className="flex justify-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                        <Avatar className="h-8 w-8 border border-transparent ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                            <AvatarFallback className="bg-white/5 text-xs text-white/80">
                                {business?.name ? business.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-white">
                                    {business?.name || 'Usuario'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">Plan Free</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button className="text-muted-foreground hover:text-red-400 transition-colors">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
