"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
// import { Switch } from "@/components/ui/switch" (We need to build switch or use checkbox)

export default function Step4Branding() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Dale color a tu Marca
                </h2>
                <p className="text-white/60 text-sm">
                    Personaliza los colores de tu tarjeta digital.
                </p>
            </div>

            <div className="space-y-6">
                {/* Colors Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-white/60 uppercase tracking-widest">Color Principal</Label>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                            <input
                                type="color"
                                value={data.primaryColor}
                                onChange={(e) => updateData({ primaryColor: e.target.value })}
                                className="h-10 w-10 rounded-lg bg-transparent border-0 cursor-pointer"
                            />
                            <span className="text-sm font-mono text-white/80">{data.primaryColor}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-white/60 uppercase tracking-widest">Color Secundario</Label>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                            <input
                                type="color"
                                value={data.secondaryColor}
                                onChange={(e) => updateData({ secondaryColor: e.target.value })}
                                className="h-10 w-10 rounded-lg bg-transparent border-0 cursor-pointer"
                            />
                            <span className="text-sm font-mono text-white/80">{data.secondaryColor}</span>
                        </div>
                    </div>
                </div>

                {/* Preview Box */}
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-white/60 uppercase tracking-widest">Vista Previa (Mini)</Label>
                    <div
                        className="w-full h-32 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden"
                        style={{
                            background: data.gradientEnabled
                                ? `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`
                                : data.primaryColor
                        }}
                    >
                        <div className="text-white font-bold text-xl drop-shadow-md">Tu Marca</div>
                        {/* Shine effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <input
                            type="checkbox"
                            id="gradient"
                            checked={data.gradientEnabled}
                            onChange={(e) => updateData({ gradientEnabled: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-[#00FF94] focus:ring-[#00FF94]"
                        />
                        <Label htmlFor="gradient" className="text-sm text-white/80">Activar Gradiente</Label>
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
                    onClick={nextStep}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
