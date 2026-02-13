"use client"

import { cn } from "@/lib/utils"

interface AcademyProgressBarProps {
    total: number
    completed: number
}

export function AcademyProgressBar({ total, completed }: AcademyProgressBarProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="space-y-2 group">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Progreso</span>
                <span className="text-[10px] font-black text-white/50">{percentage}% completado</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-1000 ease-out rounded-full relative"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_2s_linear_infinite]" />
                </div>
            </div>
            <style jsx>{`
                @keyframes progress-stripe {
                    from { background-position: 0 0; }
                    to { background-position: 40px 0; }
                }
            `}</style>
        </div>
    )
}
