import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { TenantSettings } from "@/hooks/use-tenant-settings"
import { Award, Sparkles, Coffee, Pizza, ShoppingBag, Dumbbell, Scissors, Upload, Wifi, BatteryFull, Signal } from "lucide-react"
import { IconUpload } from "@/components/ui/icon-upload"
import { WalletCard } from "@/components/wallet/wallet-card"

interface LoyaltyCardEditorProps {
    settings: TenantSettings
    onSave: (updates: Partial<TenantSettings['loyaltyProgram']>) => Promise<boolean>
}

export function LoyaltyCardEditor({ settings, onSave }: LoyaltyCardEditorProps) {
    const [stampsRequired, setStampsRequired] = useState(settings.loyaltyProgram.stampsRequired)
    const [rewardDescription, setRewardDescription] = useState(settings.loyaltyProgram.rewardTitle)
    // Initialize with fallback to 'star' if forbidden/missing, though schema default is 'star'
    const [stampIcon, setStampIcon] = useState(settings.loyaltyProgram.stampIcon || 'star')
    const [customIconUrl, setCustomIconUrl] = useState(settings.loyaltyProgram.customIconUrl || "")

    const [isSaving, setIsSaving] = useState(false)

    // Sync with settings when they load
    useEffect(() => {
        if (settings?.loyaltyProgram) {
            setStampsRequired(settings.loyaltyProgram.stampsRequired)
            setRewardDescription(settings.loyaltyProgram.rewardTitle)
            setStampIcon(settings.loyaltyProgram.stampIcon || 'star')

            // Only update customIconUrl if settings has a value, OR if we don't have a value locally yet.
            // This prevents a race condition where a fresh upload (local state) gets overwritten by a stale setting (empty)
            if (settings.loyaltyProgram.customIconUrl) {
                setCustomIconUrl(settings.loyaltyProgram.customIconUrl)
            } else if (!customIconUrl) { // If settings has no customIconUrl, and local state is also empty, ensure it stays empty.
                setCustomIconUrl("");
            }
        }
    }, [settings])

    const handleSave = async () => {
        setIsSaving(true)
        await onSave({
            stampsRequired,
            rewardTitle: rewardDescription,
            stampIcon,
            customIconUrl
        })
        setIsSaving(false)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="bg-zinc-900/40 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden h-full">
                <div className="p-5 md:p-8 border-b border-white/5 bg-[#141414]">
                    <h3 className="flex items-center gap-4 text-xl font-bold text-white tracking-tight">
                        <Sparkles className="h-6 w-6 text-emerald-400" />
                        Configuración de Tarjeta
                    </h3>
                </div>
                <div className="p-5 md:p-8 space-y-10">
                    {/* Stamp Icon & Type */}
                    <div className="space-y-3">
                        <Label htmlFor="stamp-type">Diseño del Sello</Label>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {[
                                { id: 'coffee', label: 'Café', icon: Coffee },
                                { id: 'restaurant', label: 'Comida', icon: Pizza },
                                { id: 'retail', label: 'Tienda', icon: ShoppingBag },
                                { id: 'beauty', label: 'Belleza', icon: Scissors },
                                { id: 'fitness', label: 'Fit', icon: Dumbbell },
                                { id: 'custom', label: 'Custom', icon: Upload }, // Replaced Star with Upload/Custom
                            ].map((option) => {
                                const Icon = option.icon
                                const isSelected = stampIcon === option.id
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setStampIcon(option.id)}
                                        className={`
                                            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all
                                            ${isSelected
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span className="text-xs">{option.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {stampIcon === 'custom' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <Label className="mb-2 block text-xs text-muted-foreground">Sube tu icono (SVG recomendado)</Label>
                                <IconUpload
                                    value={customIconUrl}
                                    onChange={setCustomIconUrl}
                                    onRemove={() => setCustomIconUrl("")}
                                />
                            </div>
                        )}
                    </div>

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
                                <span className="text-2xl font-bold text-emerald-400">{stampsRequired}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Los clientes necesitarán {stampsRequired} sellos para obtener su premio
                        </p>
                    </div>

                    {/* Reward Description */}
                    <div className="space-y-2">
                        <Label htmlFor="reward" className="text-xs font-black uppercase tracking-tight text-zinc-500 ml-1">Descripción del premio</Label>
                        <Textarea
                            id="reward"
                            value={rewardDescription}
                            onChange={(e) => setRewardDescription(e.target.value)}
                            placeholder="Ej: ¡Café gratis!"
                            className="bg-[#1c1c1c] border-white/5 rounded-2xl text-white font-bold px-6 py-4 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-700 min-h-[120px] outline-none resize-none"
                            rows={3}
                        />
                        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest pl-1">
                            Describe qué recibirá el cliente al completar su tarjeta
                        </p>
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

            {/* Live Preview - Modern iPhone Style */}
            <div className="flex flex-col items-center justify-center p-4 lg:p-8 h-full">
                {/* Modern Frameless Look - Maximize View */}
                <div className="relative w-full max-w-[380px] h-[750px] bg-black rounded-[55px] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border-[8px] border-zinc-900 ring-1 ring-white/10">

                    {/* Dynamic Island / Notch Area */}
                    <div className="absolute top-0 w-full h-14 flex items-center justify-between px-8 text-white text-xs z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                        <span className="font-semibold text-sm">9:41</span>
                        {/* Dynamic Island */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[120px] h-[35px] bg-black rounded-full flex items-center justify-center z-30">
                            <div className="w-16 h-4 bg-zinc-900/50 rounded-full" />
                        </div>
                        <div className="flex gap-2 items-center grayscale opacity-90">
                            <Signal size={16} fill="currentColor" className="text-white" />
                            <Wifi size={16} className="text-white" />
                            <BatteryFull size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Wallet Card Component */}
                    <div className="h-full w-full flex items-center justify-center p-4 bg-zinc-950">
                        <WalletCard
                            tenant={{
                                ...settings.tenant,
                                loyalty: {
                                    stampIcon: stampIcon,
                                    customIconUrl: customIconUrl,
                                    rewardImage: settings.loyaltyProgram.rewardImage,
                                    rewardTitle: rewardDescription
                                }
                            }}
                            customer={{
                                name: 'Roxy Studio',
                                avatarUrl: '',
                                id: '123456'
                            }}
                            stamps={1} // Show 1 stamp earned
                            maxStamps={stampsRequired}
                            primaryColor={settings.branding.primaryColor || '#23a341'}
                        />
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-20" />
                </div>
            </div>
        </div>
    )
}
