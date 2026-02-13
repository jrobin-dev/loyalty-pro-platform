"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu, User, Settings, LogOut, Moon, Sun, Monitor, HelpCircle, Shield, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTheme } from "next-themes";
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

export function DashboardNavbar() {
    const pathname = usePathname();
    const { profile } = useUserProfile();
    const { theme, setTheme } = useTheme();

    // Obtener el nombre de la sección actual
    const getPageTitle = () => {
        const parts = pathname.split("/");
        const lastPart = parts[parts.length - 1];
        if (!lastPart || lastPart === "dashboard") return "Inicio";
        if (lastPart === "admin") return "Consola Admin";
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background px-4 md:px-6 border-b border-border/50">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
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
                        <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-2 px-2 hover:bg-muted/50 rounded-full transition-all">
                            <Avatar className="h-8 w-8 border border-border/50 ring-2 ring-emerald-500/10">
                                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-bold">
                                    {profile?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start mr-2">
                                <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                                    {profile?.full_name || "Usuario"}
                                </span>
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/5 font-medium">
                                    {profile?.role === "admin" ? "Admin" : "Comercio"}
                                </Badge>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">{profile?.full_name || "Usuario"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {profile?.email || "usuario@ejemplo.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Mi Perfil</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Facturación</span>
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configuración</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
