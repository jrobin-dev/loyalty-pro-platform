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
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
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
                        className="text-5xl font-black tracking-tighter text-white"
                    >
                        ¡Enhorabuena!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-zinc-500 text-xl font-medium tracking-tight"
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
                        className="w-full text-lg font-bold h-16 rounded-2xl bg-primary text-black hover:scale-[1.02] active:scale-95 transition-all"
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
                    <p className="text-sm text-zinc-500">
                        Impulsado por <span className="text-emerald-500 font-bold">LoyaltyPro</span> &bull; 2026
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
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    ¡Todo Listo!
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Revisa tu configuración antes de continuar. <br />
                    <span className="text-emerald-500/80">Podrás editar estos datos luego desde tu cuenta.</span>
                </p>
            </div>

            {/* Summary Card */}
            <div className="w-full max-w-[450px] bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl mx-auto">
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
                    className="flex-1 h-15 rounded-2xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all font-bold"
                    onClick={prevStep}
                    disabled={isLoading}
                >
                    Atrás
                </Button>
                <button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="h-15 w-full max-w-[200px] rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 flex items-center justify-center py-4 px-8 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-6 w-6" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            Finalizar <ArrowRight className="ml-2 h-6 w-6" />
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
