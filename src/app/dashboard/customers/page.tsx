"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { CustomerTableAdvanced } from "@/components/dashboard/customer-table-advanced"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default function CustomersPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-sans">Clientes</h1>
                    <p className="text-white/60">Gestiona y analiza tu base de datos de usuarios fidelizados.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Download size={14} className="mr-2" /> Exportar
                    </Button>
                    <Button size="sm" className="bg-[#00FF94] text-black hover:bg-[#00cc76] font-bold">
                        <Plus size={16} className="mr-2" /> Nuevo Cliente
                    </Button>
                </div>
            </div>

            {/* Reusing the advanced table component */}
            <CustomerTableAdvanced />
        </DashboardLayout>
    )
}
