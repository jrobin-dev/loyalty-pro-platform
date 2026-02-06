"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"
import { useState } from "react"

const testimonials = [
    {
        name: "María González",
        business: "Café Aroma",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        rating: 5,
        text: "LoyaltyPro transformó mi cafetería. Mis clientes ahora regresan 3x más seguido. La app es súper fácil de usar y el soporte es excelente.",
    },
    {
        name: "Carlos Pérez",
        business: "Restaurante El Sabor",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
        rating: 5,
        text: "La mejor inversión para mi restaurante. Fácil de implementar y los clientes lo aman. Aumenté mis ventas un 40% en 3 meses.",
    },
    {
        name: "Ana Martínez",
        business: "Boutique Luna",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        rating: 5,
        text: "Increíble cómo aumentaron mis ventas. El sistema de stamps es adictivo para los clientes. Lo recomiendo 100%.",
    },
    {
        name: "Roberto Silva",
        business: "Barbería Moderna",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
        rating: 5,
        text: "Mis clientes están encantados con las tarjetas digitales. Ya no pierden sus tarjetas físicas y siempre vuelven.",
    },
    {
        name: "Laura Campos",
        business: "Pastelería Dulce Vida",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
        rating: 5,
        text: "El dashboard es muy intuitivo. Puedo ver todas mis ventas y clientes en tiempo real. Una herramienta indispensable.",
    },
    {
        name: "Diego Rojas",
        business: "Gym FitZone",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego",
        rating: 5,
        text: "Perfecto para mi gimnasio. Los miembros aman acumular stamps por cada visita. La retención mejoró un 60%.",
    },
]

// Duplicate for infinite scroll
const allTestimonials = [...testimonials, ...testimonials]

export function TestimonialsSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [isPaused, setIsPaused] = useState(false)

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Lo que dicen{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            nuestros clientes
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Miles de negocios han transformado su relación con sus clientes
                    </p>
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative">
                <div
                    className="flex gap-6 overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <motion.div
                        className="flex gap-6 flex-shrink-0"
                        animate={{
                            x: isPaused ? 0 : [0, -50 * testimonials.length + "%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 60,
                                ease: "linear",
                            },
                        }}
                    >
                        {allTestimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="w-[350px] md:w-[400px] flex-shrink-0 p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10"
                            >
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-foreground/90 mb-6 leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full bg-primary/10"
                                    />
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.business}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
        </section>
    )
}
