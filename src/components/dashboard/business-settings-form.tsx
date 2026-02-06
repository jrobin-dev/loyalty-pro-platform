"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TenantSettings } from "@/hooks/use-tenant-settings"
import { Building2, Palette } from "lucide-react"

interface BusinessSettingsFormProps {
    settings: TenantSettings
    onSaveTenant: (updates: Partial<TenantSettings['tenant']>) => Promise<boolean>
    onSaveBranding: (updates: Partial<TenantSettings['branding']>) => Promise<boolean>
}

export function BusinessSettingsForm({ settings, onSaveTenant, onSaveBranding }: BusinessSettingsFormProps) {
    const [name, setName] = useState(settings.tenant.name)
    const [primaryColor, setPrimaryColor] = useState(settings.branding.primaryColor)
    const [secondaryColor, setSecondaryColor] = useState(settings.branding.secondaryColor)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)

        // Update tenant name
        await onSaveTenant({ name })

        // Update branding colors
        await onSaveBranding({
            primaryColor,
            secondaryColor
        })

        setIsSaving(false)
    }

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-transparent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Información del Negocio
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del negocio</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Mi Negocio"
                        className="bg-card/50 border-white/10"
                    />
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Colores de marca
                    </Label>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primary" className="text-xs text-muted-foreground">
                                Color primario
                            </Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    id="primary"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg cursor-pointer border border-white/10"
                                />
                                <Input
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="bg-card/50 border-white/10 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secondary" className="text-xs text-muted-foreground">
                                Color secundario
                            </Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    id="secondary"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg cursor-pointer border border-white/10"
                                />
                                <Input
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="bg-card/50 border-white/10 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color Preview */}
                    <div className="p-4 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                    }}>
                        <p className="text-white font-bold text-center">Vista previa de colores</p>
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
            </CardContent>
        </Card>
    )
}
