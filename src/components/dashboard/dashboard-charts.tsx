"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useTheme } from "next-themes"

const dataDays = [
    { name: "Lun", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Mar", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Mie", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Jue", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Vie", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Sab", total: Math.floor(Math.random() * 500) + 100 },
    { name: "Dom", total: Math.floor(Math.random() * 500) + 100 },
]

const dataWeeks = [
    { name: "Sem 1", total: 1200 },
    { name: "Sem 2", total: 1500 },
    { name: "Sem 3", total: 1100 },
    { name: "Sem 4", total: 2000 },
]

const dataMonths = [
    { name: "Ene", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Abr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border p-2 rounded-lg text-xs shadow-xl min-w-[120px]">
                <p className="font-bold text-popover-foreground mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <p className="text-muted-foreground">
                        Ventas: <span className="font-mono font-bold text-foreground">S/ {payload[0].value}</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export function DashboardCharts() {
    const [period, setPeriod] = useState("daily")
    const { theme } = useTheme()

    // Dynamic Chart Color based on logic or simpler css variable usage via CSS classes
    // Recharts needs hex, so we'll just stick to a CSS variable-like hex or simple logic
    // For simplicity in this step, we use the primary color directly
    const chartColor = theme === 'dark' ? '#00FF94' : '#00C070'

    return (
        <Card className="col-span-4 lg:col-span-3 bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold">Gráfica de Consumo</CardTitle>
                    <p className="text-xs text-muted-foreground">Visualiza la evolución del consumo por periodo.</p>
                </div>
                <Tabs defaultValue="daily" className="space-y-0" onValueChange={setPeriod}>
                    <TabsList className="bg-muted border border-border h-8 p-0.5">
                        <TabsTrigger value="daily" className="text-xs hover:text-foreground h-7 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Diario</TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs hover:text-foreground h-7 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Semanal</TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs hover:text-foreground h-7 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Mensual</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={300}>
                    {period === "daily" ? (
                        <BarChart data={dataDays} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <Tooltip cursor={{ fill: 'var(--muted)' }} content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <Bar
                                dataKey="total"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={period === 'weekly' ? dataWeeks : dataMonths} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip cursor={{ stroke: 'var(--border)' }} content={<CustomTooltip />} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
