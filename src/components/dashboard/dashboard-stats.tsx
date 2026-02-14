"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Gift, Award } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { formatNumber } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string
    change: number
    icon: React.ElementType
    iconColor: string
    iconBg: string
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) {
    const isPositive = change >= 0
    const formattedChange = `${isPositive ? '+' : ''}${change}%`

    return (
        <Card className="relative overflow-hidden bg-white dark:bg-card/50 backdrop-blur-sm border-border/40 hover:bg-white dark:hover:bg-card/60 transition-all duration-300 shadow-md group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${iconBg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-sans tracking-tight text-foreground">{value}</div>
                <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                    {formattedChange}
                    <span className="text-muted-foreground/60 font-normal">vs mes anterior</span>
                </p>
            </CardContent>
        </Card>
    )
}

export function DashboardStatsAdvanced({ dateRange }: { dateRange?: { start: string; end: string } }) {
    const { stats, loading } = useDashboardStats({ dateRange })
    const { settings } = useTenantSettings()

    const currency = settings?.tenant.currency || '$'

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 bg-card/50 rounded-xl border border-transparent" />
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Ingreso Total"
                value={`${currency} ${formatNumber(stats.totalRevenue)}`}
                change={stats.revenueChange}
                icon={DollarSign}
                iconColor="text-orange-500"
                iconBg="bg-orange-500/10"
            />
            <StatCard
                title="Total Usuarios"
                value={stats.totalCustomers.toString()}
                change={stats.customersChange}
                icon={Users}
                iconColor="text-emerald-400"
                iconBg="bg-emerald-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            />
            <StatCard
                title="Premios Canjeados"
                value={stats.totalRewards.toString()}
                change={stats.rewardsChange}
                icon={Award}
                iconColor="text-yellow-500"
                iconBg="bg-yellow-500/10"
            />
            <StatCard
                title="Total Stamps"
                value={stats.totalStamps.toString()}
                change={stats.stampsChange}
                icon={Award}
                iconColor="text-primary"
                iconBg="bg-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            />
        </div>
    )
}
