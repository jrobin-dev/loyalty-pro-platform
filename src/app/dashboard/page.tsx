"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { RecentActivityTable } from "@/components/dashboard/recent-activity"
import { ScannerQRAccess } from "@/components/dashboard/scanner-qr-access"
import { DashboardStatsAdvanced } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { CustomerTableAdvanced } from "@/components/dashboard/customer-table-advanced"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ChevronDown } from "lucide-react"
import Link from "next/link"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { useState } from "react"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
    const [selectedMonth, setSelectedMonth] = useState("Enero 2026")

    const handleDownloadReport = () => {
        toast.success("Generando reporte...", {
            description: "Tu reporte se descargará en unos segundos."
        })
        // TODO: Implement actual PDF/Excel generation
    }

    const months = [
        "Enero 2026", "Febrero 2026", "Marzo 2026", "Abril 2026",
        "Mayo 2026", "Junio 2026", "Julio 2026", "Agosto 2026",
        "Septiembre 2026", "Octubre 2026", "Noviembre 2026", "Diciembre 2026"
    ]

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <section className="flex-1 space-y-6">
                    {/* Hero Banner */}
                    <DashboardHero />

                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-sans">Dashboard</h1>
                            <p className="text-muted-foreground">Monitorea en tiempo real el rendimiento de tu programa.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="bg-background border-border text-foreground hover:bg-secondary">
                                        <Calendar size={14} className="mr-2" />
                                        {selectedMonth}
                                        <ChevronDown size={14} className="ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {months.map((month) => (
                                        <DropdownMenuItem
                                            key={month}
                                            onClick={() => setSelectedMonth(month)}
                                            className={selectedMonth === month ? "bg-primary/10 text-primary" : ""}
                                        >
                                            {month}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={handleDownloadReport} className="btn-cosmic">
                                <Download size={14} className="mr-2" /> Descargar
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Stats */}
                    <DashboardStatsAdvanced />

                    {/* Dashboard Charts */}
                    <DashboardCharts />

                    {/* Recent Activity */}
                    <RecentActivityTable />

                    {/* Customer Table */}
                    <CustomerTableAdvanced />
                </section>

                {/* Side Content */}
                <section className="w-full lg:w-[350px] space-y-6">
                    {/* Small Side Stats (Stamps Summary) */}
                    <div className="col-span-1 space-y-4">
                        <div className="bg-card rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-foreground mb-4 text-base">Resumen de Stamps</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b-0">
                                    <span className="text-sm text-muted-foreground">Stamps Activos</span>
                                    <span className="font-mono font-bold font-[family-name:var(--font-sora)]">12</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b-0">
                                    <span className="text-sm text-muted-foreground">Por Canjear</span>
                                    <span className="font-mono font-bold font-[family-name:var(--font-sora)] text-blue-500">36</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b-0">
                                    <span className="text-sm text-muted-foreground">En Circulación</span>
                                    <span className="font-mono font-bold font-[family-name:var(--font-sora)] text-primary">12</span>
                                </div>
                            </div>
                        </div>

                        <ScannerQRAccess />
                    </div>

                    {/* Support Card */}
                    <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold font-sans mb-2">Soporte</h3>
                        <p className="text-sm text-foreground/60 mb-4">¿Tienes dudas sobre cómo configurar tu campaña?</p>
                        <button className="w-full py-3 rounded-xl border-0 bg-white/10 hover:bg-white/20 transition-colors">
                            Contactar Soporte
                        </button>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}
