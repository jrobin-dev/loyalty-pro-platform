"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Business } from "@/hooks/use-business"
import { Award, Sparkles } from "lucide-react"

interface LoyaltyCardEditorProps {
    business: Business
    onSave: (updates: Partial<Business>) => Promise<boolean>
}

export function LoyaltyCardEditor({ business, onSave }: LoyaltyCardEditorProps) {
    const [stampsRequired, setStampsRequired] = useState(business.stamps_required)
    const [rewardDescription, setRewardDescription] = useState(business.reward_description)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await onSave({
            stamps_required: stampsRequired,
            reward_description: rewardDescription
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

            {/* Live Preview */}
            <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-transparent">
                <CardHeader>
                    <CardTitle className="text-white">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-white/80 text-sm">Progreso</p>
                                <p className="text-white text-2xl font-bold">
                                    5/{stampsRequired} Sellos
                                </p>
                            </div>
                            <Award className="h-10 w-10 text-white/90" />
                        </div>

                        {/* Stamp Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {Array.from({ length: stampsRequired }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center ${index < 5
                                            ? 'bg-white text-purple-600'
                                            : 'bg-white/20 text-white/40'
                                        }`}
                                >
                                    {index < 5 ? (
                                        <Award className="h-5 w-5" />
                                    ) : (
                                        <div className="h-5 w-5 border-2 border-dashed border-current rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-4">
                            <div
                                className="bg-white h-full transition-all duration-500"
                                style={{ width: `${(5 / stampsRequired) * 100}%` }}
                            />
                        </div>

                        {/* Reward Description */}
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                            <p className="text-white font-bold">{rewardDescription}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
