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

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isCollapsed: boolean
    toggleCollapse: () => void
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Clientes", href: "/dashboard/customers" },
        { icon: QrCode, label: "Escáner", href: "/dashboard/scanner" },
        { icon: Gift, label: "Premios", href: "/dashboard/rewards" },
        { icon: CreditCard, label: "Planes", href: "/dashboard/billing" },
        { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed top-0 left-0 h-full bg-[#0a0a0a] border-r border-white/10 z-50 transition-all duration-300 ease-in-out flex flex-col",
                isOpen ? 'translate-x-0' : '-translate-x-full',
                "md:translate-x-0",
                isCollapsed ? "w-20" : "w-64"
            )}>

                {/* Header / Logo */}
                <div className={cn("flex items-center gap-3 px-4 py-6 mb-4", isCollapsed && "justify-center px-0")}>
                    <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-[#00FF94] to-[#00C2FF]" />
                    {!isCollapsed && (
                        <span className="text-xl font-bold font-sans tracking-tight animate-in fade-in duration-300">
                            Loyalty<span className="text-[#00FF94]">Pro</span>
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                                    isActive
                                        ? 'bg-[#00FF94]/10 text-[#00FF94] font-medium'
                                        : 'text-white/60 hover:text-white hover:bg-white/5',
                                    isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className={isActive ? 'text-[#00FF94]' : 'text-white/40 group-hover:text-white'} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={toggleCollapse}
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] border border-white/10 rounded-full items-center justify-center text-white/60 hover:text-white transition-colors z-50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/10 space-y-4">

                    {/* Upgrade Box */}
                    {!isCollapsed ? (
                        <div className="bg-gradient-to-br from-[#00FF94]/20 to-[#00C2FF]/10 rounded-xl p-4 border border-[#00FF94]/20 animate-in fade-in duration-300">
                            <h4 className="font-bold text-sm mb-1 text-white flex items-center gap-2">
                                <Zap size={14} className="fill-[#00FF94] text-[#00FF94]" /> Plan Free
                            </h4>
                            <p className="text-xs text-white/60 mb-3">50/200 clientes</p>
                            <Button size="sm" variant="default" className="w-full text-xs h-8 bg-[#00FF94] text-black hover:bg-[#00cc76] border-0">
                                Mejorar Plan
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF94]/20 to-[#00C2FF]/10 border border-[#00FF94]/20 flex items-center justify-center">
                                <Zap size={18} className="fill-[#00FF94] text-[#00FF94]" />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                        <Avatar className="h-8 w-8 border border-white/10">
                            <AvatarFallback className="bg-white/5 text-xs text-white/80">JP</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                                <p className="text-sm font-medium truncate text-white">Juan Pérez</p>
                                <p className="text-xs text-white/40 truncate">juan@example.com</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button className="text-white/40 hover:text-white transition-colors">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
