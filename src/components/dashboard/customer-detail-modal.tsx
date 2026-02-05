"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { Award, Calendar, Gift } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CustomerDetailModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CustomerDetailModal({ customer, open, onOpenChange }: CustomerDetailModalProps) {
    if (!customer) return null

    // Calculate progress percentage
    const progressPercentage = (customer.stamps / 10) * 100 // Assuming 10 stamps for reward
    const rewardsEarned = customer.rewards || 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0a0a0a] border-transparent max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Award className="h-6 w-6 text-purple-400" />
                        Detalle del Cliente
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                        <h3 className="text-lg font-bold text-white mb-2">{customer.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="text-white">{customer.email || 'No registrado'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Teléfono</p>
                                <p className="text-white">{customer.phone || 'No registrado'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Última visita</p>
                                <p className="text-white flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {customer.last_visit
                                        ? format(new Date(customer.last_visit), "d 'de' MMMM, yyyy", { locale: es })
                                        : 'Nunca'
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total visitas</p>
                                <p className="text-white">{customer.visits} visitas</p>
                            </div>
                        </div>
                    </div>

                    {/* Loyalty Progress */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-white">Progreso de Lealtad</h4>
                            <span className="text-sm text-purple-400">{customer.stamps}/10 sellos</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        {/* Stamps Grid */}
                        <div className="grid grid-cols-10 gap-2">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center ${index < customer.stamps
                                            ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                                            : 'bg-white/10'
                                        }`}
                                >
                                    {index < customer.stamps ? (
                                        <Award className="h-4 w-4 text-white" />
                                    ) : (
                                        <div className="h-4 w-4 border-2 border-dashed border-white/30 rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card/50 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="h-5 w-5 text-yellow-400" />
                                <p className="text-sm text-muted-foreground">Premios Canjeados</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{rewardsEarned}</p>
                        </div>
                        <div className="bg-card/50 rounded-lg p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="h-5 w-5 text-emerald-400" />
                                <p className="text-sm text-muted-foreground">Estado</p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-400">
                                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
