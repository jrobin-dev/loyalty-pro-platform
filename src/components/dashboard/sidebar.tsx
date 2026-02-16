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
    Zap,
    Loader2,
    GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { useUserProfile } from "@/hooks/use-user-profile"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { UpgradeProBanner } from "./upgrade-banner"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "./language-switcher"

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isCollapsed: boolean
    toggleCollapse: () => void
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname()
    const { t } = useLanguage()
    const { settings } = useTenantSettings()
    const { profile } = useUserProfile()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [userName, setUserName] = useState("Usuario")
    const [isFullyExpanded, setIsFullyExpanded] = useState(false)

    // Handle delayed expansion state for smooth content appearance
    useEffect(() => {
        if (!isCollapsed) {
            // Opening: Wait for width transition (300ms) then show content
            const timer = setTimeout(() => {
                setIsFullyExpanded(true)
            }, 300)
            return () => clearTimeout(timer)
        } else {
            // Closing: Hide content immediately
            setIsFullyExpanded(false)
        }
    }, [isCollapsed])

    useEffect(() => {
        if (profile) {
            console.log("Dashboard Sidebar Profile:", profile) // Debugging
            const fullName = [profile.name, profile.lastName].filter(Boolean).join(" ")
            setUserName(fullName || profile.email?.split("@")[0] || "Usuario")
        }
    }, [profile])


    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            const supabase = createClient()
            await supabase.auth.signOut()
            localStorage.removeItem("user_profile_cache")
            window.location.href = "/login"
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    const menuItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), href: "/dashboard" },
        { icon: Users, label: t('sidebar.customers'), href: "/dashboard/customers" },
        { icon: QrCode, label: t('sidebar.qrScanner'), href: "/dashboard/scan" },
        { icon: Gift, label: t('sidebar.rewards'), href: "/dashboard/rewards" },
        { icon: GraduationCap, label: t('sidebar.academy'), href: "/dashboard/academy" },
        { icon: Settings, label: t('sidebar.settings'), href: "/dashboard/settings" },
    ]




    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300 flex flex-col",
                    isCollapsed ? "w-20" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header - Logo & Close Button (Mobile) */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-border transition-all duration-300">
                    <Link href="/" className={cn("group cursor-pointer transition-all duration-300", isCollapsed ? "w-12 flex justify-center" : "px-2")}>
                        {isCollapsed ? (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <Zap className="h-5 w-5 text-white fill-white" />
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {isFullyExpanded && (
                                    <motion.h1
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform"
                                    >
                                        LoyaltyPro
                                    </motion.h1>
                                )}
                            </AnimatePresence>
                        )}
                    </Link>

                    {/* Close Button Only */}
                    <div className="flex items-center gap-2">

                        {!isCollapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="md:hidden h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 pt-6 space-y-3 overflow-y-auto custom-scrollbar relative">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <div key={item.href} className="relative flex items-center group">
                                {/* Indicador Neón Lateral - Separado del recuadro */}
                                {isActive && (
                                    <motion.div
                                        layoutId={`activeIndicator-${isCollapsed ? 'collapsed' : 'expanded'}`}
                                        className="absolute z-10"
                                        style={{
                                            left: "-16px",
                                            width: "6px",
                                            height: "32px",
                                            backgroundColor: "lab(78 -63.38 35.21)",
                                            borderRadius: "0px 25px 25px 0px",
                                            boxShadow: "-4px 0 10px 2px #3bc295, 0 0 15px rgba(16, 185, 129, 0.8)",
                                            pointerEvents: "none"
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                    />
                                )}

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center rounded-xl transition-all duration-300 relative h-12 overflow-hidden",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/10 dark:text-[#19E28C]"
                                            : "text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-500",
                                        isCollapsed ? "w-12 px-0 justify-center" : "w-full px-1.5 gap-3"
                                    )}
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-9 h-9 transition-colors duration-300 flex-shrink-0",
                                        isActive ? "bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg" : "bg-transparent group-hover:bg-accent rounded-full"
                                    )}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5 transition-transform duration-300",
                                            isActive ? "text-emerald-600 dark:text-emerald-400 scale-110" : "group-hover:text-foreground"
                                        )} />
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.div
                                                className="flex flex-1 items-center gap-3 overflow-hidden whitespace-nowrap"
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <span
                                                    className={cn(
                                                        "flex-1 font-medium text-[16px] transition-colors duration-300",
                                                        isActive ? "text-emerald-700 dark:text-[#7ed4b9]" : "group-hover:text-foreground"
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                                {isActive && (
                                                    <ChevronRight
                                                        className="animate-in fade-in slide-in-from-left-2 duration-300"
                                                        style={{
                                                            color: "color-mix(in oklab, lab(85 -28.78 13.88) 50%, transparent)",
                                                            width: "20px",
                                                            height: "20px"
                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </div>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className={cn(
                    "p-4 mt-auto space-y-4 transition-all duration-300",
                    // Only show border when fully expanded to avoid "jumping" line
                    isFullyExpanded ? "border-t border-border" : "border-t-0"
                )}>
                    {/* Premium Upgrade Banner */}
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <UpgradeProBanner />
                        )}
                    </AnimatePresence>


                    {/* Simple Logout Action */}
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={cn(
                                "group flex items-center rounded-xl transition-all duration-300 disabled:opacity-50 outline-none h-12 overflow-hidden",
                                isCollapsed ? "w-12 px-0 justify-center mx-auto bg-red-500/5" : "w-full px-1.5 gap-3 bg-transparent hover:bg-red-500/5"
                            )}
                            title="Cerrar Sesión"
                        >
                            <div className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 flex-shrink-0",
                                isCollapsed ? "bg-transparent" : "bg-transparent"
                            )}>
                                {isLoggingOut ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <LogOut size={18} className="text-red-500/60 transition-transform group-hover:scale-110 group-hover:text-red-500" />
                                )}
                            </div>
                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        className="text-[16px] font-medium text-red-500/60 group-hover:text-red-500 overflow-hidden whitespace-nowrap"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Cerrar Sesión
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
