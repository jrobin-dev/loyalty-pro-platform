"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function DashboardHero() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-purple-800/40 border border-white/10 p-8 md:p-12">
            {/* Background Image/Pattern */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-display">
                    Bienvenido de Nuevo 👋
                </h1>
                <p className="text-white/70 text-base md:text-lg mb-6 leading-relaxed">
                    Tu programa de lealtad está funcionando perfectamente. Los clientes están acumulando stamps y canjeando recompensas. Sigue monitoreando el rendimiento en tiempo real.
                </p>
                <Button className="btn-cosmic group">
                    Ver Análisis Completo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
    )
}
