"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"

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
                <p className="text-white/60 text-sm">
                    Para que tus clientes sepan quién les premia.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">Tu Nombre</Label>
                    <Input
                        placeholder="Ej: Juan Pérez"
                        value={data.ownerName}
                        onChange={(e) => updateData({ ownerName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/80">WhatsApp del Negocio</Label>
                    <div className="flex gap-2">
                        <select
                            className="w-24 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF94] hover:bg-white/10"
                            value={data.country}
                            onChange={(e) => updateData({ country: e.target.value })}
                        >
                            <option value="+51" className="bg-black">🇵🇪 +51</option>
                            <option value="+52" className="bg-black">🇲🇽 +52</option>
                            <option value="+57" className="bg-black">🇨🇴 +57</option>
                            <option value="+54" className="bg-black">🇦🇷 +54</option>
                            <option value="+34" className="bg-black">🇪🇸 +34</option>
                            <option value="+1" className="bg-black">🇺🇸 +1</option>
                        </select>
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
                <Button variant="ghost" className="flex-1" onClick={prevStep}>
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
