"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
// We'll need a Select component, let's assume standard HTML select for now or install Radix Select later
// For speed, let's use a styled HTML select or the Input component

export default function Step1BusinessInfo() {
    const { data, updateData, nextStep } = useOnboardingStore()

    const handleContinue = () => {
        if (!data.businessName || !data.category) return
        nextStep()
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Hablemos de tu Negocio
                </h2>
                <p className="text-white/60 text-sm">
                    Esta información aparecerá en la tarjeta de tus clientes.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Nombre del Negocio</Label>
                    <Input
                        placeholder="Ej: Cafetería Central"
                        value={data.businessName}
                        onChange={(e) => updateData({ businessName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Categoría</Label>
                    <select
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF94] focus-visible:ring-offset-2 hover:bg-white/10"
                        value={data.category}
                        onChange={(e) => updateData({ category: e.target.value })}
                    >
                        <option value="" disabled className="bg-black">Selecciona una categoría</option>
                        <option value="coffee" className="bg-black">Cafetería</option>
                        <option value="restaurant" className="bg-black">Restaurante</option>
                        <option value="beauty" className="bg-black">Belleza / Spa</option>
                        <option value="retail" className="bg-black">Tienda / Retail</option>
                        <option value="other" className="bg-black">Otro</option>
                    </select>
                </div>

                {data.category === 'other' && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">Especifique Categoría</Label>
                        <Input
                            placeholder="Ej: Gimnasio"
                            value={data.customCategory || ''}
                            onChange={(e) => updateData({ customCategory: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <Button
                className="w-full text-lg font-bold"
                size="lg"
                onClick={handleContinue}
                disabled={!data.businessName || !data.category}
            >
                Continuar
            </Button>
        </div>
    )
}
