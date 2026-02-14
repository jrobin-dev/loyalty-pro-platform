"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, User, Settings, LogOut, Moon, Sun, Monitor, HelpCircle, Shield, CreditCard, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
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

interface DashboardNavbarProps {
    isCollapsed: boolean;
    isOpen: boolean;
    toggleCollapse: () => void;
    onOpenMobileSidebar: () => void;
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

    // Obtener el nombre de la sección actual
    const getPageTitle = () => {
        const parts = pathname.split("/");
        const lastPart = parts[parts.length - 1];
        if (!lastPart || lastPart === "dashboard") return "Inicio";
        if (lastPart === "admin") return "Consola Admin";
        if (lastPart === "customers") return "Clientes";
        if (lastPart === "rewards") return "Premios";
        if (lastPart === "academy") return "Academia";
        if (lastPart === "settings") return "Configuración";
        if (lastPart === "scan") return "Escanear";
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background px-4 md:px-6 border-b border-border/50">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onOpenMobileSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Desktop Collapse Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    onClick={toggleCollapse}
                >
                    <Menu className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
                </Button>

                <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                        {getPageTitle()}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex relative max-w-sm items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="w-[200px] lg:w-[300px] bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    <ThemeToggle />

                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </Button>
                </div>

                <div className="h-8 w-px bg-border/40 mx-1 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-auto flex items-center gap-3 px-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group">
                            <div className="hidden md:flex flex-col items-end">
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

                            <DropdownMenuGroup className="pt-2">
                                <DropdownMenuItem asChild className="h-12 rounded-xl cursor-pointer focus:bg-white/5 focus:text-white transition-all px-4">
                                    <Link href="/dashboard/billing" className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                            <CreditCard className="h-4 w-4 text-orange-500" />
                                        </div>
                                        <span className="font-medium">Plan y facturación</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="h-12 rounded-xl cursor-pointer focus:bg-white/5 focus:text-white transition-all px-4">
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
