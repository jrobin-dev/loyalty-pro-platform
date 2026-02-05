import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Ticket, Star, TrendingUp } from "lucide-react"

const stats = [
    {
        title: "Clientes Totales",
        value: "1,240",
        change: "+12%",
        icon: Users,
        color: "text-[#00C2FF]",
    },
    {
        title: "Sellos Emitidos",
        value: "8,500",
        change: "+25%",
        icon: Star,
        color: "text-[#00FF94]",
    },
    {
        title: "Premios Canjeados",
        value: "432",
        change: "+8%",
        icon: Ticket,
        color: "text-[#FF00E5]",
    },
    {
        title: "Retención",
        value: "85%",
        change: "+2%",
        icon: TrendingUp,
        color: "text-[#FFD600]",
    },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white/60">
                                {stat.title}
                            </CardTitle>
                            <Icon size={16} className={stat.color} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-white/40 mt-1">
                                <span className="text-[#00FF94] font-medium">{stat.change}</span> vs mes pasado
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
