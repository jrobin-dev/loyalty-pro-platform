"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gift, Award } from "lucide-react"

interface CustomerDetailModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CustomerDetailModal({ customer, open, onOpenChange }: CustomerDetailModalProps) {
    if (!customer) return null

    const totalStamps = customer.stamps || 0
    const stampsNeeded = 10
    const completedCards = Math.floor(totalStamps / stampsNeeded)
    const currentStamps = totalStamps % stampsNeeded

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Tarjeta de Lealtad</DialogTitle>
                </DialogHeader>

                {/* Customer Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-white/5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                            {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-white">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <Badge className="mt-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                {customer.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-card/50 rounded-lg border border-transparent text-center">
                            <div className="text-2xl font-bold text-purple-400">{totalStamps}</div>
                            <div className="text-xs text-muted-foreground">Total Stamps</div>
                        </div>
                        <div className="p-3 bg-card/50 rounded-lg border border-transparent text-center">
                            <div className="text-2xl font-bold text-blue-400">{customer.visits}</div>
                            <div className="text-xs text-muted-foreground">Visitas</div>
                        </div>
                        <div className="p-3 bg-card/50 rounded-lg border border-transparent text-center">
                            <div className="text-2xl font-bold text-yellow-400">{completedCards}</div>
                            <div className="text-xs text-muted-foreground">Premios</div>
                        </div>
                    </div>

                    {/* Stamp Card Visualization */}
                    <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-xl border border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <Gift size={18} className="text-yellow-400" />
                                Tarjeta Actual
                            </h4>
                            <span className="text-sm text-muted-foreground">
                                {currentStamps}/{stampsNeeded} sellos
                            </span>
                        </div>

                        {/* Stamp Grid */}
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: stampsNeeded }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${i < currentStamps
                                            ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50'
                                            : 'bg-white/5 border border-white/10'
                                        }`}
                                >
                                    {i < currentStamps && (
                                        <Award size={20} className="text-white" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {currentStamps === stampsNeeded && (
                            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
                                <p className="text-yellow-400 font-bold text-sm">
                                    🎉 ¡Tarjeta completa! Premio disponible
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Last Visit */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        Última visita: {new Date(customer.last_visit).toLocaleDateString('es-ES')}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
