"use client"

import { useState, useEffect } from "react"
import { getPublishedCourses } from "@/app/actions/academy"
import { BookOpen, PlayCircle } from "lucide-react"
import Link from "next/link"

export default function AcademyPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await getPublishedCourses()
                if (result.success && result.data) {
                    setCourses(result.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCourses()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Academia LoyaltyPro</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Cursos y tutoriales para dominar la plataforma y hacer crecer tu negocio.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[16/10] bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Pronto publicaremos nuevos cursos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/dashboard/academy/${course.slug}`}
                            className="group block"
                        >
                            <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:scale-[1.01] flex flex-col h-full">
                                {/* Thumbnail */}
                                <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                                    {course.imageUrl ? (
                                        <img
                                            src={course.imageUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                            <BookOpen size={40} className="text-primary/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 text-primary opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 flex items-center justify-center shadow-lg">
                                            <PlayCircle size={24} className="ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                                        {course.title}
                                    </h3>
                                    {course.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                            {course.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            {course._count?.lessons || 0} Lecciones
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Ver curso &rarr;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
