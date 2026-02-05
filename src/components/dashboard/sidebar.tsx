use clientimport Link from "next/link"
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

export default function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isOpen, setIsOpen] = useState(false) // Assuming isOpen state is now managed internally or removed
    const { business } = useBusiness()

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

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
                "fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col",
                "bg-[#0a0a0a]/50 backdrop-blur-xl border-r border-transparent", // Cosmic Glass
                isOpen ? 'translate-x-0' : '-translate-x-full',
                "md:translate-x-0",
                isCollapsed ? "w-20" : "w-64"
            )}>

                {/* Header / Logo */}
                <div className={cn("flex items-center gap-3 px-6 py-8 mb-2", isCollapsed && "justify-center px-0")}>
                    <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20" />
                    {!isCollapsed && (
                        <span className="text-xl font-bold font-display tracking-tight text-white">
                            Loyalty<span className="text-primary">Pro</span>
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative",
                                    isActive
                                        ? "bg-lime-500/20 text-lime-400 border-l-4 border-lime-500"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5",
                                    isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className={isActive ? 'text-lime-400' : 'text-muted-foreground group-hover:text-white transition-colors'} />
                                {!isCollapsed && <span className={isActive ? "text-lime-400" : ""}>{item.label}</span>}

                                {/* Active Indicator - removed as we're using left border */}
                            </Link>
                        )
                    })}
                </nav>

                {/* Collapse Toggle Button */}
                <button
                    onClick={toggleCollapse}
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0a] border border-transparent rounded-full items-center justify-center text-muted-foreground hover:text-white transition-colors z-50 hover:bg-primary/20 hover:border-primary/50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-transparent space-y-4">

                    {/* Upgrade Box - Cosmic Style */}
                    {!isCollapsed ? (
                        <div className="rounded-xl p-4 border border-transparent bg-gradient-to-br from-primary/10 to-transparent">
                            <h4 className="font-bold text-sm mb-1 text-white flex items-center gap-2">
                                <Zap size={14} className="fill-yellow-400 text-yellow-400" /> Plan Free
                            </h4>
                            <p className="text-xs text-muted-foreground mb-3">50/200 clientes</p>
                            <Button size="sm" variant="default" className="w-full text-xs h-8 btn-cosmic">
                                Upgrade Plan
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className="mt-auto border-t border-white/10 pt-4">
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer",
                            isCollapsed && "justify-center px-0"
                        )}>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                                {business?.name ? business.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-white">
                                        {business?.name || 'Usuario'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        Plan Free
                                    </p>
                                </div>
                            )}
                            {!isCollapsed && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            {isCollapsed && (
                                <button className="text-muted-foreground hover:text-red-400 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
