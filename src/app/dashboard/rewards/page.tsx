"use client"

import { Button } from "@/components/ui/button"
import { Gift, Plus, Trophy } from "lucide-react"

export default function RewardsPage() {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-sans">Premios y Recompensas</h1>
                    <p className="text-muted-foreground">Configura el catálogo de premios canjeables por Stamps.</p>
                </div>
                <Button size="sm" className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold">
                    <Plus size={16} className="mr-2" /> Nuevo Premio
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Demo Reward Card 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-card group hover:border-emerald-500/50 transition-all">
                    <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-black relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-emerald-500 opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-emerald-400">
                            Activo
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">Vale de Consumo S/20</h3>
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                <Trophy size={14} /> 10 Stamps
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 font-sans">Vale de consumo para usar en cualquier producto de la tienda.</p>
                        <Button variant="outline" className="w-full border-border/60 hover:bg-secondary/80">Editar</Button>
                    </div>
                </div>

                {/* Demo Reward Card 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-card group hover:border-blue-500/50 transition-all">
                    <div className="h-48 bg-gradient-to-br from-blue-500/20 to-black relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Gift size={64} className="text-blue-500 opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-blue-400">
                            Borrador
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">Producto Gratis</h3>
                            <div className="flex items-center gap-1 text-blue-500 font-mono font-bold">
                                <Trophy size={14} /> 15 Stamps
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 font-sans">Cualquier producto de la carta hasta un valor de S/ 25.00.</p>
                        <Button variant="outline" className="w-full border-border/60 hover:bg-secondary/80">Editar</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
