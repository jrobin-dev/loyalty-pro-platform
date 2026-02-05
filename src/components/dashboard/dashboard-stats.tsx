"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Gift, Award } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

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
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-transparent hover:bg-card/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-sans mb-1">{value}</div>
                <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formattedChange} vs mes anterior
                </p>
            </CardContent>
        </Card>
    )
}

export function DashboardStatsAdvanced({ dateRange }: { dateRange?: { start: string; end: string } }) {
    const { stats, loading } = useDashboardStats({ dateRange })

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
                value={`S/. ${stats.totalRevenue.toLocaleString()}`}
                change={stats.revenueChange}
                icon={DollarSign}
                iconColor="text-orange-500"
                iconBg="bg-orange-500/10"
            />
            <StatCard
                title="Total Usuarios"
                value={stats.totalCustomers.toLocaleString()}
                change={stats.customersChange}
                icon={Users}
                iconColor="text-purple-500"
                iconBg="bg-purple-500/10"
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
                value={stats.totalStamps.toLocaleString()}
                change={stats.stampsChange}
                icon={Ticket}
                iconColor="text-blue-500"
                iconBg="bg-blue-500/10"
            />
        </div>
    )
}
