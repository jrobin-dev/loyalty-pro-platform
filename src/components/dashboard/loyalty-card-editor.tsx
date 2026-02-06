"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { TenantSettings } from "@/hooks/use-tenant-settings"
import { Award, Sparkles } from "lucide-react"

interface LoyaltyCardEditorProps {
    settings: TenantSettings
    onSave: (updates: Partial<TenantSettings['loyaltyProgram']>) => Promise<boolean>
}

export function LoyaltyCardEditor({ settings, onSave }: LoyaltyCardEditorProps) {
    const [stampsRequired, setStampsRequired] = useState(settings.loyaltyProgram.stampsRequired)
    const [rewardDescription, setRewardDescription] = useState(settings.loyaltyProgram.rewardTitle)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await onSave({
            stampsRequired,
            rewardTitle: rewardDescription
        })
        setIsSaving(false)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <Card className="bg-card/50 backdrop-blur-sm border-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        Configuración de Tarjeta
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Stamps Required */}
                    <div className="space-y-3">
                        <Label htmlFor="stamps">Sellos requeridos para premio</Label>
                        <div className="flex items-center gap-4">
                            <Slider
                                id="stamps"
                                min={5}
                                max={20}
                                step={1}
                                value={[stampsRequired]}
                                onValueChange={(value) => setStampsRequired(value[0])}
                                className="flex-1"
                            />
                            <div className="w-16 text-center">
                                <span className="text-2xl font-bold text-purple-400">{stampsRequired}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Los clientes necesitarán {stampsRequired} sellos para obtener su premio
                        </p>
                    </div>

                    {/* Reward Description */}
                    <div className="space-y-2">
                        <Label htmlFor="reward">Descripción del premio</Label>
                        <Textarea
                            id="reward"
                            value={rewardDescription}
                            onChange={(e) => setRewardDescription(e.target.value)}
                            placeholder="Ej: ¡Café gratis!"
                            className="bg-card/50 border-white/10"
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                            Describe qué recibirá el cliente al completar su tarjeta
                        </p>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </CardContent>
            </Card>

            {/* Live Preview - Mobile Phone Style */}
            <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    {/* Phone Frame */}
                    <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
                        {/* Phone Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

                        {/* Phone Screen */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] overflow-hidden">
                            {/* Status Bar */}
                            <div className="h-12 flex items-center justify-between px-6 text-white text-xs">
                                <span>9:30</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                    <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 space-y-4">
                                {/* Business Header */}
                                <div
                                    className="rounded-2xl p-6 text-center"
                                    style={{
                                        backgroundColor: settings.branding.primaryColor || '#8b5cf6'
                                    }}
                                >
                                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                                        <Award className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">{settings.tenant.name}</h3>
                                </div>

                                {/* Stamps Section */}
                                <div className="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-white/80 text-sm">Progreso</p>
                                        <p className="text-white text-lg font-bold">
                                            0/{stampsRequired} Sellos
                                        </p>
                                    </div>

                                    {/* Stamp Grid */}
                                    <div
                                        className="grid gap-2 mb-3"
                                        style={{
                                            gridTemplateColumns: `repeat(${Math.min(stampsRequired, 4)}, minmax(0, 1fr))`
                                        }}
                                    >
                                        {Array.from({ length: stampsRequired }).map((_, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-xl flex items-center justify-center bg-white/10 border-2 border-dashed border-white/20"
                                            >
                                                <div className="h-5 w-5 border-2 border-dashed border-white/30 rounded-full" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: '0%',
                                                backgroundColor: settings.branding.primaryColor || '#8b5cf6'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Reward Section */}
                                <div className="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm border border-white/10 text-center">
                                    <p className="text-white/60 text-xs mb-1">PREMIO</p>
                                    <p className="text-white font-bold">{rewardDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
