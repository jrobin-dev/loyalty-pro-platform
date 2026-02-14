"use client"

import { Button } from "@/components/ui/button"
import { Gift, Plus, Trophy } from "lucide-react"
import { useTenantSettings } from "@/hooks/use-tenant-settings"

export default function RewardsPage() {
    const { settings } = useTenantSettings()
    const currency = settings?.tenant.currency || 'S/'
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-500/40 font-sans uppercase tracking-widest text-xs">Catálogo de Recompensas</h2>
                </div>
                <button className="bg-white text-black h-12 px-6 rounded-2xl font-black text-sm transition-all hover:bg-zinc-200 active:scale-95 shadow-xl flex items-center gap-2">
                    <Plus size={18} strokeWidth={3} /> Nuevo Premio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Demo Reward Card 1 */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.2rem] overflow-hidden shadow-2xl group transition-all duration-500 hover:border-white/20">
                    <div className="h-44 bg-[#141414] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-white opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="absolute top-5 right-5 bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                            Activo
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">Vale de Consumo {currency}20</h3>
                            <div className="flex items-center gap-2 text-zinc-400 font-black tracking-tighter text-lg">
                                <Trophy size={16} className="text-zinc-500" /> 10
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-8 font-medium leading-relaxed">Vale de consumo para usar en cualquier producto de la tienda.</p>
                        <button className="w-full h-12 rounded-xl bg-[#1c1c1c] border border-white/5 text-white font-bold text-sm hover:bg-[#252525] transition-all">
                            Editar recompensas
                        </button>
                    </div>
                </div>

                {/* Demo Reward Card 2 */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.2rem] overflow-hidden shadow-2xl group transition-all duration-500 hover:border-white/20">
                    <div className="h-44 bg-[#141414] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-white opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Borrador
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white tracking-tight">Producto Gratis</h3>
                            <div className="flex items-center gap-2 text-zinc-400 font-black tracking-tighter text-lg">
                                <Trophy size={16} className="text-zinc-500" /> 15
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-8 font-medium leading-relaxed">Cualquier producto de la carta hasta un valor de {currency} 25.00.</p>
                        <button className="w-full h-12 rounded-xl bg-[#1c1c1c] border border-white/5 text-white font-bold text-sm hover:bg-[#252525] transition-all">
                            Editar recompensas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
