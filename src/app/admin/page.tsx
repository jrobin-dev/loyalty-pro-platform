import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, DollarSign, TrendingUp, Activity } from "lucide-react"
import { getAdminStats } from "@/app/actions/admin-stats"
import { getTenants } from "@/app/actions/admin-tenants"

export default async function AdminDashboardPage() {
    const statsResult = await getAdminStats()
    const stats = statsResult.success && statsResult.data ? statsResult.data : {
        totalTenants: 0,
        totalUsers: 0,
        activeRate: 0,
        mrr: 0
    }

    const metrics = [
        {
            title: "Total Tenants (Negocios)",
            value: stats.totalTenants.toString(),
            change: "+12%", // TODO: implementation for historical comparison
            trend: "up",
            icon: Store,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Ingresos Recurrentes (MRR)",
            value: `$${stats.mrr}`,
            change: "+8.5%",
            trend: "up",
            icon: DollarSign,
            color: "text-[#00FF94]",
            bg: "bg-[#00FF94]/10"
        },
        {
            title: "Usuarios Totales",
            value: stats.totalUsers >= 1000 ? `${(stats.totalUsers / 1000).toFixed(1)}k` : stats.totalUsers.toString(),
            change: "+24%",
            trend: "up",
            icon: Users,
            color: "text-[#FF00E5]",
            bg: "bg-[#FF00E5]/10"
        },
        {
            title: "Tasa de Actividad",
            value: `${stats.activeRate}%`,
            change: "+2%",
            trend: "up",
            icon: Activity,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
    ]

    // Fetch recent tenants
    const tenantsResult = await getTenants()
    const recentTenants = tenantsResult.success && tenantsResult.data
        ? tenantsResult.data.slice(0, 5).map(t => ({
            name: t.name,
            plan: t.plan,
            date: new Date(t.createdAt).toLocaleDateString(),
            // @ts-ignore
            status: t.status || "active"
        }))
        : []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-funnel-display)]">Dashboard Global</h2>
                    <p className="text-muted-foreground mt-1">Vista de pájaro de toda la plataforma SaaS.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, i) => (
                    <Card key={i} className="bg-card border-border hover:border-primary/20 transition-all cursor-default w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {metric.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${metric.bg}`}>
                                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">{metric.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="text-[#00FF94] flex items-center">
                                    <TrendingUp size={12} className="mr-1" />
                                    {metric.change}
                                </span>
                                vs mes anterior
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity & Revenue */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart Placeholder */}
                <Card className="col-span-4 bg-card border-border">
                    <CardHeader>
                        <CardTitle>Crecimiento de MRR</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                            <p className="text-muted-foreground text-sm">Gráfica de Revenue (Próximamente)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Tenants */}
                <Card className="col-span-3 bg-card border-border">
                    <CardHeader>
                        <CardTitle>Nuevos Negocios (Tenants)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentTenants.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No hay registros recientes</p>
                            ) : (
                                recentTenants.map((tenant, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:text-white group-hover:border-primary/50 transition-all">
                                                {tenant.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{tenant.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{tenant.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${tenant.plan === 'PRO' || tenant.plan === 'PLUS'
                                                ? 'bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/20'
                                                : 'bg-white/5 text-white/40'
                                                }`}>
                                                {tenant.plan}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
