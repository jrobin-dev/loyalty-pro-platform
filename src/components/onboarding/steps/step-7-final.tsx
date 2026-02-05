"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { getUserId } from "@/lib/user"

export default function Step8Final() {
    const { data, prevStep, reset } = useOnboardingStore()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const handleComplete = async () => {
        setIsLoading(true)

        try {
            // Get unique user ID
            const userId = getUserId()

            // Save business configuration to Supabase
            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    userId // Include user ID in request
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Error al guardar configuración')
            }

            setIsSaved(true)
            toast.success("¡Configuración guardada exitosamente!", {
                description: "Redirigiendo al dashboard..."
            })

            // Wait for animation, then redirect
            setTimeout(() => {
                reset() // Clear wizard data
                router.push('/dashboard')
            }, 1500)

        } catch (error: any) {
            console.error('Error saving business:', error)
            toast.error(error.message || "Error al guardar configuración", {
                description: "Por favor intenta nuevamente"
            })
        } finally {
            setIsLoading(false)
        }
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
                <p className="text-white/60 text-sm">
                    Revisa tu configuración antes de continuar
                </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Negocio:</span>
                    <span className="font-bold">{data.businessName}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Sellos requeridos:</span>
                    <span className="font-bold">{data.stampsRequired}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Premio:</span>
                    <span className="font-bold text-purple-400">{data.rewardDescription}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Colores:</span>
                    <div className="flex gap-2">
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: data.primaryColor }}
                        />
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: data.secondaryColor }}
                        />
                    </div>
                </div>

                {data.logoUrl && (
                    <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Logo:</span>
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                )}
            </div>

            {isSaved && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-medium">¡Configuración guardada!</p>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={prevStep}
                    disabled={isLoading || isSaved}
                >
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleComplete}
                    disabled={isLoading || isSaved}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Guardando...
                        </>
                    ) : isSaved ? (
                        <>
                            <CheckCircle2 className="mr-2" />
                            ¡Listo!
                        </>
                    ) : (
                        'Completar Configuración'
                    )}
                </Button>
            </div>
        </div>
    )
}
