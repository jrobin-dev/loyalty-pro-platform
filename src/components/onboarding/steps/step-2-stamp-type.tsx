"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Coffee, Pizza, Star, ShoppingBag, Dumbbell, Scissors } from "lucide-react"

export default function Step2StampType() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const stampOptions = [
        { id: 'coffee', label: 'Cafetería', icon: Coffee },
        { id: 'restaurant', label: 'Restaurante', icon: Pizza },
        { id: 'retail', label: 'Tienda', icon: ShoppingBag },
        { id: 'beauty', label: 'Belleza', icon: Scissors },
        { id: 'fitness', label: 'Fitness', icon: Dumbbell },
        { id: 'other', label: 'Genérico', icon: Star },
    ]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Elige tu Icono de Sello
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Este icono aparecerá en la tarjeta digital de tus clientes.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stampOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = data.stampType === option.id
                    return (
                        <button
                            key={option.id}
                            onClick={() => updateData({ stampType: option.id })}
                            className={`
                        relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300
                        ${isSelected
                                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-primary/50'
                                }
                    `}
                        >
                            <div className={`
                        p-3 rounded-full transition-colors
                        ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white'}
                    `}>
                                <Icon size={24} />
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700 dark:text-white/80'}`}>
                                {option.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={nextStep}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
