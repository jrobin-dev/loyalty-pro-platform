"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, MessageCircle, Gift, Plus, CheckCircle2, Loader2, Database, Eye, History } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { useCustomers, Customer } from "@/hooks/use-customers"
import { AddCustomerDialog } from "./add-customer-dialog"
import { supabase } from "@/lib/supabase"
import { CustomerDetailModal } from "./customer-detail-modal"
import { CustomerHistoryModal } from "./customer-history-modal"

export function CustomerTableAdvanced() {
    const { customers, loading, refresh } = useCustomers()
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [amount, setAmount] = useState("")
    const [isAddConsumptionOpen, setIsAddConsumptionOpen] = useState(false)
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [customerForDetail, setCustomerForDetail] = useState<Customer | null>(null)
    const [customerForHistory, setCustomerForHistory] = useState<Customer | null>(null)

    const handleAddConsumption = async () => {
        if (!selectedCustomer) return

        setIsProcessing(true)
        try {
            // Update customer: increment stamps and visits, update last_visit
            const { error } = await supabase
                .from('customers')
                .update({
                    stamps: (selectedCustomer.stamps || 0) + 1,
                    visits: (selectedCustomer.visits || 0) + 1,
                    last_visit: new Date().toISOString()
                })
                .eq('id', selectedCustomer.id)

            if (error) throw error

            toast.success(`Visita registrada para ${selectedCustomer.name}`, {
                description: `Se registró el consumo de S/. ${amount || '0'} y se añadió +1 Stamp.`
            })

            setIsAddConsumptionOpen(false)
            setAmount("")
            refresh() // Refresh the customer list
        } catch (error: any) {
            console.error("Error adding consumption:", error)
            toast.error("Error al registrar consumo", {
                description: error.message || "Intenta nuevamente"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
                <Loader2 size={32} className="animate-spin mb-4 text-[#00FF94]" />
                <p>Cargando clientes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Data Source Indicator (Dev Only) */}
            {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                    <Database size={12} />
                    <span>Modo Demo: Configura Supabase para ver datos reales.</span>
                </div>
            )}

            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 max-w-sm bg-card border border-border p-1 pl-3 rounded-xl focus-within:ring-1 ring-primary/50 transition-all">
                    <Search size={16} className="text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, email o cel..."
                        className="border-0 bg-transparent h-8 p-0 placeholder:text-muted-foreground/50 focus-visible:ring-0"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex border-dashed border-border bg-transparent hover:bg-secondary">
                        <Filter size={14} className="mr-2" />
                        Filtros
                    </Button>
                    <Button variant="outline" size="sm" onClick={refresh} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        Refrescar
                    </Button>
                </div>
            </div>

            <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4 hidden md:table-cell">Contacto</th>
                            <th className="px-6 py-4 hidden sm:table-cell text-right">Visitas</th>
                            <th className="px-6 py-4 text-center">Stamps</th>
                            <th className="px-6 py-4 text-center hidden lg:table-cell">Status</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="group hover:bg-secondary/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border">
                                            {/* <AvatarImage src={customer.avatar} /> */}
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-[10px] font-bold text-white">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">{customer.name}</div>
                                            <div className="text-xs text-muted-foreground">{customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {customer.phone ? (
                                            <div className="flex items-center gap-1.5 font-mono text-xs">
                                                <MessageCircle size={12} className="text-primary" />
                                                {customer.phone}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground/50 italic text-xs">No registrado</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell text-right font-mono font-medium text-foreground/90">
                                    {customer.visits}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
                                        {customer.stamps} Stamps
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-center hidden lg:table-cell">
                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'active' ? 'text-[#00FF94] bg-[#00FF94]/10' : 'text-gray-400 bg-gray-400/10'
                                        }`}>
                                        {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setCustomerForDetail(customer)
                                                    setDetailModalOpen(true)
                                                }}
                                                className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                                            >
                                                <Eye size={14} />
                                                Ver detalle
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCustomerForHistory(customer)
                                                    setHistoryModalOpen(true)
                                                }}
                                                className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                                            >
                                                <History size={14} />
                                                Ver historial
                                            </button>
                                        </div>

                                        <Dialog open={isAddConsumptionOpen && selectedCustomer?.id === customer.id} onOpenChange={(open) => {
                                            setIsAddConsumptionOpen(open)
                                            if (!open) {
                                                setSelectedCustomer(null)
                                                setAmount("")
                                            }
                                        }}>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCustomer(customer)
                                                        setIsAddConsumptionOpen(true)
                                                    }}
                                                    className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                                                >
                                                    <Plus size={14} />
                                                    Agregar consumo
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-[#0a0a0a] border-transparent max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl">Agregar Consumo</DialogTitle>
                                                    <DialogDescription className="text-emerald-400">
                                                        Cliente: {customer.name}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount" className="text-sm text-muted-foreground">
                                                            Monto del consumo
                                                        </Label>
                                                        <Input
                                                            id="amount"
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                            className="bg-card/50 border-white/10 h-10"
                                                        />
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <button
                                                        onClick={handleAddConsumption}
                                                        disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                                                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/20 disabled:text-emerald-400/50 text-white rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Procesando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Validar consumo
                                                            </>
                                                        )}
                                                    </button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {customers.length === 0 && !loading && (
                    <div className="p-8 text-center text-muted-foreground">
                        No hay clientes registrados aún.
                    </div>
                )}
            </div>

            <div className="text-center">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">
                    Cargar más clientes
                </Button>
            </div>

            {/* Add Customer Dialog */}
            <AddCustomerDialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
                onSuccess={refresh}
            />

            {/* Customer Detail Modal */}
            <CustomerDetailModal
                customer={customerForDetail}
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
            />

            {/* Customer History Modal */}
            <CustomerHistoryModal
                customer={customerForHistory}
                open={historyModalOpen}
                onOpenChange={setHistoryModalOpen}
            />
        </div>
    )
}
