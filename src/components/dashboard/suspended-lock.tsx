"use client"

import { Ban, Lock, Rocket, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SuspendedLockProps {
    tenantName?: string
}

export function SuspendedLock({ tenantName }: SuspendedLockProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-x-0 bottom-0 top-[72px] md:top-[72px] z-[40] flex items-center justify-center p-6"
        >
            {/* Backdrop with extreme blur */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-xl transition-all duration-500" />

            {/* Content Card */}
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative max-w-lg w-full bg-[#121212]/80 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-destructive/20 rounded-full blur-[80px]" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px]" />

                <div className="relative flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shadow-inner">
                        <Lock className="w-10 h-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Negocio Suspendido</h2>
                        <p className="text-zinc-400 font-medium">
                            El acceso a <span className="text-white font-bold">{tenantName || "este negocio"}</span> ha sido restringido temporalmente.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 w-full text-left space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-amber-500/10 rounded-lg">
                                <Ban className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed italic">
                                Esto sucede generalmente cuando se excede el límite de negocios de tu plan o por una acción administrativa.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                        <Button
                            className="flex-1 h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2 group shadow-lg"
                            onClick={() => window.location.href = "mailto:soporte@loyalty.app"}
                        >
                            <MessageCircle className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            Contactar Soporte
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2 group"
                            onClick={() => {
                                // Redirect to billing instead of potentially failing constructor
                                window.location.href = "/dashboard/billing"
                            }}
                        >
                            <Rocket className="w-5 h-5 text-emerald-400 transition-transform group-hover:-translate-y-1" />
                            Mejorar Plan
                        </Button>
                    </div>

                    <p className="text-[11px] text-zinc-600 font-medium uppercase tracking-widest">
                        Puedes cambiar a otro negocio activo desde el perfil
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
