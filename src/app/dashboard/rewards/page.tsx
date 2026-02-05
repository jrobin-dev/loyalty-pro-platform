"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Plus, Trophy } from "lucide-react"

export default function RewardsPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-sans">Premios y Recompensas</h1>
                    <p className="text-white/60">Configura el catálogo de premios canjeables por Stamps.</p>
                </div>
                <Button size="sm" className="bg-[#00FF94] text-black hover:bg-[#00cc76] font-bold">
                    <Plus size={16} className="mr-2" /> Nuevo Premio
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Demo Reward Card 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-card group hover:border-[#00FF94]/50 transition-all">
                    <div className="h-48 bg-gradient-to-br from-[#00FF94]/20 to-black relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-[#00FF94] opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-[#00FF94]">
                            Activo
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="tex-lg font-bold">Vale de Consumo S/20</h3>
                            <div className="flex items-center gap-1 text-[#00C2FF] font-mono font-bold">
                                <Trophy size={14} /> 10 Stamps
                            </div>
                        </div>
                        <p className="text-sm text-white/60 mb-4">Vale de consumo para usar en cualquier producto de la tienda.</p>
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Editar</Button>
                    </div>
                </div>

                {/* Demo Reward Card 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-card group hover:border-[#00FF94]/50 transition-all">
                    <div className="h-48 bg-gradient-to-br from-[#00C2FF]/20 to-black relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-[#00C2FF] opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="tex-lg font-bold">Producto Gratis</h3>
                            <div className="flex items-center gap-1 text-[#00C2FF] font-mono font-bold">
                                <Trophy size={14} /> 15 Stamps
                            </div>
                        </div>
                        <p className="text-sm text-white/60 mb-4">Cualquier producto de la carta hasta un valor de S/ 25.00.</p>
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">Editar</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
