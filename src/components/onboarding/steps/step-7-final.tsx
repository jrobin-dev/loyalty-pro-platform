"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, Sparkles, Rocket, Smartphone, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import confetti from "canvas-confetti"

export default function Step8Final() {
    const { data, prevStep, reset } = useOnboardingStore()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [showCelebration, setShowCelebration] = useState(false)

    // Trigger confetti when celebration starts
    useEffect(() => {
        if (showCelebration) {
            const duration = 3 * 1000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                })
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                })
            }, 250)

            return () => clearInterval(interval)
        }
    }, [showCelebration])

    const handleComplete = async () => {
        setIsLoading(true)

        try {
            console.log('📝 Submitting onboarding data...')
            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Error al guardar configuración')

            if (result.session) {
                const supabase = createClient()
                await supabase.auth.setSession({
                    access_token: result.session.access_token,
                    refresh_token: result.session.refresh_token
                })
            }

            setIsSaved(true)
            setShowCelebration(true)
            toast.success("¡Configuración guardada exitosamente!")

        } catch (error: any) {
            console.error('❌ Error saving business:', error)
            toast.error(error.message || "Error al guardar configuración")
        } finally {
            setIsLoading(false)
        }
    }

    const goToDashboard = () => {
        reset()
        router.push('/dashboard')
        router.refresh()
    }

    if (showCelebration) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-12 max-w-[500px] mx-auto"
            >
                {/* Impactful Icon Area */}
                <div className="relative flex justify-center scale-110">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center relative z-10"
                    >
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(0,255,148,0.4)]">
                            <CheckCircle2 className="h-12 w-12 text-black" strokeWidth={3} />
                        </div>
                    </motion.div>
                    {/* Decorative Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/20 rounded-full animate-ping" />
                </div>

                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-black font-[family-name:var(--font-funnel-display)] tracking-tight text-foreground"
                    >
                        ¡Enhorabuena!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground text-xl leading-relaxed"
                    >
                        Tu tarjeta de lealtad ha sido creada exitosamente. Estamos listos para despegar.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-4 pt-4"
                >
                    <Button
                        size="lg"
                        className="w-full text-lg font-bold h-16 rounded-2xl bg-primary text-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                        onClick={goToDashboard}
                    >
                        Acceder al Dashboard <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-16 rounded-2xl border-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-all font-bold"
                    >
                        Descargar App <Smartphone className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>

                {/* Specific Footer for success screen */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-12"
                >
                    <p className="text-sm text-muted-foreground">
                        Impulsado por <span className="text-primary font-bold">LoyaltyPro</span> &bull; 2026
                    </p>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/20 rounded-full">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    ¡Todo Listo!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Revisa tu configuración antes de continuar
                </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-600 dark:text-white/60">Negocio:</span>
                    <span className="font-bold text-foreground text-right">{data.businessName}</span>
                </div>

                <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-600 dark:text-white/60">Sellos requeridos:</span>
                    <span className="font-bold text-foreground">{data.stampsRequired}</span>
                </div>

                <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-600 dark:text-white/60">Premio:</span>
                    <span className="font-bold text-primary">{data.rewardDescription}</span>
                </div>

                <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-600 dark:text-white/60">Colores:</span>
                    <div className="flex gap-2">
                        <div
                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-white/20"
                            style={{ backgroundColor: data.primaryColor }}
                        />
                        {data.gradientEnabled && (
                            <div
                                className="w-6 h-6 rounded-full border border-gray-200 dark:border-white/20"
                                style={{ backgroundColor: data.secondaryColor }}
                            />
                        )}
                    </div>
                </div>

                {data.logoUrl && (
                    <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-gray-600 dark:text-white/60">Logo:</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    className="flex-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                    onClick={prevStep}
                    disabled={isLoading}
                >
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleComplete}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            Confirmar y Finalizar <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
