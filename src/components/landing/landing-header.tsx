"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Zap } from "lucide-react"

export function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { label: "Inicio", href: "#home" },
        { label: "Características", href: "#features" },
        { label: "Precios", href: "#pricing" },
        { label: "Contacto", href: "#contact" },
    ]

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-lg shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="h-5 w-5 md:h-6 md:h-6 text-white fill-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            LoyaltyPro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Button
                            asChild
                            className="hidden md:inline-flex bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity"
                        >
                            <Link href="/onboarding">Regístrate Gratis</Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
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
                        className="md:hidden py-4 space-y-4"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block text-sm font-medium text-foreground/70 hover:text-primary transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-primary to-blue-500"
                        >
                            <Link href="/onboarding">Regístrate Gratis</Link>
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.header>
    )
}
