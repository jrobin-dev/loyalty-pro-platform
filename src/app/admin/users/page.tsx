"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family-name:var(--font-funnel-display)]">
                        Usuarios Globales
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona todos los usuarios registrados en la plataforma.
                    </p>
                </div>
                <Button className="bg-[#00FF94] text-black hover:bg-[#00cc76] shadow-lg shadow-[#00FF94]/20 border-0">
                    <Users className="mr-2 h-4 w-4" /> Invitación Masiva
                </Button>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Directorio de Usuarios</CardTitle>
                    <CardDescription>
                        Esta funcionalidad estará disponible pronto.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/5 gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Listado de usuarios en desarrollo...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
