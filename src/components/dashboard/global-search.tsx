"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, Settings, CreditCard, LayoutDashboard, Store, Users as UsersIcon, Megaphone, ChevronRight, BookOpen, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCustomers } from "@/hooks/use-customers"
import { getPublishedCourses } from "@/app/actions/academy"

interface SearchResult {
    id: string
    title: string
    description: string
    category: "Navegación" | "Panel" | "Usuarios" | "Colecciones" | "Academia"
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
                // Check lessons if available (though getPublishedCourses only includes _count)
                // If we need topics/lessons, we'd need more data. 
                // For now, let's just do courses as per getPublishedCourses response.
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
                    href: `/dashboard/customers?id=${c.id}`,
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

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className={cn(
                "flex items-center gap-2 h-10 px-3 rounded-xl transition-all",
                "bg-secondary/40 dark:bg-secondary/50",
                "border-none",
                "dark:shadow-inner",
                "focus-within:bg-secondary/60 dark:focus-within:bg-secondary/80 focus-within:ring-2 focus-within:ring-emerald-500/10",
                isOpen && results.length > 0 ? "rounded-b-none shadow-none" : ""
            )}>
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar clientes, cursos, ajustes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="bg-transparent border-none outline-none text-sm text-foreground w-full placeholder:text-muted-foreground h-full"
                />
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-card border border-border/50 rounded-b-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {results.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result.href)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-500/5 group transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                                        <result.icon size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-foreground">{result.title}</span>
                                        <span className="text-[10px] text-muted-foreground">{result.description}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-secondary text-[8px] font-bold uppercase tracking-wider text-muted-foreground group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                        {result.category}
                                    </span>
                                    <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-emerald-500/50" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
