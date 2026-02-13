"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ColorPicker } from "@/components/ui/color-picker"
import { GradientDirectionPicker } from "@/components/ui/gradient-direction-picker"

export default function Step4Branding() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Dale color a tu Marca
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Personaliza los colores de tu tarjeta digital.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-6">
                    <ColorPicker
                        label="Color Principal"
                        color={data.primaryColor}
                        onChange={(color) => updateData({ primaryColor: color })}
                    />

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={data.gradientEnabled}
                            onCheckedChange={(checked) => updateData({ gradientEnabled: checked })}
                            id="gradient-mode"
                        />
                        <Label htmlFor="gradient-mode" className="cursor-pointer">Usar degradado</Label>
                    </div>

                    {data.gradientEnabled && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="p-4 rounded-lg bg-card/30 border border-white/5 space-y-4">
                                <ColorPicker
                                    label="Color Secundario"
                                    color={data.secondaryColor}
                                    onChange={(color) => updateData({ secondaryColor: color })}
                                />
                                <GradientDirectionPicker
                                    value={data.gradientDirection || "to right"}
                                    onChange={(direction) => updateData({ gradientDirection: direction })}
                                />
                            </div>
                        </div>
                    )}

                    {!data.gradientEnabled && (
                        <div className="opacity-50 pointer-events-none filter grayscale">
                            <ColorPicker
                                label="Color Secundario (Ignorado)"
                                color={data.secondaryColor}
                                onChange={() => { }}
                            />
                        </div>
                    )}
                </div>

                {/* Preview Box */}
                <div className="space-y-3">
                    <Label className="text-xs font-medium text-gray-500 dark:text-white/60 uppercase tracking-widest">Vista Previa (Mini)</Label>
                    <div
                        className="w-full h-32 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-200 dark:border-white/10 relative overflow-hidden transition-all duration-500"
                        style={{
                            background: data.gradientEnabled
                                ? (data.gradientDirection?.includes('radial')
                                    ? `radial-gradient(circle at center, ${data.primaryColor}, ${data.secondaryColor})`
                                    : `linear-gradient(${data.gradientDirection || 'to right'}, ${data.primaryColor}, ${data.secondaryColor})`)
                                : data.primaryColor
                        }}
                    >
                        <div className="absolute inset-0 bg-white/10 z-0 mix-blend-overlay"></div>
                        <div className="text-white font-bold text-xl drop-shadow-md z-10 font-[family-name:var(--font-funnel-display)]">Tu Marca</div>
                        {/* Shine effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-20" />
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
                    onClick={nextStep}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
