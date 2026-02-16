
"use client"

import { useLanguage } from "@/contexts/language-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// FlagES: Custom 1:1 Square SVG constructed with correct 1:2:1 stripe ratio
const FlagES = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={cn("absolute inset-0 h-full w-full object-cover", className)}>
        {/* Top Red Band (25%) */}
        <rect width="100" height="25" y="0" fill="#AA151B" />
        {/* Middle Yellow Band (50%) */}
        <rect width="100" height="50" y="25" fill="#F1BF00" />
        {/* Bottom Red Band (25%) */}
        <rect width="100" height="25" y="75" fill="#AA151B" />
    </svg>
)

// FlagUS: Standard US Flag with slice
const FlagUS = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 h-full w-full object-cover", className)}>
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640" />
        <path fill="#192f5d" d="M0 0h296v258H0z" />
        <path fill="#fff" d="M54 27h18m38 126h18m38 126h18m-56-82h18m38 126h18m-56-252h18m38 126h18m-56-170h18m38 126h18m-56-84h18m38 126h18m-56-252h18m38 126h18m-56-170h18m38 126h18m-56-84h18m38 126h18m-56-252h18m38 126h18m-56-170h18m38 126h18m-56-84h18m38 126h18m0-168h18m-94 42h18m-54 42h18m-54 42h18m-54 42h18m-54-168h18m54 42h18m54 42h18m54 42h18m54-168h18m-94 42h18m-54 42h18m-54 42h18m-54 42h18" />
    </svg>
)

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group h-10 gap-3 px-3 rounded-xl hover:bg-white/5 data-[state=open]:bg-white/5 border border-transparent hover:border-white/10 transition-all font-medium text-zinc-400 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none"
                >
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 group-hover:ring-white/30 transition-all shadow-sm bg-zinc-800">
                        {language === 'es' ? <FlagES className="scale-125" /> : <FlagUS className="scale-125" />}
                        {/* Slight inner shadow for depth */}
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_2px_rgba(0,0,0,0.3)] pointer-events-none z-10 transition-shadow group-hover:shadow-[inset_0_0_4px_rgba(0,0,0,0.4)]"></div>
                    </div>

                    <span className="hidden sm:inline-block text-sm">
                        {language === 'es' ? 'Español' : 'English'}
                    </span>

                    <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} className="w-[150px] bg-[#0F0F10] border-white/10 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
                <DropdownMenuItem
                    onClick={() => setLanguage('es')}
                    className="flex items-center justify-between px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer rounded-lg mb-1 group"
                >
                    <span className="flex items-center gap-3">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 shadow-sm bg-zinc-800 flex items-center justify-center">
                            <FlagES className="scale-150 object-center" />
                            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_2px_rgba(0,0,0,0.3)] pointer-events-none z-10"></div>
                        </div>
                        <span className={cn("text-sm font-medium leading-none transition-colors", language === 'es' ? "text-white" : "text-zinc-400 group-hover:text-white")}>
                            Español
                        </span>
                    </span>
                    {language === 'es' && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className="flex items-center justify-between px-3 py-2.5 focus:bg-white/5 focus:text-white cursor-pointer rounded-lg group"
                >
                    <span className="flex items-center gap-3">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 shadow-sm bg-zinc-800 flex items-center justify-center">
                            <FlagUS className="scale-150 object-center" />
                            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_2px_rgba(0,0,0,0.3)] pointer-events-none z-10"></div>
                        </div>
                        <span className={cn("text-sm font-medium leading-none transition-colors", language === 'en' ? "text-white" : "text-zinc-400 group-hover:text-white")}>
                            English
                        </span>
                    </span>
                    {language === 'en' && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
