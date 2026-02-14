"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { QrCode, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-muted-foreground/40 font-sans uppercase tracking-wider text-sm">Escáner de Tarjetas</h2>
            </div>

            <div className="bg-zinc-900/40 rounded-[3rem] p-12 border border-white/5 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                <div className="max-w-md mx-auto space-y-8 relative z-10">
                    <div className="inline-flex p-8 bg-[#1c1c1c] rounded-full border border-white/5 shadow-xl">
                        <Camera className="h-12 w-12 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tighter text-white">Escáner QR</h2>
                        <p className="text-zinc-500 font-medium">
                            Usa tu cámara para escanear el código QR de la tarjeta de lealtad de tus clientes.
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 aspect-square flex items-center justify-center shadow-inner relative group">
                        <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] animate-pulse pointer-events-none"></div>
                        <QrCode className="h-40 w-40 text-zinc-800 transition-all group-hover:text-zinc-700" />

                        {/* Premium Corners for QR Frame */}
                        <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
                        <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
                        <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
                        <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
                    </div>

                    <button
                        className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-2xl shadow-white/5 flex items-center justify-center gap-3"
                    >
                        <Camera className="h-5 w-5" />
                        Activar Cámara
                    </button>

                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                        Optimizado para iOS y Android
                    </p>
                </div>
            </div>
        </div>
    )
}
