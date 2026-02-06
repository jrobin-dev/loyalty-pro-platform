"use client"

import Image from "next/image"
import { motion } from "framer-motion"

// Lista de logos de clientes
const logos = [
    {
        name: "Starbucks",
        image: "/assets/images/clientes/starbucks.png",
    },
    {
        name: "McDonald's",
        image: "/assets/images/clientes/mcdonalds.png",
    },
    {
        name: "Subway",
        image: "/assets/images/clientes/subway.png",
    },
    {
        name: "KFC",
        image: "/assets/images/clientes/kfc.png",
    },
    {
        name: "Domino's",
        image: "/assets/images/clientes/dominos.png",
    },
    {
        name: "Pizza Hut",
        image: "/assets/images/clientes/pizzahut.png",
    },
]

// Duplicate for infinite scroll
const allLogos = [...logos, ...logos, ...logos]

export function ClientLogos() {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Marcas que confían en{" "}
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                            LoyaltyPro
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Únete a miles de negocios que ya están fidelizando a sus clientes
                    </p>
                </motion.div>

                {/* Infinite Scroll Container */}
                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex gap-12 md:gap-16"
                        animate={{
                            x: [0, -100 * logos.length + "%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                    >
                        {allLogos.map((logo, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-32 h-16 md:w-40 md:h-20 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                            >
                                <Image
                                    src={logo.image}
                                    alt={logo.name}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                        // Fallback to placeholder if image doesn't exist
                                        const target = e.target as HTMLImageElement
                                        target.src = `https://via.placeholder.com/200x100/10b981/ffffff?text=${logo.name}`
                                    }}
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    )
}
