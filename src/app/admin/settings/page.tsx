"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-funnel-display)]">
                        Configuración Global
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Ajustes del sistema, integraciones y seguridad.
                    </p>
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Preferencias del Sistema</CardTitle>
                    <CardDescription>
                        Configuraciones generales de la plataforma SaaS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                            <h3 className="font-medium text-white">Mantenimiento</h3>
                            <p className="text-sm text-muted-foreground">Poner la plataforma en modo mantenimiento</p>
                        </div>
                        <Button variant="outline" className="border-border">Activar</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                            <h3 className="font-medium text-white">Notificaciones Globales</h3>
                            <p className="text-sm text-muted-foreground">Enviar mensaje a todos los tenants</p>
                        </div>
                        <Button variant="outline" className="border-border">Configurar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
