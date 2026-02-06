"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !email.includes("@")) {
            toast.error("Por favor ingresa un email válido")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubscribed(true)
        toast.success("¡Gracias por suscribirte!")
        setEmail("")
        setIsSubmitting(false)
    }

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 mb-6">
                            <Mail className="h-8 w-8 text-white" />
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Mantente{" "}
                            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                                Actualizado
                            </span>
                        </h2>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Recibe tips exclusivos, casos de éxito y las últimas novedades de LoyaltyPro
                            directamente en tu inbox
                        </p>
                    </div>

                    {!isSubscribed ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 h-12 px-6 text-base bg-background border-2 border-border focus:border-primary"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity px-8"
                            >
                                {isSubmitting ? "Suscribiendo..." : "Suscribirse"}
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-4 py-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-medium">
                                ¡Gracias por suscribirte! Revisa tu email.
                            </p>
                        </motion.div>
                    )}

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        No spam. Cancela tu suscripción en cualquier momento.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
