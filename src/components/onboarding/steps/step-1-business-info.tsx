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
        nextStep()
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Hablemos de tu Negocio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Esta información aparecerá en la tarjeta de tus clientes.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Negocio</Label>
                    <Input
                        placeholder="Ej: Cafetería Central"
                        value={data.businessName}
                        onChange={(e) => updateData({ businessName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Moneda (Símbolo)</Label>
                    <Input
                        placeholder="Ej: S/ o $"
                        value={data.currency || '$'}
                        onChange={(e) => updateData({ currency: e.target.value })}
                        onFocus={(e) => e.target.select()}
                        maxLength={5}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</Label>
                    <select
                        className="flex h-12 w-full rounded-xl border border-input px-4 py-2 text-sm text-foreground bg-white dark:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        value={data.category}
                        onChange={(e) => updateData({ category: e.target.value })}
                    >
                        <option value="" disabled className="bg-background text-foreground">Selecciona una categoría</option>
                        <option value="coffee" className="bg-background text-foreground">Cafetería</option>
                        <option value="restaurant" className="bg-background text-foreground">Restaurante</option>
                        <option value="beauty" className="bg-background text-foreground">Belleza / Spa</option>
                        <option value="retail" className="bg-background text-foreground">Tienda / Retail</option>
                        <option value="other" className="bg-background text-foreground">Otro</option>
                    </select>
                </div>

                {data.category === 'other' && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Especifique Categoría</Label>
                        <Input
                            placeholder="Ej: Gimnasio"
                            value={data.customCategory || ''}
                            onChange={(e) => updateData({ customCategory: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <Button
                    variant="ghost"
                    className="flex-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                    onClick={prevStep}
                >
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!data.businessName || !data.category}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
