"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { Award, Calendar, Gift } from "lucide-react"

interface CustomerDetailModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

// Mock consumption data - replace with real data from Supabase
const getMockConsumptions = (customerId: string) => [
    { id: 1, amount: 150, date: "2026-02-01", time: "12:45 a.m." },
    { id: 2, amount: 98, date: "2026-02-03", time: "3:20 p.m." },
    { id: 3, amount: 224, date: "2026-02-05", time: "7:15 p.m." },
]

export function CustomerDetailModal({ customer, open, onOpenChange }: CustomerDetailModalProps) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null)

    if (!customer) return null

    const consumptions = getMockConsumptions(customer.id)
    const totalConsumption = consumptions.reduce((sum, c) => sum + c.amount, 0)
    const maxAmount = Math.max(...consumptions.map(c => c.amount))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-transparent">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{customer.name}</DialogTitle>
                </DialogHeader>

                {/* Total Consumption */}
                <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Consumo total</p>
                    <p className="text-3xl font-bold text-emerald-400">S/. {totalConsumption.toFixed(2)}</p>
                </div>

                {/* Instructions */}
                <p className="text-sm text-muted-foreground mb-4">
                    Pasa el cursor o navega con tab sobre cada barra para ver el monto, fecha y hora del consumo.
                </p>

                {/* Bar Chart */}
                <div className="relative h-64 bg-card/30 rounded-lg p-6 mb-6">
                    <div className="flex items-end justify-around h-full gap-4">
                        {consumptions.map((consumption, index) => {
                            const heightPercentage = (consumption.amount / maxAmount) * 100
                            const isHovered = hoveredBar === index

                            return (
                                <div
                                    key={consumption.id}
                                    className="flex-1 relative flex flex-col items-center justify-end group"
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {/* Tooltip */}
                                    {isHovered && (
                                        <div className="absolute bottom-full mb-2 bg-[#0a0a0a] border border-emerald-500/30 rounded-lg p-3 shadow-xl z-10 min-w-[140px]">
                                            <p className="text-xs text-muted-foreground mb-1">MONTO</p>
                                            <p className="text-lg font-bold text-emerald-400 mb-2">S/. {consumption.amount.toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground mb-1">FECHA</p>
                                            <p className="text-sm text-white mb-2">{new Date(consumption.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-xs text-muted-foreground mb-1">HORA</p>
                                            <p className="text-sm text-white">{consumption.time}</p>
                                        </div>
                                    )}

                                    {/* Bar */}
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                                            isHovered 
                                                ? 'bg-gradient-to-t from-emerald-500 to-emerald-300 shadow-lg shadow-emerald-500/50' 
                                                : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                                        }`}
                                        style={{ height: `${heightPercentage}%` }}
                                    />
                                </div>
                            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
                                <p className="text-yellow-400 font-bold text-sm">
                                    🎉 ¡Tarjeta completa! Premio disponible
                                </p>
                            </div>
                            )
                        }
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
