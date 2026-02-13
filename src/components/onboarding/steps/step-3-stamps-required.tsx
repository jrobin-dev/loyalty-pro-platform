"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"

export default function Step3StampsRequired() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const options = [6, 8, 10, 12]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Meta de Sellos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    ¿Cuántos sellos debe juntar el cliente para ganar su premio?
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {options.map((num) => {
                    const isSelected = data.stampsRequired === num
                    return (
                        <button
                            key={num}
                            onClick={() => updateData({ stampsRequired: num })}
                            className={`
                        relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300
                        ${isSelected
                                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105'
                                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-primary/50'
                                }
                    `}
                        >
                            <span className={`text-5xl font-bold tracking-tighter ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                {num}
                            </span>
                            <span className={`text-xs mt-2 uppercase tracking-widest font-medium ${isSelected ? 'text-primary' : 'text-gray-500 dark:text-white/40'}`}>
                                Sellos
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors" onClick={prevStep}>
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
