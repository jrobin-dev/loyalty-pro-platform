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
                <p className="text-white/60 text-sm">
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
                                    ? 'bg-[#00FF94]/20 border-[#00FF94] shadow-[0_0_20px_rgba(0,255,148,0.3)] scale-105'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }
                    `}
                        >
                            <span className={`text-5xl font-bold tracking-tighter ${isSelected ? 'text-[#00FF94]' : 'text-white'}`}>
                                {num}
                            </span>
                            <span className={`text-xs mt-2 uppercase tracking-widest font-medium ${isSelected ? 'text-[#00FF94]' : 'text-white/40'}`}>
                                Sellos
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
