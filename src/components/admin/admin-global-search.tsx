"use client"

import { useState, useEffect, useRef } from "react"
import { Search, LayoutDashboard, Store, Users, Settings, ChevronRight, X, BookOpen, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { globalAdminSearch, AdminSearchResult } from "@/app/actions/admin-search"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResult extends AdminSearchResult {
    category: string
    icon: any
}

const STATIC_NAVIGATION: SearchResult[] = [
    { id: "nav-1", title: "Vista General", subtitle: "Métricas globales", category: "Navegación", url: "/admin", icon: LayoutDashboard, type: "tenant" }, // type ignored for static
    { id: "nav-2", title: "Negocios", subtitle: "Gestionar empresas", category: "Navegación", url: "/admin/tenants", icon: Store, type: "tenant" },
    { id: "nav-3", title: "Usuarios Globales", subtitle: "Gestionar usuarios del sistema", category: "Navegación", url: "/admin/users", icon: Users, type: "user" },
    { id: "nav-4", title: "Configuración", subtitle: "Ajustes de Super Admin", category: "Navegación", url: "/admin/settings", icon: Settings, type: "tenant" },
]

export function AdminGlobalSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 0) {
                setIsLoading(true)
                try {
                    const searchLower = query.toLowerCase()

                    // 1. Static Navigation
                    const navResults = STATIC_NAVIGATION.filter(item =>
                        item.title.toLowerCase().includes(searchLower) ||
                        item.subtitle.toLowerCase().includes(searchLower)
                    )

                    // 2. Server Search
                    const serverData = await globalAdminSearch(query)

                    const serverResults: SearchResult[] = serverData.map(item => ({
                        ...item,
                        category: item.type === 'tenant' ? 'Negocio' : item.type === 'user' ? 'Usuario' : item.type === 'course' ? 'Curso' : 'Lección',
                        icon: item.type === 'tenant' ? Store : item.type === 'user' ? Users : item.type === 'course' ? BookOpen : FileText
                    }))

                    setResults([...navResults, ...serverResults])
                    setIsOpen(true)
                } catch (error) {
                    console.error(error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (url: string) => {
        router.push(url)
        setIsOpen(false)
        setQuery("")
    }

    const hasResults = isOpen && results.length > 0;
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    return (
        <div className="w-full max-w-2xl mx-auto" ref={containerRef}>
            {/* DESKTOP VIEW */}
            <div className="hidden lg:block relative z-50">
                <div className={cn(
                    "flex items-center gap-3 h-11 px-4 transition-all duration-200",
                    "bg-[#0F0F10] border border-[#27272A]",
                    "focus-within:bg-[#18181B] focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20",
                    hasResults ? "rounded-t-2xl rounded-b-none border-b-transparent border-indigo-500/30 bg-[#18181B]" : "rounded-full hover:border-zinc-700"
                )}>
                    <Search className={cn("w-4 h-4 text-zinc-500", isLoading && "animate-pulse text-indigo-500")} />
                    <input
                        type="text"
                        placeholder="Buscar en Admin (Negocios, Usuarios, Cursos...)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 0 && setIsOpen(true)}
                        className="bg-transparent border-none outline-none text-sm text-zinc-100 w-full placeholder:text-zinc-600 h-full"
                    />
                    {isLoading && <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />}
                </div>

                {/* Results */}
                {hasResults && (
                    <div className="absolute top-full left-0 w-full bg-[#18181B] border border-indigo-500/30 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden -mt-[1px]">
                        <div className="h-px w-[95%] mx-auto bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                            {results.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result.url)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-500/10 group transition-all text-left border border-transparent hover:border-indigo-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        {result.type === 'tenant' && result.avatarUrl ? (
                                            <Avatar className="w-10 h-10 border border-border/50">
                                                <AvatarImage src={result.avatarUrl} alt={result.title} className="object-cover" />
                                                <AvatarFallback className="bg-zinc-900 text-zinc-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-500 transition-colors">
                                                    {result.title.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                "bg-zinc-900 text-zinc-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-500"
                                            )}>
                                                <result.icon size={18} />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors">{result.title}</span>
                                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 max-w-[300px] truncate">{result.subtitle}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border",
                                            "bg-zinc-900 border-zinc-800 text-zinc-500",
                                            "group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-500"
                                        )}>
                                            {result.category}
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden flex justify-end">
                <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all"
                >
                    <Search className="w-5 h-5" />
                </button>

                <AnimatePresence>
                    {isMobileSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[80px] left-0 right-0 z-[60] px-4"
                        >
                            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full">
                                <div className="flex items-center gap-3 h-14 px-4 border-b border-white/5">
                                    <Search className="w-5 h-5 text-indigo-500" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar en Admin..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => query.length > 0 && setIsOpen(true)}
                                        className="flex-1 bg-transparent border-none outline-none text-base text-zinc-100 placeholder:text-zinc-600 h-full"
                                    />
                                    <button
                                        onClick={() => setIsMobileSearchOpen(false)}
                                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                {hasResults && (
                                    <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
                                        {results.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => { handleSelect(result.url); setIsMobileSearchOpen(false); }}
                                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-500/10 group transition-all text-left border border-transparent hover:border-indigo-500/20"
                                            >
                                                <div className="flex-1 text-sm text-zinc-200">{result.title}</div>
                                                <ChevronRight size={14} className="text-zinc-500" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {isMobileSearchOpen && (
                    <div
                        className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm h-[calc(100vh-80px)]"
                        style={{ top: '80px' }}
                        onClick={() => setIsMobileSearchOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}
