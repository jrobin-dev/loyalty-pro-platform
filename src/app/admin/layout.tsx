"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Store,
    Users,
    Megaphone,
    Bell,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin" },
        { icon: Store, label: "Tenants / Negocios", href: "/admin/tenants" },
        { icon: Users, label: "Usuarios Globales", href: "/admin/users" },
        { icon: Megaphone, label: "Marketing Banners", href: "/admin/banners" },
        { icon: BarChart3, label: "Revenue", href: "/admin/revenue" },
        { icon: Settings, label: "Configuración", href: "/admin/settings" },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            {/* Sidebar Container */}
            <div className={`
          fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo area */}
                    <div className="flex items-center gap-3 px-2 py-6 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF00E5] to-[#7000FF]" />
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-sans tracking-tight text-foreground leading-none">
                                Super<span className="text-[#FF00E5]">Admin</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-[family-name:var(--font-sora)]">SaaS Control</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                flex items-center gap-3 px-3 py-3 rounded-xl transition-all group font-medium text-sm
                                ${isActive
                                            ? 'bg-[#FF00E5]/10 text-[#FF00E5]'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }
                            `}
                                >
                                    <Icon size={18} className={isActive ? 'text-[#FF00E5]' : 'text-muted-foreground group-hover:text-foreground'} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-border space-y-4">
                        <div className="px-2">
                            <ThemeToggle />
                        </div>
                        {/* User Profile */}
                        <div className="flex items-center gap-3 px-2">
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarFallback className="bg-[#FF00E5]/10 text-[#FF00E5] text-xs font-bold">SA</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-foreground">System Admin</p>
                                <p className="text-xs text-muted-foreground truncate">admin@saas.com</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <LogOut size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-[#FF00E5]/30 selection:text-[#FF00E5] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden">
                            <Menu className="text-foreground" />
                        </button>
                        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 max-w-sm bg-card border border-border p-1 pl-3 rounded-xl focus-within:ring-1 focus-within:ring-primary/50 focus-within:bg-card/80 transition-all w-64 lg:w-96 shadow-inner">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF00E5] rounded-full border-2 border-background" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-[300px] overflow-y-auto">
                                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-medium text-sm">Nuevo Tenant: Burger King</span>
                                            <span className="text-[10px] text-muted-foreground">Hace 2m</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Se registró en el plan Free.</p>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer bg-muted/50">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-medium text-sm text-[#FF00E5]">Pago Recibido: $50</span>
                                            <span className="text-[10px] text-muted-foreground">Hace 1h</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Spa & Wellness renovó Plan Pro.</p>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
