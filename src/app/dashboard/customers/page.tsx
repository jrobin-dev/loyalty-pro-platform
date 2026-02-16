"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { CustomerTableAdvanced } from "@/components/dashboard/customer-table-advanced"
import { Button } from "@/components/ui/button"
import { Download, Plus, Filter, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AddCustomerDialog } from "@/components/dashboard/add-customer-dialog"
import { useCustomers } from "@/hooks/use-customers"
import { toast } from "sonner"


export default function CustomersPage() {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const { customers, loading, refresh, tenantSlug } = useCustomers()

    const handleExportCSV = () => {
        if (customers.length === 0) {
            toast.error("No hay datos para exportar")
            return
        }

        const headers = ["Nombre", "Email", "Teléfono", "Stamps", "Visitas", "Estado", "Última Visita"]
        const rows = customers.map(c => [
            c.name, c.email, c.phone, c.stamps, c.visits, c.status, c.last_visit
        ])

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `clientes_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Archivo CSV descargado")
    }

    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refresh()
        setTimeout(() => setIsRefreshing(false), 500) // Visual delay
        toast.success("Datos actualizados")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-xl font-bold text-muted-foreground/40 font-sans uppercase tracking-wider text-sm">Gestión de Base de Datos</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        size="sm"
                        className={cn(
                            "bg-white/5 border-white/10 text-white hover:bg-white/10 flex-1 sm:flex-none",
                            showFilters && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        )}
                    >
                        <Filter size={14} className="mr-2" /> Filtros
                    </Button>
                    <Button onClick={handleExportCSV} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 flex-1 sm:flex-none">
                        <Download size={14} className="mr-2" /> Exportar
                    </Button>
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 flex-1 sm:flex-none"
                    >
                        <RefreshCw size={14} className={cn("mr-2", isRefreshing && "animate-spin")} />
                        {isRefreshing ? "Refrescando" : "Refrescar"}
                    </Button>
                    <Button onClick={() => setIsAddCustomerOpen(true)} size="sm" className="btn-cosmic flex-1 sm:flex-none whitespace-nowrap">
                        <Plus size={16} className="mr-2" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            <CustomerTableAdvanced
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                customers={customers}
                loading={loading}
                refresh={refresh}
                tenantSlug={tenantSlug}
            />

            <AddCustomerDialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
                onSuccess={refresh}
            />
        </div>
    )
}
