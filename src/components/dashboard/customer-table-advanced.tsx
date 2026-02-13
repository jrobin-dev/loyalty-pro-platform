"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, MessageCircle, Gift, Plus, CheckCircle2, Loader2, Database, Eye, History, ExternalLink } from "lucide-react"
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
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCustomers, Customer } from "@/hooks/use-customers"
import { AddCustomerDialog } from "./add-customer-dialog"
import { createClient } from "@/lib/supabase/client"
import { CustomerDetailModal } from "./customer-detail-modal"
import { CustomerHistoryModal } from "./customer-history-modal"

interface CustomerTableProps {
    showFilters?: boolean
    setShowFilters?: (show: boolean) => void
}

export function CustomerTableAdvanced({ showFilters: externalShowFilters, setShowFilters: externalSetShowFilters }: CustomerTableProps) {
    const { customers, loading, refresh, tenantSlug } = useCustomers()
    const searchParams = useSearchParams()
    const highlightedId = searchParams.get('id')
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [amount, setAmount] = useState("")
    const [isAddConsumptionOpen, setIsAddConsumptionOpen] = useState(false)
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [historyModalOpen, setHistoryModalOpen] = useState(false)
    const [customerForDetail, setCustomerForDetail] = useState<Customer | null>(null)
    const [customerForHistory, setCustomerForHistory] = useState<Customer | null>(null)

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("")
    const [internalShowFilters, setInternalShowFilters] = useState(false)
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

    // Use external props if provided, otherwise fallback to internal state
    const showFilters = externalShowFilters ?? internalShowFilters
    const setShowFilters = externalSetShowFilters ?? setInternalShowFilters

    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchQuery.toLowerCase()
        const fullName = `${customer.name} ${customer.lastName || ''}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            (customer.phone && customer.phone.includes(searchLower))

        const matchesStatus = statusFilter === "all" ? true : customer.status === statusFilter

        return matchesSearch && matchesStatus
    })



    const handleAddConsumption = async () => {
        if (!selectedCustomer) return

        setIsProcessing(true)
        try {
            const supabase = createClient()

            // Get authenticated user
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                throw new Error('No hay sesión activa')
            }

            // Get user's tenant
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select('id')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                throw new Error('No se encontró el negocio asociado')
            }

            // Call API to add stamp transaction
            const response = await fetch('/api/stamps/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: selectedCustomer.id,
                    amount: parseFloat(amount),
                    tenantId: tenantData.id
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Error al registrar consumo')
            }

            toast.success(`Visita registrada para ${selectedCustomer.name}`, {
                description: `Se registró el consumo de S/. ${amount} y se añadió +1 Stamp.`
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
                <Loader2 size={32} className="animate-spin mb-4 text-emerald-500" />
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
                <div className="flex flex-1 items-center gap-3 max-w-md bg-card border border-border p-2 px-5 rounded-2xl focus-within:ring-1 ring-emerald-500/30 transition-all group shadow-sm">
                    <Search size={20} className="text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                        placeholder="Buscar por nombre, email o celular..."
                        className="border-0 bg-transparent h-8 p-0 px-2 placeholder:text-muted-foreground/40 focus-visible:ring-0 text-sm lg:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters Bar */}
            {showFilters && (
                <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                    <span className="text-xs text-muted-foreground font-medium pl-2">Estado:</span>
                    <Badge
                        variant={statusFilter === "all" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setStatusFilter("all")}
                    >
                        Todos
                    </Badge>
                    <Badge
                        variant={statusFilter === "active" ? "default" : "outline"}
                        className="cursor-pointer bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                        onClick={() => setStatusFilter("active")}
                    >
                        Activos
                    </Badge>
                    <Badge
                        variant={statusFilter === "inactive" ? "default" : "outline"}
                        className="cursor-pointer text-muted-foreground"
                        onClick={() => setStatusFilter("inactive")}
                    >
                        Inactivos
                    </Badge>
                </div>
            )
            }

            <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[1000px]">
                        <thead className="bg-muted text-[10px] uppercase text-muted-foreground font-black tracking-widest border-b border-border/60">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4 text-right">Visitas</th>
                                <th className="px-6 py-4 text-center">Stamps</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        {searchQuery ? "No se encontraron resultados para tu búsqueda." : "No hay clientes registrados."}
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className={cn(
                                            "group transition-all duration-500",
                                            highlightedId === customer.id
                                                ? "bg-emerald-500/10 border-y border-emerald-500/30"
                                                : "hover:bg-secondary/30"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border/40 shadow-sm">
                                                    <AvatarImage src={customer.avatarUrl} className="object-cover" />
                                                    <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold">
                                                        {customer.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                        {customer.name} {customer.lastName}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
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
                                        <td className="px-6 py-4 text-right font-mono font-medium text-foreground/90">
                                            {customer.visits}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
                                                {customer.stamps} Stamps
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${customer.status === 'active' ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400' : 'text-muted-foreground bg-muted'
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
                                                        className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md hover:bg-purple-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Eye size={14} />
                                                        Ver detalle
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCustomerForHistory(customer)
                                                            setHistoryModalOpen(true)
                                                        }}
                                                        className="px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <History size={14} />
                                                        Ver historial
                                                    </button>
                                                    {tenantSlug && (
                                                        <button
                                                            onClick={() => {
                                                                const url = `${window.location.origin}/c/${tenantSlug}?email=${encodeURIComponent(customer.email)}&auto=true`
                                                                window.open(url, '_blank')
                                                            }}
                                                            className="px-3 py-1.5 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-md hover:bg-orange-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                                                            title="Ver Tarjeta del Cliente"
                                                        >
                                                            <ExternalLink size={14} />
                                                            Ver Tarjeta
                                                        </button>
                                                    )}
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
                                                            className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Plus size={14} />
                                                            Agregar consumo
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-popover border-border/40 max-w-md shadow-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl font-display">Agregar Consumo</DialogTitle>
                                                            <DialogDescription className="text-emerald-600 dark:text-emerald-400 font-medium">
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
                                                                    className="bg-secondary/30 border-border h-11 text-lg font-bold text-foreground focus-visible:ring-emerald-500/20"
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
                                )))}
                        </tbody>
                    </table>

                    {customers.length === 0 && !loading && (
                        <div className="p-8 text-center text-muted-foreground">
                            No hay clientes registrados aún.
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
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
        </div >
    )
}
