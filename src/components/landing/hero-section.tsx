"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"

export function HeroSection() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Premium Green Neon Background - Dark Mode */}
            <div className="absolute inset-0 -z-10 dark:bg-black bg-white">
                {/* Main green glow orb - only visible in dark mode */}
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] dark:bg-emerald-500/30 bg-emerald-500/5 rounded-full mix-blend-screen filter blur-[120px] dark:animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] dark:bg-green-400/20 bg-green-400/5 rounded-full mix-blend-screen filter blur-[100px] dark:animate-pulse" style={{ animationDelay: "1s" }} />

                {/* Grid overlay - subtle in light mode */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-medium text-emerald-400">
                                Sistema de Lealtad #1 en Perú
                            </span>
                        </motion.div>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            <span className="text-foreground">Fideliza a tus</span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                                Clientes con IA
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            Crea programas de lealtad digitales, gestiona clientes y aumenta tus ventas.
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold"> Todo en una plataforma simple y poderosa.</span>
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-lg px-8 py-6 h-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all group"
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
                                className="text-lg px-8 py-6 h-auto bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 text-foreground group"
                            >
                                <Link href="#demo">
                                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Ver Demo
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap justify-center gap-6 mb-16"
                        >
                            {[
                                "Sin tarjeta de crédito",
                                "Configuración en 5 minutos",
                                "Soporte 24/7",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                        >
                            {[
                                { value: "10K+", label: "Negocios" },
                                { value: "500K+", label: "Clientes" },
                                { value: "95%", label: "Satisfacción" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 hidden lg:block">
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="text-3xl">📱</div>
                        </motion.div>
                    </div>

                    <div className="absolute bottom-20 right-10 hidden lg:block">
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -5, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="text-4xl">🎁</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
