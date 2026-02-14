"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, Settings, CreditCard, LayoutDashboard, Store, Users as UsersIcon, Megaphone, ChevronRight, BookOpen, GraduationCap, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/hooks/use-customers"
import { getPublishedCourses } from "@/app/actions/academy"

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

    return (
        <div className="relative w-full max-w-xl mx-auto z-50" ref={containerRef}>
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

            {/* Results Dropdown */}
            {hasResults && (
                <div className="absolute top-full left-0 w-full bg-[#18181B] border border-emerald-500/30 border-t-0 rounded-b-2xl shadow-2xl overflow-hidden -mt-[1px]">
                    {/* Horizontal line to separate input from results but keep outer border seamless */}
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
    )
}
