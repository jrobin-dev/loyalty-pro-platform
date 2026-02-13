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
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Datos de Contacto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Para que tus clientes sepan quién les premia.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tu Nombre</Label>
                    <Input
                        placeholder="Ej: Juan Pérez"
                        value={data.ownerName}
                        onChange={(e) => updateData({ ownerName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp del Negocio</Label>
                    <div className="flex gap-2">
                        <CountryCodeSelect
                            value={data.country || "+51"}
                            onChange={(value) => updateData({ country: value })}
                        />
                        <Input
                            placeholder="999 999 999"
                            value={data.whatsapp}
                            type="tel"
                            onChange={(e) => updateData({ whatsapp: e.target.value })}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="ghost" className="flex-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors" onClick={prevStep}>
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!data.ownerName || !data.whatsapp}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
