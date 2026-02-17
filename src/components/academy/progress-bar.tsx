"use client"

import { cn } from "@/lib/utils"
import { CircleDashed } from "lucide-react"

interface AcademyProgressBarProps {
    total: number
    completed: number
    compact?: boolean
}

export function AcademyProgressBar({ total, completed, compact }: AcademyProgressBarProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    if (compact) {
        return (
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-full px-4 py-2 hover:bg-white/[0.05] transition-all">
                <div className="flex-shrink-0 relative">
                    <CircleDashed size={14} className="text-emerald-500 animate-[spin_8s_linear_infinite]" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="h-1 w-20 bg-white/[0.03] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                <span className="text-[10px] font-black text-white ml-1">{percentage}%</span>
            </div>
        )
    }

    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group transition-all hover:bg-zinc-900/60">
            <div className="flex-shrink-0 relative">
                <CircleDashed size={20} className="text-emerald-500 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">tu progreso</span>
                    <span className="text-[10px] font-black text-white">{percentage}%</span>
                </div>

                <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
