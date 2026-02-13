"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function RevenuePage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-funnel-display)]">
                        Revenue Analytics
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Métricas financieras y suscripciones en tiempo real.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            MRR Total
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">$12,450.00</div>
                        <p className="text-xs text-emerald-400">+20.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Historial de Transacciones</CardTitle>
                    <CardDescription>
                        Detalle de pagos recibidos por Stripe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/50 gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Gráficos de ingresos en desarrollo...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
