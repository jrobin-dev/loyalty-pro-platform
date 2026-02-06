"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
    Smartphone,
    BarChart3,
    Users,
    Gift,
    Wallet,
    TrendingUp
} from "lucide-react"

const features = [
    {
        icon: Smartphone,
        title: "Sistema de Lealtad Digital",
        description: "Tarjetas digitales en Apple Wallet y Google Wallet. Tus clientes llevan su tarjeta de lealtad en su teléfono, siempre disponible.",
        gradient: "from-primary to-emerald-500",
    },
    {
        icon: BarChart3,
        title: "Reportes de Ventas en Tiempo Real",
        description: "Control diario, semanal y mensual de tus ventas. Gráficos interactivos y exportación de datos para tomar mejores decisiones.",
        gradient: "from-emerald-500 to-green-500",
    },
    {
        icon: Users,
        title: "Gestión Inteligente de Clientes",
        description: "Base de datos centralizada con historial de compras, segmentación automática y análisis de comportamiento.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: Gift,
        title: "Programa de Recompensas",
        description: "Crea promociones personalizadas, stamps digitales y premios que mantengan a tus clientes regresando por más.",
        gradient: "from-orange-500 to-red-500",
    },
    {
        icon: Wallet,
        title: "App Propia para Clientes",
        description: "Tus clientes pueden ver sus stamps, canjear premios y recibir notificaciones desde nuestra app móvil.",
        gradient: "from-indigo-500 to-purple-500",
    },
    {
        icon: TrendingUp,
        title: "Plan Gratuito Completo",
        description: "Empieza gratis sin tarjeta de crédito. Todas las funciones esenciales incluidas. Escala cuando estés listo.",
        gradient: "from-green-500 to-teal-500",
    },
]

export function FeaturesSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    return (
        <section id="features" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Todo lo que necesitas para{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            hacer crecer tu negocio
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Herramientas profesionales diseñadas para pequeños y medianos negocios
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative h-full p-6 md:p-8 rounded-2xl bg-card hover:bg-card/80 transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                                {/* Icon */}
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl md:text-2xl font-bold mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover effect gradient */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity -z-10`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
