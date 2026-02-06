"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"

export default function Step4RewardDescription() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const suggestions = [
        "¡Bebida gratis!",
        "¡Pizza gratis!",
        "¡Descuento del 50%!",
        "¡Postre de cortesía!",
        "¡Combo especial gratis!",
    ]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-purple-500/20 rounded-full">
                        <Gift className="h-8 w-8 text-purple-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    ¿Cuál es el Premio?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Describe qué recibirá el cliente al completar su tarjeta
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reward">Descripción del Premio</Label>
                    <Textarea
                        id="reward"
                        placeholder="Ej: ¡Café grande gratis!"
                        value={data.rewardDescription}
                        onChange={(e) => updateData({ rewardDescription: e.target.value })}
                        className="min-h-[100px] bg-white dark:bg-white/5 border-input border-gray-200 dark:border-white/10 focus:border-purple-500/50 resize-none text-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 dark:text-white/40">Sugerencias rápidas:</Label>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => updateData({ rewardDescription: suggestion })}
                                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all text-gray-700 dark:text-white"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={nextStep}
                    disabled={!data.rewardDescription.trim()}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
