"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, Award, Ticket, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

interface StatCardProps {
    title: string
    value: string
    change: string
    icon: any
    label: string
}

function StatCard({ title, value, change, icon: Icon, label }: StatCardProps) {
    return (
        <Card className="bg-card border-border relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-10 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />

            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{title}</p>
                    <div className="bg-secondary p-1.5 rounded-lg border border-border">
                        <Icon size={14} className="text-primary" />
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] text-foreground mb-1">
                            {value}
                        </div>
                        <p className="text-xs text-primary flex items-center gap-1 font-medium">
                            <TrendingUp size={10} />
                            {change} <span className="text-muted-foreground font-normal">vs mes anterior</span>
                        </p>
                    </div>
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
                    <div key={i} className="h-32 bg-card rounded-lg border border-border" />
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
                label="TOTAL"
            />
            <StatCard
                title="Total Usuarios"
                value={stats.totalCustomers.toLocaleString()}
                change={stats.customersChange}
                icon={Users}
                label="USUARIOS"
            />
            <StatCard
                title="Premios Canjeados"
                value={stats.totalRewards.toString()}
                change={stats.rewardsChange}
                icon={Award}
                label="PREMIOS"
            />
            <StatCard
                title="Total Stamps"
                value={stats.totalStamps.toLocaleString()}
                change={stats.stampsChange}
                icon={Ticket}
                label="ACUMULADO"
            />
        </div>
    )
}
