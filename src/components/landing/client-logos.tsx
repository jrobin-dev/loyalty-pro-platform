"use client"

import { motion } from "framer-motion"

// SVG Logos (simplified versions)
const logos = [
    {
        name: "Starbucks",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
                <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">
                    STARBUCKS
                </text>
            </svg>
        ),
    },
    {
        name: "McDonald's",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M20 80 Q30 20, 40 80 M60 80 Q70 20, 80 80" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
            </svg>
        ),
    },
    {
        name: "Subway",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="20" y="40" width="60" height="20" fill="currentColor" opacity="0.6" rx="10" />
                <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="background">
                    SUBWAY
                </text>
            </svg>
        ),
    },
    {
        name: "KFC",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.1" />
                <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">
                    KFC
                </text>
            </svg>
        ),
    },
    {
        name: "Domino's",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="25" y="25" width="50" height="50" fill="currentColor" opacity="0.6" rx="8" />
                <circle cx="40" cy="40" r="4" fill="background" />
                <circle cx="60" cy="60" r="4" fill="background" />
            </svg>
        ),
    },
    {
        name: "Pizza Hut",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50 30 L70 70 L30 70 Z" fill="currentColor" opacity="0.6" />
                <text x="50" y="90" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">
                    PIZZA HUT
                </text>
            </svg>
        ),
    },
    {
        name: "Burger King",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <ellipse cx="50" cy="50" rx="40" ry="30" fill="currentColor" opacity="0.6" />
                <text x="50" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="background">
                    BURGER KING
                </text>
            </svg>
        ),
    },
    {
        name: "Dunkin'",
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.6" />
                <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">
                    DUNKIN'
                </text>
            </svg>
        ),
    },
]

// Duplicate for infinite scroll
const allLogos = [...logos, ...logos, ...logos]

export function ClientLogos() {
    return (
        <section className="py-16 md:py-20 border-y border-border bg-muted/30">
            <div className="container mx-auto px-4 mb-8">
                <p className="text-center text-sm md:text-base text-muted-foreground font-medium">
                    Confiado por miles de negocios en todo el mundo
                </p>
            </div>

            {/* Infinite Scroll */}
            <div className="relative overflow-hidden">
                <motion.div
                    className="flex gap-12 md:gap-16"
                    animate={{
                        x: [0, -100 * logos.length / 3 + "%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {allLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-full h-full text-foreground">
                                {logo.svg}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
        </section>
    )
}
