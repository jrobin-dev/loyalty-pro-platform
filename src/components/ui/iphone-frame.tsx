import React from 'react'
import { Wifi, Signal, BatteryFull } from 'lucide-react'

interface IphoneFrameProps {
    children: React.ReactNode
    className?: string
}

export const IphoneFrame = ({ children, className = "" }: IphoneFrameProps) => {
    return (
        <div className={`relative w-[340px] h-[680px] bg-zinc-100 dark:bg-black rounded-[55px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border-[8px] border-zinc-200 dark:border-[#1a1a1a] ring-1 ring-black/5 dark:ring-white/10 ${className}`}>

            {/* Dynamic Island Area */}
            <div className="absolute top-0 w-full h-10 flex items-center justify-between px-6 text-black dark:text-white text-[10px] z-50 pointer-events-none">
                <span className="font-semibold">9:41</span>

                {/* Dynamic Island */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[80px] h-[22px] bg-black rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-10 h-1 bg-zinc-800/30 rounded-full" />
                </div>

                <div className="flex gap-1.5 items-center opacity-80 scale-90">
                    <Signal size={12} fill="currentColor" />
                    <Wifi size={12} />
                    <BatteryFull size={14} />
                </div>
            </div>

            {/* Screen Content */}
            <div className="h-full w-full bg-white dark:bg-[#0a0a0a] pt-12 pb-4 overflow-hidden">
                {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-50" />

            {/* Side Buttons */}
            <div className="absolute left-[-8px] top-24 w-[2px] h-10 bg-zinc-400 dark:bg-zinc-800 rounded-l-md" />
            <div className="absolute left-[-8px] top-36 w-[2px] h-14 bg-zinc-400 dark:bg-zinc-800 rounded-l-md" />
            <div className="absolute left-[-8px] top-52 w-[2px] h-14 bg-zinc-400 dark:bg-zinc-800 rounded-l-md" />
            <div className="absolute right-[-8px] top-32 w-[2px] h-20 bg-zinc-400 dark:bg-zinc-800 rounded-r-md" />

            {/* Reflection Effect */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-20" />
        </div>
    )
}
