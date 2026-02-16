"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, User, Settings, LogOut, Moon, Sun, Monitor, HelpCircle, Shield, CreditCard, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "./global-search";
import { NotificationsPopover } from "./notifications-popover";
import { LanguageSwitcher } from "./language-switcher";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { TenantSelector } from "./tenant-selector";

interface DashboardNavbarProps {
    isCollapsed: boolean;
    isOpen: boolean;
    toggleCollapse: () => void;
    onOpenMobileSidebar: () => void;
}

import { useLanguage } from "@/contexts/language-context"; // Ensure this matches

// Internal component for language toggle to use the hook
function LanguageToggle() {
    const { language, setLanguage } = useLanguage()
    return (
        <>
            <button
                onClick={(e) => { e.preventDefault(); setLanguage('es') }}
                className={cn(
                    "px-2 py-1 text-xs font-bold rounded-md transition-all",
                    language === 'es' ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                ES
            </button>
            <button
                onClick={(e) => { e.preventDefault(); setLanguage('en') }}
                className={cn(
                    "px-2 py-1 text-xs font-bold rounded-md transition-all",
                    language === 'en' ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                EN
            </button>
        </>
    )
}

export function DashboardNavbar({
    isCollapsed,
    isOpen,
    toggleCollapse,
    onOpenMobileSidebar
}: DashboardNavbarProps) {
    const pathname = usePathname();
    const { profile } = useUserProfile();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };



    return (
        <header className="sticky top-0 z-30 grid grid-cols-[auto_1fr_auto] h-20 w-full items-center bg-background px-6 border-b border-border/50 gap-4">
            {/* LEFT: Toggle & Mobile Menu */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-zinc-400 hover:text-white"
                    onClick={onOpenMobileSidebar}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Modern Desktop Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse}
                    className="hidden md:flex h-10 w-10 text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white rounded-xl border border-white/5 transition-all group"
                >
                    <div className="flex flex-col gap-[3px] items-start w-4 group-hover:gap-[4px] transition-all duration-300">
                        <div className={cn("h-[2px] w-full bg-current rounded-full transition-all duration-300", isCollapsed && "w-2 self-start")} />
                        <div className="h-[2px] w-3/4 bg-current rounded-full" />
                        <div className={cn("h-[2px] w-full bg-current rounded-full transition-all duration-300", isCollapsed && "w-2 self-end")} />
                    </div>
                </Button>

                <div className="h-6 w-px bg-white/10 mx-2 hidden lg:block" />

                <div className="hidden lg:block">
                    <LanguageSwitcher />
                </div>
            </div>

            {/* CENTER: Global Search */}
            <div className="flex justify-center w-full max-w-2xl mx-auto px-2 md:px-0">
                <div className="w-full">
                    <GlobalSearch />
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center justify-end gap-3 md:gap-4">
                {/* Super Admin Action */}
                {profile?.role === 'SUPER_ADMIN' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-10 w-10 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-all border border-emerald-500/20"
                        asChild
                    >
                        <a href="/admin" target="_blank" rel="noopener noreferrer">
                            <Zap className="h-5 w-5 fill-current" />
                        </a>
                    </Button>
                )}

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <NotificationsPopover />
                </div>

                <div className="h-8 w-px bg-border/40 mx-1 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-auto flex items-center gap-3 px-3 rounded-xl transition-all hover:!bg-[#00bb7f0d] focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-white/[0.01] data-[state=open]:bg-white/[0.01] border-none outline-none group">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-sm font-bold text-white leading-none">
                                    {(profile?.name && profile?.lastName) ? `${profile.name} ${profile.lastName}` : (profile?.name || "Usuario")}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">
                                    {profile?.role === "SUPER_ADMIN" ? "Admin" : "FREE"}
                                </span>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-emerald-500/20 ring-2 ring-black group-hover:border-emerald-500/50 transition-all">
                                <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || ""} className="object-cover" />
                                <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-bold">
                                    {profile?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 bg-[#0c0c0c] border-white/10 p-2 rounded-2xl shadow-2xl backdrop-blur-xl" align="end" sideOffset={8}>
                        <div className="flex flex-col items-center pt-6 pb-4 px-4 bg-gradient-to-b from-white/[0.03] to-transparent rounded-t-xl mb-2">
                            <Avatar className="h-20 w-20 border-2 border-emerald-500/30 shadow-lg mb-3 ring-4 ring-black">
                                <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || ""} className="object-cover" />
                                <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-2xl font-bold">
                                    {profile?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-bold text-white">
                                {(profile?.name && profile?.lastName) ? `${profile.name} ${profile.lastName}` : (profile?.name || "Usuario")}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {profile?.email || "usuario@ejemplo.com"}
                            </p>
                        </div>

                        {/* Mobile/Tablet Language Selector */}
                        <div className="lg:hidden px-4 pb-3 mb-2 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-400">Idioma</span>
                            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                                <LanguageToggle />
                            </div>
                        </div>

                        <div className="px-2 pb-2 space-y-2">
                            <Button
                                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-between px-4 group shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                asChild
                            >
                                <Link href="/dashboard/billing">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                            <Zap className="w-3.5 h-3.5 fill-white text-white" />
                                        </div>
                                        <span>Mejorar plan</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            </Button>

                            <div className="w-full py-1">
                                <TenantSelector />
                            </div>

                            <DropdownMenuGroup className="pt-2">
                                <DropdownMenuItem asChild className="h-12 rounded-xl cursor-pointer focus:bg-emerald-500/5 focus:text-white transition-all px-4">
                                    <Link href="/dashboard/billing" className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                            <CreditCard className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <span className="font-medium">Plan y facturación</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="h-12 rounded-xl cursor-pointer focus:bg-emerald-500/5 focus:text-white transition-all px-4">
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <Settings className="h-4 w-4 text-white/70" />
                                        </div>
                                        <span className="font-medium">Configuración</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="bg-white/5 my-2" />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="h-12 rounded-xl cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-all px-4 flex items-center gap-3"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="font-bold">Cerrar sesión</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
