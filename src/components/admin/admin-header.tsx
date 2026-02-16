"use client"

import { Bell, Search, Sun, Moon, LogOut, User, Settings, Check, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useUserProfile } from "@/hooks/use-user-profile"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
// Import real components
import { AdminGlobalSearch } from "@/components/admin/admin-global-search"
import { LanguageSwitcher } from "@/components/dashboard/language-switcher"
import { NotificationsPopover } from "@/components/dashboard/notifications-popover"

interface AdminHeaderProps {
    isCollapsed: boolean
    isOpen: boolean
    toggleCollapse: () => void
    onOpenMobileSidebar: () => void
}

export function AdminHeader({
    isCollapsed,
    isOpen,
    toggleCollapse,
    onOpenMobileSidebar
}: AdminHeaderProps) {
    const { setTheme, theme } = useTheme()
    const { profile } = useUserProfile()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    // Get initials for avatar
    const initials = profile?.name
        ? `${profile.name[0]}${profile.lastName ? profile.lastName[0] : ""}`
        : "SA"

    const fullName = (profile?.name && profile?.lastName)
        ? `${profile.name} ${profile.lastName}`
        : (profile?.name || "Super Admin")

    return (
        <header className={cn(
            "sticky top-0 z-30 grid grid-cols-[auto_1fr_auto] h-20 w-full items-center bg-background px-6 border-b border-border/50 gap-4 transition-all duration-300",
            "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
        )}>
            {/* LEFT: Toggle, Desktop Toggle & Language */}
            <div className="flex items-center gap-4">
                {/* Mobile Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-muted-foreground hover:text-foreground"
                    onClick={onOpenMobileSidebar}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Desktop Toggle (Restored) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse}
                    className="hidden md:flex h-10 w-10 text-muted-foreground bg-secondary/50 hover:bg-secondary hover:text-foreground rounded-xl border border-border/50 transition-all group"
                >
                    <div className="flex flex-col gap-[3px] items-start w-4 group-hover:gap-[4px] transition-all duration-300">
                        <div className={cn("h-[2px] w-full bg-current rounded-full transition-all duration-300", isCollapsed && "w-2 self-start")} />
                        <div className="h-[2px] w-3/4 bg-current rounded-full" />
                        <div className={cn("h-[2px] w-full bg-current rounded-full transition-all duration-300", isCollapsed && "w-2 self-end")} />
                    </div>
                </Button>

                <div className="h-6 w-px bg-border/40 mx-2 hidden lg:block" />

                {/* Language Switcher (Moved to Left) */}
                <div className="hidden lg:block">
                    <LanguageSwitcher />
                </div>
            </div>

            {/* CENTER: Global Search */}
            <div className="flex justify-center w-full max-w-2xl mx-auto px-2 md:px-0">
                <AdminGlobalSearch />
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center justify-end gap-3 md:gap-4">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Notifications */}
                <NotificationsPopover />

                <div className="h-8 w-px bg-border/40 mx-1 hidden sm:block" />

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-auto flex items-center gap-3 px-3 rounded-xl transition-all hover:bg-secondary/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-none outline-none group">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-sm font-bold text-foreground leading-none">
                                    {fullName}
                                </span>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">
                                    Super Admin
                                </span>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-indigo-500/20 ring-2 ring-background group-hover:border-indigo-500/50 transition-all">
                                <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || ""} className="object-cover" />
                                <AvatarFallback className="bg-indigo-500/10 text-indigo-500 font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-secondary/95 backdrop-blur-xl border-border supports-[backdrop-filter]:bg-secondary/60" align="end" forceMount>
                        <div className="flex flex-col items-center pt-6 pb-4 px-4 bg-gradient-to-b from-white/[0.03] to-transparent rounded-t-xl mb-2">
                            <Avatar className="h-16 w-16 border-2 border-indigo-500/30 shadow-lg mb-3">
                                <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || ""} className="object-cover" />
                                <AvatarFallback className="bg-indigo-500/20 text-indigo-500 text-xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="text-base font-bold text-foreground">
                                {fullName}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {profile?.email}
                            </p>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="cursor-pointer h-10">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 cursor-pointer h-10 focus:bg-red-500/10">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
