"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Zap, LayoutDashboard } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { profile, loading } = useUserProfile()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { label: "Inicio", href: "/" },
        { label: "Características", href: "/#features" },
        { label: "Loyalty", href: "/loyalty" },
        { label: "Contacto", href: "/#contact" },
    ]

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-[0_4px_30px_rgba(16,185,129,0.08)] dark:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <Zap className="h-5 w-5 md:h-6 md:h-6 text-white fill-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            LoyaltyPro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${isScrolled || isMobileMenuOpen
                                    ? "text-gray-600 dark:text-gray-300 hover:text-emerald-500"
                                    : "text-gray-900 dark:text-white/90 hover:text-emerald-500 dark:hover:text-white"
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Profile / Login */}
                        {loading ? (
                            <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse border border-white/10" />
                        ) : profile ? (
                            <Link href="/dashboard" className="cursor-pointer group/avatar">
                                <Avatar className="h-9 w-9 border border-emerald-500/20 group-hover/avatar:border-emerald-500/50 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    {profile.avatarUrl && (
                                        <AvatarImage src={profile.avatarUrl} alt={profile.name || "Usuario"} />
                                    )}
                                    <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                        {(profile.name?.[0] || profile.email?.[0] || "U").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        ) : (
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="text-gray-300 hover:text-emerald-400 hover:bg-white/10"
                            >
                                <Link href="/login">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span className="sr-only">Login</span>
                                </Link>
                            </Button>
                        )}

                        <ThemeToggle />

                        <Button
                            asChild
                            className="hidden md:inline-flex bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                        >
                            {profile ? (
                                <Link href="/dashboard">
                                    <LayoutDashboard size={16} className="mr-2" /> Panel Control
                                </Link>
                            ) : (
                                <Link href="/onboarding">Regístrate Gratis</Link>
                            )}
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`lg:hidden transition-colors ${isMobileMenuOpen
                                ? "text-red-500 hover:bg-red-500/10"
                                : (isScrolled ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" : "text-emerald-600 dark:text-white hover:bg-emerald-500/10")
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden py-4 space-y-4 bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-xl mt-2 p-4 border border-gray-100 dark:border-white/10 shadow-xl"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
                        >
                            {profile ? (
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                    <LayoutDashboard size={16} className="mr-2" /> Panel Control
                                </Link>
                            ) : (
                                <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)}>Regístrate Gratis</Link>
                            )}
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.header>
    )
}
