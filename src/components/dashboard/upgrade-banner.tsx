"use client"

import { Zap, X, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function UpgradeProBanner() {
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { delay: 0.3, duration: 0.4, ease: "easeOut" }
            }}
            exit={{
                opacity: 0,
                transition: { duration: 0.05, ease: "easeOut" }
            }}
            onClick={() => router.push("/dashboard/plans")}
            className="relative group overflow-hidden rounded-2xl bg-emerald-50/80 dark:bg-[#0a0a0a]/60 backdrop-blur-md border border-emerald-500/10 dark:border-white/5 p-4 shadow-xl dark:shadow-2xl w-full cursor-pointer hover:border-emerald-500/20 transition-all duration-300"
        >
            {/* Bevel Effect - Top and Left highlights */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-t border-l border-white/20 dark:border-white/10 z-20" />

            {/* Rotating Border Beam Effect */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,lab(85_-28.78_13.88)_360deg)] opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                            <Zap size={16} className="text-emerald-500 fill-emerald-500" />
                        </div>
                        <span className="font-semibold text-sm text-foreground dark:text-white tracking-tight">Mejora a Pro</span>
                    </div>
                </div>

                <p className="text-[11px] text-muted-foreground dark:text-zinc-400 leading-relaxed font-medium">
                    Eleva tu experiencia y desbloquea funciones exclusivas.
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        className="h-8 px-3 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 cursor-pointer shadow-none rounded-lg"
                    >
                        <Zap size={10} className="mr-1 fill-emerald-500" />
                        Ver planes
                    </Button>
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground dark:text-zinc-500 dark:hover:text-white transition-colors px-1 cursor-pointer">
                        Saber más
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
