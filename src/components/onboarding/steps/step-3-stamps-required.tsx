"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"

export default function Step3StampsRequired() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const options = [6, 8, 10, 12]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Meta de Sellos
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
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
                        relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 cursor-pointer
                        ${isSelected
                                    ? 'bg-emerald-500/10 border-emerald-500/30 scale-105'
                                    : 'bg-[#1c1c1c] border-white/5 hover:bg-white/5 hover:border-white/10'
                                }
                    `}
                        >
                            <span className={`text-5xl font-black tracking-tighter ${isSelected ? 'text-emerald-500' : 'text-white'}`}>
                                {num}
                            </span>
                            <span className={`text-[10px] mt-2 uppercase tracking-widest font-black ${isSelected ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                Sellos
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    className="flex-1 h-15 rounded-2xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all font-bold"
                    onClick={prevStep}
                >
                    Atrás
                </Button>
                <button
                    onClick={nextStep}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
