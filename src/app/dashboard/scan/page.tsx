"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { QrCode, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScanPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)]">
                            Escanear QR
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Escanea el código QR de tus clientes para otorgar stamps
                        </p>
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-12 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="inline-flex p-6 bg-primary/20 rounded-full">
                            <Camera className="h-16 w-16 text-primary" />
                        </div>

                        <h2 className="text-2xl font-bold">Escáner QR</h2>
                        <p className="text-white/60">
                            Usa tu cámara para escanear el código QR de la tarjeta de lealtad de tus clientes.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 aspect-square flex items-center justify-center">
                            <QrCode className="h-32 w-32 text-white/20" />
                        </div>

                        <Button size="lg" className="w-full">
                            <Camera className="mr-2 h-5 w-5" />
                            Activar Cámara
                        </Button>

                        <p className="text-xs text-white/40">
                            Próximamente: Escáner QR funcional con cámara
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
