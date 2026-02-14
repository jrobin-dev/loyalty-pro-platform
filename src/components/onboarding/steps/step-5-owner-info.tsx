"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

export default function Step5OwnerInfo() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const handleContinue = () => {
        if (!data.ownerName || !data.whatsapp) return
        nextStep()
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Datos de Contacto
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Para que tus clientes sepan quién les premia.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Tu Nombre</Label>
                    <Input
                        placeholder="Ej: Juan Pérez"
                        value={data.ownerName}
                        onChange={(e) => updateData({ ownerName: e.target.value })}
                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 outline-none"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">WhatsApp del Negocio</Label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
                            <CountryCodeSelect
                                value={data.country || "+51"}
                                onChange={(value) => updateData({ country: value })}
                            />
                            <div className="w-[1px] h-6 bg-white/10" />
                        </div>
                        <Input
                            placeholder="999 999 999"
                            value={data.whatsapp}
                            type="tel"
                            onChange={(e) => updateData({ whatsapp: e.target.value })}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold pl-40 pr-6 focus-visible:ring-1 focus-visible:ring-white/20 transition-all placeholder:text-zinc-800 outline-none w-full"
                        />
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
                    onClick={handleContinue}
                    disabled={!data.ownerName || !data.whatsapp}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4 disabled:opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
