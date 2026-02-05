import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { RecentActivityTable } from "@/components/dashboard/recent-activity"
import { ScannerQRAccess } from "@/components/dashboard/scanner-qr-access"
import { DashboardStatsAdvanced } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { CustomerTableAdvanced } from "@/components/dashboard/customer-table-advanced"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import Link from "next/link"
import { MarketingSlider } from "@/components/dashboard/marketing-slider"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"

export default function DashboardPage() {
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
                            <Button variant="outline" size="sm" className="bg-background border-border text-foreground hover:bg-secondary">
                                <Calendar size={14} className="mr-2" /> Enero 2026
                            </Button>
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
