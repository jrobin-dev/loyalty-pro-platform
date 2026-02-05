"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { CustomerTableAdvanced } from "@/components/dashboard/customer-table-advanced"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import { useState } from "react"
import { AddCustomerDialog } from "@/components/dashboard/add-customer-dialog"
import { useCustomers } from "@/hooks/use-customers"
import { toast } from "sonner"


export default function CustomersPage() {
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
    const { customers, refresh } = useCustomers()

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

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-sans">Clientes</h1>
                    <p className="text-white/60">Gestiona y analiza tu base de datos de usuarios fidelizados.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleExportCSV} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Download size={14} className="mr-2" /> Exportar
                    </Button>
                    <Button onClick={() => setIsAddCustomerOpen(true)} size="sm" className="btn-cosmic">
                        <Plus size={16} className="mr-2" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            <CustomerTableAdvanced />

            <AddCustomerDialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
                onSuccess={refresh}
            />
        </DashboardLayout>
    )
}
