import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Ticket, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
    {
        title: "Clientes Totales",
        value: "1,240",
        change: "+12%",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Sellos Emitidos",
        value: "8,500",
        change: "+25%",
        icon: Star,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20"
    },
    {
        title: "Premios Canjeados",
        value: "432",
        change: "+8%",
        icon: Ticket,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        title: "Retención",
        value: "85%",
        change: "+2%",
        icon: TrendingUp,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="border-border/60 bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-xl transition-colors", stat.bg)}>
                                <Icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-sora)]">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stat.change}</span>
                                <span className="opacity-60">vs mes pasado</span>
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
