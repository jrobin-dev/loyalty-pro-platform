"use client"

import { Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SuspendedScreen() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center z-50 fixed inset-0">
            <div className="bg-destructive/10 p-6 rounded-full mb-6">
                <Ban className="w-16 h-16 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Cuenta Suspendida</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Tu cuenta ha sido suspendida por la administración.
                Si crees que esto es un error, por favor contacta a soporte.
            </p>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button variant="outline">Cerrar Sesión</Button>
                </Link>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => window.location.href = "mailto:soporte@loyalty.app"}>
                    Contactar Soporte
                </Button>
            </div>
        </div>
    )
}
