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
                    <div className="p-4 bg-emerald-500/20 rounded-full">
                        <Gift className="h-8 w-8 text-emerald-400" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    ¿Cuál es el Premio?
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Describe qué recibirá el cliente al completar su tarjeta
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reward" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descripción del Premio</Label>
                    <Textarea
                        id="reward"
                        placeholder="Ej: ¡Café grande gratis!"
                        value={data.rewardDescription}
                        onChange={(e) => updateData({ rewardDescription: e.target.value })}
                        className="min-h-[140px] bg-[#1c1c1c] border-white/5 rounded-2xl text-white font-bold p-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 resize-none outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Sugerencias rápidas:</Label>
                    <div className="flex flex-wrap gap-2 px-1">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => updateData({ rewardDescription: suggestion })}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-[#1c1c1c] border border-white/5 rounded-full hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 transition-all text-zinc-500"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
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
                    disabled={!data.rewardDescription.trim()}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4 disabled:opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
