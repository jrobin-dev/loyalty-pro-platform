"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, Settings, CreditCard, LayoutDashboard, Store, Users as UsersIcon, Megaphone, ChevronRight, BookOpen, GraduationCap, Video, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/hooks/use-customers"
import { getPublishedCourses } from "@/app/actions/academy"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
    id: string
    title: string
    description: string
    category: "Navegación" | "Panel" | "Usuarios" | "Colecciones" | "Academia" | "Lecciones"
    href: string
    icon: any
}

const STATIC_NAVIGATION: SearchResult[] = [
    { id: "1", title: "Resumen", description: "Vista general del dashboard", category: "Navegación", href: "/dashboard", icon: LayoutDashboard },
    { id: "2", title: "Clientes", description: "Gestionar base de datos", category: "Navegación", href: "/dashboard/customers", icon: UsersIcon },
    { id: "3", title: "Facturación", description: "Planes y pagos", category: "Navegación", href: "/dashboard/settings/billing", icon: CreditCard },
    { id: "4", title: "Configuración", description: "Ajustes de la cuenta", category: "Navegación", href: "/dashboard/settings", icon: Settings },
    { id: "acad-1", title: "Academia", description: "Aprenda sobre fidelización", category: "Academia", href: "/dashboard/academy", icon: GraduationCap },
]

export function GlobalSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [courses, setCourses] = useState<any[]>([])
    const { customers } = useCustomers()
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)

    // Fetch academy data once
    useEffect(() => {
        const fetchAcademy = async () => {
            const res = await getPublishedCourses()
            if (res.success && res.data) {
                setCourses(res.data)
            }
        }
        fetchAcademy()
    }, [])

    useEffect(() => {
        if (query.trim().length > 0) {
            const searchLower = query.toLowerCase()

            // 1. Filter static navigation
            const navResults = STATIC_NAVIGATION.filter(item =>
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower)
            )

            // 2. Filter Academy (Courses and Lessons)
            const academyResults: SearchResult[] = []
            courses.forEach(course => {
                // Match Course
                if (course.title.toLowerCase().includes(searchLower) || (course.description && course.description.toLowerCase().includes(searchLower))) {
                    academyResults.push({
                        id: `course-${course.id}`,
                        title: course.title,
                        description: `Curso - ${course._count?.lessons || 0} lecciones`,
                        category: "Academia",
                        href: `/dashboard/academy/${course.slug}`,
                        icon: BookOpen
                    })
                }

                // MOCK Logic for Lessons matching
                if (searchLower.includes("leccion") || searchLower.includes("clase")) {
                    academyResults.push({
                        id: `lesson-${course.id}`,
                        title: `Lecciones en ${course.title}`,
                        description: "Explorar contenido del curso",
                        category: "Lecciones",
                        href: `/dashboard/academy/${course.slug}`, // Redirects to course for now
                        icon: Video
                    })
                }
            })

            // 3. Filter real customers (scoped by tenant already via hook)
            const customerResults: SearchResult[] = customers
                .filter(c =>
                    c.name.toLowerCase().includes(searchLower) ||
                    (c.lastName && c.lastName.toLowerCase().includes(searchLower)) ||
                    c.email.toLowerCase().includes(searchLower)
                )
                .slice(0, 5) // Limit to top 5
                .map(c => ({
                    id: `c-${c.id}`,
                    title: `${c.name} ${c.lastName || ''}`,
                    description: `Cliente - ${c.email}`,
                    category: "Usuarios",
                    href: `/dashboard/customers?id=${c.id}`, // Deep link logic
                    icon: User
                }))

            setResults([...navResults, ...academyResults, ...customerResults])
            setIsOpen(true)
        } else {
            setResults([])
            setIsOpen(false)
        }
    }, [query, customers, courses])

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

    const handleSelect = (href: string) => {
        router.push(href)
        setIsOpen(false)
        setQuery("")
    }

    const hasResults = isOpen && results.length > 0;
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    // Reset search when closing mobile search
    useEffect(() => {
        if (!isMobileSearchOpen) {
            // Optional: clear query or keep it
        }
    }, [isMobileSearchOpen])

    return (
        <div className="w-full max-w-2xl mx-auto" ref={containerRef}>
            {/* DESKTOP VIEW (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:block relative z-50">
                <div className={cn(
                    "flex items-center gap-3 h-11 px-4 transition-all duration-200",
                    "bg-[#0F0F10] border border-[#27272A]",
                    "focus-within:bg-[#18181B] focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20",
                    hasResults ? "rounded-t-2xl rounded-b-none border-b-transparent border-emerald-500/30 bg-[#18181B]" : "rounded-full hover:border-zinc-700"
                )}>
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar clientes, cursos, ajustes..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 0 && setIsOpen(true)}
                        className="bg-transparent border-none outline-none text-sm text-zinc-100 w-full placeholder:text-zinc-600 h-full"
                    />
                </div>

                {/* Desktop Results */}
                {hasResults && (
                    <div className="absolute top-full left-0 w-full bg-[#18181B] border border-emerald-500/30 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden -mt-[1px]">
                        <div className="h-px w-[95%] mx-auto bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                            {results.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result.href)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-500/10 group transition-all text-left border border-transparent hover:border-emerald-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                            "bg-zinc-900 text-zinc-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-500"
                                        )}>
                                            <result.icon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors">{result.title}</span>
                                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 max-w-[200px] truncate">{result.description}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border",
                                            "bg-zinc-900 border-zinc-800 text-zinc-500",
                                            "group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-500"
                                        )}>
                                            {result.category}
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MOBILE/TABLET VIEW (Visible Only on Mobile/Tablet) */}
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
                                    <Search className="w-5 h-5 text-emerald-500" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Buscar..."
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
                                                onClick={() => { handleSelect(result.href); setIsMobileSearchOpen(false); }}
                                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-500/10 group transition-all text-left border border-transparent hover:border-emerald-500/20"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                                        "bg-zinc-900 text-zinc-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-500"
                                                    )}>
                                                        <result.icon size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors">{result.title}</span>
                                                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 max-w-[200px] truncate">{result.description}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border",
                                                        "bg-zinc-900 border-zinc-800 text-zinc-500",
                                                        "group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-500"
                                                    )}>
                                                        {result.category}
                                                    </span>
                                                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Backdrop for Mobile */}
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
