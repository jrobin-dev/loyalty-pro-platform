"use client"

import { Button } from "@/components/ui/button"
import { QrCode, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function QRPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard" className="text-primary hover:underline text-sm">
                        ← Volver al Dashboard
                    </Link>
                </div>

                <div className="text-center space-y-6">
                    <div className="inline-flex p-4 bg-primary/20 rounded-full">
                        <QrCode className="h-12 w-12 text-primary" />
                    </div>

                    <h1 className="text-4xl font-bold">Código QR</h1>
                    <p className="text-white/60 max-w-md mx-auto">
                        Genera y comparte tu código QR para que tus clientes puedan acceder a su tarjeta de lealtad.
                    </p>

                    <div className="glass-card rounded-3xl p-12 max-w-md mx-auto">
                        <div className="bg-white p-8 rounded-xl">
                            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">QR Code Placeholder</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button className="w-full" size="lg">
                                <Download className="mr-2 h-5 w-5" />
                                Descargar QR
                            </Button>
                            <Button variant="outline" className="w-full" size="lg">
                                <Share2 className="mr-2 h-5 w-5" />
                                Compartir
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-white/40">
                        Próximamente: Generación automática de QR personalizado
                    </p>
                </div>
            </div>
        </div>
    )
}
