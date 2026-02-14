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
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Dale color a tu Marca
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
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

                    <div className="flex items-center gap-3 bg-[#1c1c1c] border border-white/5 p-4 rounded-2xl">
                        <Switch
                            checked={data.gradientEnabled}
                            onCheckedChange={(checked) => updateData({ gradientEnabled: checked })}
                            id="gradient-mode"
                            className="data-[state=checked]:bg-emerald-500"
                        />
                        <Label htmlFor="gradient-mode" className="cursor-pointer text-xs font-black uppercase tracking-widest text-zinc-400">Usar degradado</Label>
                    </div>

                    {data.gradientEnabled && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="p-6 rounded-2xl bg-[#1c1c1c] border border-white/5 space-y-6 shadow-2xl">
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vista Previa (Mini)</Label>
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
                        <div className="text-white font-black text-2xl tracking-tighter drop-shadow-2xl z-10">Tu Marca</div>
                        {/* Shine effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-20" />
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
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
