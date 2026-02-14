import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Coffee, Pizza, Star, ShoppingBag, Dumbbell, Scissors, Upload } from "lucide-react"
import { IconUpload } from "@/components/ui/icon-upload"

export default function Step2StampType() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    const stampOptions = [
        { id: 'coffee', label: 'Cafetería', icon: Coffee },
        { id: 'restaurant', label: 'Restaurante', icon: Pizza },
        { id: 'retail', label: 'Tienda', icon: ShoppingBag },
        { id: 'beauty', label: 'Belleza', icon: Scissors },
        { id: 'fitness', label: 'Fitness', icon: Dumbbell },
        { id: 'custom', label: 'Personalizado', icon: Upload },
    ]

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Elige tu Icono de Sello
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Este icono aparecerá en la tarjeta digital de tus clientes.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {stampOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = data.stampType === option.id
                    return (
                        <button
                            key={option.id}
                            onClick={() => updateData({ stampType: option.id })}
                            className={`
                        relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer
                        ${isSelected
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-[#1c1c1c] border-white/5 hover:bg-white/5 hover:border-white/10'
                                }
                    `}
                        >
                            <div className={`
                        p-3 rounded-full transition-colors
                        ${isSelected ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-500'}
                    `}>
                                <Icon size={24} />
                            </div>
                            <span className={`text-sm font-bold ${isSelected ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                {option.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Custom Icon Upload Area - Only show if 'custom' is selected */}
            {data.stampType === 'custom' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Sube tu propio icono en formato SVG para una mejor calidad.
                    </p>
                    <div className="flex justify-center">
                        <IconUpload
                            value={data.customIconUrl}
                            onChange={(url) => updateData({ customIconUrl: url })}
                            onRemove={() => updateData({ customIconUrl: '' })}
                        />
                    </div>
                </div>
            )}

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
                    disabled={data.stampType === 'custom' && !data.customIconUrl}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4 disabled:opacity-50"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
