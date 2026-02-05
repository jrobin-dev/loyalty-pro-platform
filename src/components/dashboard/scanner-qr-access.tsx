"use client"

import { QrCode, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ScannerQRAccess() {
    return (
        <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <QrCode size={120} />
            </div>

            <h3 className="font-bold text-foreground mb-2 text-lg relative z-10 flex items-center gap-2">
                <QrCode size={20} className="text-primary" />
                Escanear Cliente
            </h3>

            <p className="text-sm text-muted-foreground mb-4 relative z-10 max-w-[80%]">
                Usa la cámara para escanear el código QR y registrar visitas o canjear premios.
            </p>

            <div className="relative z-10">
                <Link href="/dashboard/scanner">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold group-hover:pl-4 transition-all">
                        Abrir Cámara <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
