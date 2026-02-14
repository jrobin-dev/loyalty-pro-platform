"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TenantSettings } from "@/hooks/use-tenant-settings"
import { Building2, Palette, ImageIcon } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
import { GradientDirectionPicker } from "@/components/ui/gradient-direction-picker"
import { ImageUpload } from "@/components/ui/image-upload"

interface BusinessSettingsFormProps {
    settings: TenantSettings
    onSaveTenant: (updates: Partial<TenantSettings['tenant']>) => Promise<boolean>
    onSaveBranding: (updates: Partial<TenantSettings['branding']>) => Promise<boolean>
}

export function BusinessSettingsForm({ settings, onSaveTenant, onSaveBranding }: BusinessSettingsFormProps) {
    const [name, setName] = useState(settings.tenant.name)
    const [primaryColor, setPrimaryColor] = useState(settings.branding.primaryColor)
    const [secondaryColor, setSecondaryColor] = useState(settings.branding.secondaryColor)
    const [currency, setCurrency] = useState(settings.tenant.currency || '$')

    const [logoUrl, setLogoUrl] = useState(settings.branding.logoUrl || "")
    const [gradient, setGradient] = useState(settings.branding.gradient || false)
    const [gradientDirection, setGradientDirection] = useState(settings.branding.gradientDirection || "to right")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)

        // Update tenant name
        await onSaveTenant({ name, currency })

        // Update branding colors and currency
        await onSaveBranding({
            primaryColor,
            secondaryColor,

            logoUrl,
            gradient,
            gradientDirection
        })

        setIsSaving(false)
    }

    return (
        <div className="bg-zinc-900/40 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-[#141414]">
                <h3 className="flex items-center gap-4 text-xl font-bold text-white tracking-tight">
                    <Building2 className="h-6 w-6 text-blue-500" />
                    Información del Negocio
                </h3>
            </div>
            <div className="p-8 space-y-10">
                {/* Business Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Nombre del negocio</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Mi Negocio"
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 outline-none"
                        />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <Label htmlFor="currency" className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Moneda (Símbolo)</Label>
                        <Input
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            placeholder="$"
                            className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-bold px-6 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 outline-none"
                            maxLength={10}
                        />
                    </div>



                    {/* Logo (Now in the grid) */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Logotipo
                        </Label>
                        <div className="w-full">
                            <ImageUpload
                                value={logoUrl}
                                onChange={setLogoUrl}
                                onRemove={() => setLogoUrl("")}
                            />
                        </div>
                    </div>
                </div>

                {/* Branding Colors */}
                <div className="space-y-6">
                    <Label className="flex items-center gap-2 text-lg font-semibold">
                        <Palette className="h-5 w-5 text-primary" />
                        Colores de marca
                    </Label>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <ColorPicker
                                label="Color principal"
                                color={primaryColor}
                                onChange={setPrimaryColor}
                            />

                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={gradient}
                                    onCheckedChange={setGradient}
                                    id="gradient-mode"
                                />
                                <Label htmlFor="gradient-mode" className="cursor-pointer">Usar degradado</Label>
                            </div>

                            {gradient && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                    <div className="p-4 rounded-lg bg-secondary/20 border border-border space-y-4">
                                        <ColorPicker
                                            label="Color secundario"
                                            color={secondaryColor}
                                            onChange={setSecondaryColor}
                                        />
                                        <GradientDirectionPicker
                                            value={gradientDirection}
                                            onChange={setGradientDirection}
                                        />
                                    </div>
                                </div>
                            )}

                            {!gradient && (
                                <div className="opacity-50 pointer-events-none filter grayscale">
                                    <ColorPicker
                                        label="Color secundario (Ignorado)"
                                        color={secondaryColor}
                                        onChange={() => { }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Live Preview */}
                        <div className="space-y-2">
                            <Label>Vista previa</Label>
                            <div
                                className="w-full h-32 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-500"
                                style={{
                                    background: gradient
                                        ? gradientDirection.includes('radial')
                                            ? `radial-gradient(circle at center, ${primaryColor}, ${secondaryColor})`
                                            : `linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})`
                                        : primaryColor
                                }}
                            >
                                <span className="text-white font-bold text-lg drop-shadow-md">
                                    {name || "Tu Marca"}
                                </span>
                            </div>
                            <div className="w-full h-12 rounded-lg mt-4 flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
                                style={{ backgroundColor: secondaryColor }}
                            >
                                Color Secundario / Acento
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-14 rounded-2xl bg-white text-black font-black text-lg transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-white/5"
                >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>
        </div>
    )
}
