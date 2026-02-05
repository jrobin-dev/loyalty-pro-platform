"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Award } from "lucide-react"

interface CustomerHistoryModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

// Mock history data - replace with real data from Supabase
const getMockHistory = (customerId: string) => [
    { id: 1, date: "2026-02-05", amount: 45.00, stamps: 1, type: "Consumo" },
    { id: 2, date: "2026-02-03", amount: 32.50, stamps: 1, type: "Consumo" },
    { id: 3, date: "2026-01-28", amount: 0, stamps: -10, type: "Premio Canjeado" },
    { id: 4, date: "2026-01-25", amount: 28.00, stamps: 1, type: "Consumo" },
    { id: 5, date: "2026-01-20", amount: 55.00, stamps: 1, type: "Consumo" },
]

export function CustomerHistoryModal({ customer, open, onOpenChange }: CustomerHistoryModalProps) {
    if (!customer) return null

    const history = getMockHistory(customer.id)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border-transparent">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Historial de Consumos</DialogTitle>
                    <p className="text-sm text-muted-foreground">{customer.name}</p>
                </DialogHeader>

                <div className="space-y-3">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 bg-card/50 rounded-lg border border-transparent hover:border-purple-500/20 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge
                                            className={
                                                item.type === "Premio Canjeado"
                                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            }
                                        >
                                            {item.type}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(item.date).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {item.amount > 0 && (
                                            <div className="flex items-center gap-1 text-white">
                                                <DollarSign size={14} />
                                                <span className="font-bold">S/. {item.amount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Award size={14} className={item.stamps > 0 ? "text-purple-400" : "text-yellow-400"} />
                                            <span className={`font-bold ${item.stamps > 0 ? "text-purple-400" : "text-yellow-400"}`}>
                                                {item.stamps > 0 ? `+${item.stamps}` : item.stamps} Stamp{Math.abs(item.stamps) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay historial de consumos aún.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
