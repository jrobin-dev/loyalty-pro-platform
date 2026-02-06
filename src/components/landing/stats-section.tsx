"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

interface StatProps {
    value: number
    label: string
    suffix?: string
    prefix?: string
}

function AnimatedStat({ value, label, suffix = "", prefix = "" }: StatProps) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 })

    useEffect(() => {
        if (inView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: "easeOut",
            })
            return controls.stop
        }
    }, [inView, count, value])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    {prefix}
                    <motion.span>{rounded}</motion.span>
                    {suffix}
                </span>
            </div>
            <div className="text-base md:text-lg text-muted-foreground font-medium">
                {label}
            </div>
        </motion.div>
    )
}

export function StatsSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const stats = [
        { value: 10000, label: "Negocios Activos", suffix: "+" },
        { value: 500000, label: "Clientes Fidelizados", suffix: "+" },
        { value: 95, label: "Satisfacción", suffix: "%" },
        { value: 2000000, label: "Stamps Canjeados", suffix: "+" },
    ]

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-blue-500/5 to-transparent" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Números que{" "}
                        <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            hablan por sí solos
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Miles de negocios confían en LoyaltyPro para fidelizar a sus clientes
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <AnimatedStat key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    )
}
