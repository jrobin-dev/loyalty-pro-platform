"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export function HeroSection() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                Sistema de Lealtad #1 en Perú
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            Fideliza a tus Clientes con{" "}
                            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Tecnología de Vanguardia
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
                        >
                            Crea programas de lealtad digitales, gestiona clientes y aumenta tus ventas.
                            Todo en una plataforma simple y poderosa. <strong>Empieza gratis hoy.</strong>
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity text-base group"
                            >
                                <Link href="/onboarding">
                                    Regístrate Gratis
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="text-base group border-2"
                            >
                                <Link href="#demo">
                                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Ver Demo
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0"
                        >
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                                <div className="text-sm text-muted-foreground">Negocios</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold text-primary">500K+</div>
                                <div className="text-sm text-muted-foreground">Clientes</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-2xl md:text-3xl font-bold text-primary">95%</div>
                                <div className="text-sm text-muted-foreground">Satisfacción</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            {/* Floating Cards Animation */}
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-0 right-0 w-64 h-40 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-primary/20 p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Tarjeta Digital</div>
                                        <div className="text-sm text-muted-foreground">Apple & Google Wallet</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-8 h-8 rounded-lg ${i < 3 ? "bg-primary" : "bg-primary/20"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, 20, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1,
                                }}
                                className="absolute bottom-0 left-0 w-64 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-500/20 p-6 shadow-2xl"
                            >
                                <div className="text-sm text-muted-foreground mb-2">Ventas del Mes</div>
                                <div className="text-3xl font-bold mb-4">+245%</div>
                                <div className="h-16 flex items-end gap-1">
                                    {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-primary to-blue-500 rounded-t"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
