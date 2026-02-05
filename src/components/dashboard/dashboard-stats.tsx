"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, Award, Ticket, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

interface StatCardProps {
    title: string
    value: string
    change: string
    icon: any
    iconColor: string
    iconBg: string
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) {
    return (
        <Card className="bg-card/50 backdrop-blur-sm border-transparent relative overflow-hidden group hover:border-purple-500/20 transition-all">
            <CardContent className="p-6">
                {/* Icon Badge */}
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={24} className={iconColor} />
                </div>

                {/* Stats */}
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
                    <div className="text-3xl font-bold text-white mb-2 font-display">
                        {value}
                    </div>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <TrendingUp size={12} />
                        {change} <span className="text-muted-foreground font-normal">vs mes anterior</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export function DashboardStatsAdvanced() {
    const { stats, loading } = useDashboardStats()

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
