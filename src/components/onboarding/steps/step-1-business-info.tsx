"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
// We'll need a Select component, let's assume standard HTML select for now or install Radix Select later
// For speed, let's use a styled HTML select or the Input component

export default function Step1BusinessInfo() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const handleContinue = () => {
        if (!data.businessName || !data.category) return
        if (data.category === 'other' && !data.customCategory) return
        nextStep()
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Hablemos de tu Negocio
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Esta información aparecerá en la tarjeta de tus clientes.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nombre del Negocio</Label>
                    <Input
                        placeholder="Ej: Cafetería Central"
                        value={data.businessName}
                        onChange={(e) => updateData({ businessName: e.target.value })}
                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/20 transition-all placeholder:text-zinc-800 outline-none"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Moneda (Símbolo)</Label>
                    <Input
                        placeholder="Ej: S/ o $"
                        value={data.currency || '$'}
                        onChange={(e) => updateData({ currency: e.target.value })}
                        onFocus={(e) => e.target.select()}
                        maxLength={5}
                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/20 transition-all placeholder:text-zinc-800 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Categoría</Label>
                    <select
                        className="flex h-14 w-full rounded-2xl border border-white/5 bg-[#1c1c1c] px-6 py-2 text-base text-white font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 transition-all appearance-none cursor-pointer"
                        value={data.category}
                        onChange={(e) => updateData({ category: e.target.value })}
                    >
                        <option value="" disabled className="bg-[#0a0a0a] text-white">Selecciona una categoría</option>
                        <option value="coffee" className="bg-[#0a0a0a] text-white">Cafetería</option>
                        <option value="restaurant" className="bg-[#0a0a0a] text-white">Restaurante</option>
                        <option value="beauty" className="bg-[#0a0a0a] text-white">Belleza / Spa</option>
                        <option value="retail" className="bg-[#0a0a0a] text-white">Tienda / Retail</option>
                        <option value="other" className="bg-[#0a0a0a] text-white">Otro</option>
                    </select>
                </div>

                {data.category === 'other' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Especifique Categoría</Label>
                        <Input
                            placeholder="Ej: Gimnasio"
                            value={data.customCategory || ''}
                            onChange={(e) => updateData({ customCategory: e.target.value })}
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/20 transition-all placeholder:text-zinc-800 outline-none"
                            autoFocus
                        />
                    </div>
                )}
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
                    disabled={!data.businessName || !data.category || (data.category === 'other' && !data.customCategory)}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4 disabled:opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
