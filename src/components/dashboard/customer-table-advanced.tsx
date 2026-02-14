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
import { useTenantSettings } from "@/hooks/use-tenant-settings"

interface CustomerTableProps {
    showFilters?: boolean
    setShowFilters?: (show: boolean) => void
    customers?: Customer[]
    loading?: boolean
    refresh?: () => void
    tenantSlug?: string
}

export function CustomerTableAdvanced({
    showFilters: externalShowFilters,
    setShowFilters: externalSetShowFilters,
    customers: externalCustomers,
    loading: externalLoading,
    refresh: externalRefresh,
    tenantSlug: externalTenantSlug
}: CustomerTableProps) {
    const internalHook = useCustomers()

    // Use props if provided, otherwise fallback to internal hook (for backward compatibility if used elsewhere)
    const customers = externalCustomers ?? internalHook.customers
    const loading = externalLoading ?? internalHook.loading
    const refresh = externalRefresh ?? internalHook.refresh
    const tenantSlug = externalTenantSlug ?? internalHook.tenantSlug
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
    const { settings } = useTenantSettings()
    const currency = settings?.tenant.currency || 'S/'

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
                description: `Se registró el consumo de ${currency} ${amount} y se añadió +1 Stamp.`
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
                <div className="flex flex-1 items-center gap-3 max-w-md bg-[#1c1c1c] border border-white/5 p-2 px-5 rounded-[1.2rem] focus-within:ring-1 focus-within:ring-white/10 transition-all group shadow-2xl">
                    <Search size={20} className="text-zinc-500 group-focus-within:text-white transition-colors" />
                    <Input
                        placeholder="Buscar por nombre, email o celular..."
                        className="border-0 bg-transparent h-10 p-0 px-2 placeholder:text-zinc-700 focus-visible:ring-0 text-sm lg:text-base text-white font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters Bar */}
            {showFilters && (
                <div className="flex items-center gap-2 p-2 px-4 bg-[#1c1c1c] rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2 shadow-xl">
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest pl-2">Estado:</span>
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border",
                            statusFilter === "all"
                                ? "bg-emerald-500 text-black border-emerald-500"
                                : "bg-transparent text-zinc-500 border-white/5 hover:border-white/10"
                        )}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setStatusFilter("active")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border",
                            statusFilter === "active"
                                ? "bg-emerald-500 text-black border-emerald-500"
                                : "bg-transparent text-zinc-500 border-white/5 hover:border-white/10"
                        )}
                    >
                        Activos
                    </button>
                    <button
                        onClick={() => setStatusFilter("inactive")}
                        className={cn(
                            "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border",
                            statusFilter === "inactive"
                                ? "bg-emerald-500 text-black border-emerald-500"
                                : "bg-transparent text-zinc-500 border-white/5 hover:border-white/10"
                        )}
                    >
                        Inactivos
                    </button>
                </div>
            )}

            <div className="border border-white/5 rounded-[1.8rem] bg-zinc-900/20 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[1000px]">
                        <thead className="bg-[#141414] text-[10px] uppercase text-zinc-500 font-black tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-6 py-5">Cliente</th>
                                <th className="px-6 py-5">Contacto</th>
                                <th className="px-6 py-5 text-right">Visitas</th>
                                <th className="px-6 py-5 text-center">Stamps</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
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
                                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase">
                                                        {customer.name.charAt(0)}
                                                        {customer.lastName?.charAt(0) || ''}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                        {customer.name} {customer.lastName}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground font-medium">{customer.email}</div>
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
                                                        className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
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
                                                    <DialogContent className="sm:max-w-[480px] bg-[#0a0a0a] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl text-foreground">
                                                        <DialogHeader className="p-8 pb-2">
                                                            <DialogTitle className="text-3xl font-black tracking-tighter text-white">Agregar Consumo</DialogTitle>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Cliente</span>
                                                                <span className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">{customer.name} {customer.lastName}</span>
                                                            </div>
                                                        </DialogHeader>

                                                        <div className="px-8 py-6 space-y-6">
                                                            <div className="space-y-3">
                                                                <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                                                                    Monto del consumo
                                                                </Label>
                                                                <div className="relative">
                                                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 font-black">{currency}</span>
                                                                    <Input
                                                                        id="amount"
                                                                        type="number"
                                                                        placeholder="0.00"
                                                                        value={amount}
                                                                        onChange={(e) => setAmount(e.target.value)}
                                                                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-black pl-12 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 text-lg outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-8 pb-10">
                                                            <button
                                                                onClick={handleAddConsumption}
                                                                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                                                                className="w-full h-14 rounded-2xl bg-white text-black font-black text-base transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                                                            >
                                                                {isProcessing ? (
                                                                    <>
                                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                                        Procesando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle2 className="h-5 w-5" />
                                                                        Validar consumo
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
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
