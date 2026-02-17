"use client"

import { useState, useEffect } from "react"
import { getPublishedCourses } from "@/app/actions/academy"
import { BookOpen, PlayCircle, Trophy, Clock, GraduationCap, Sparkles, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
        <div className="space-y-10 pb-20">
            {/* Premium Header */}
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -z-10" />
                <div className="absolute -top-20 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] rounded-full -z-10" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-px w-8 bg-emerald-500/50" />
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Learning Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                            Academia <span className="text-emerald-500">Premium</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium max-w-xl">
                            Domina el arte de la fidelización y escala tu negocio con nuestras guías exclusivas.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Trophy className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Cursos Disponibles</p>
                            <p className="text-2xl font-black text-white leading-none">{courses.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[16/11] bg-white/5 rounded-[2rem] border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 bg-zinc-900/30 rounded-[2.5rem] border border-dashed border-white/10"
                >
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="h-10 w-10 text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Próximamente más contenido</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">Nuestro equipo está preparando nuevas estrategias para ayudarte a crecer.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/dashboard/academy/${course.slug}`} className="group block h-full">
                                <div className="h-full bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2.2rem] overflow-hidden hover:bg-zinc-800/60 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col group/card relative">

                                    {/* Thumbnail Area */}
                                    <div className="aspect-[16/10] bg-zinc-950 relative overflow-hidden">
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover grayscale-[20%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/5 to-transparent">
                                                <GraduationCap size={60} className="text-emerald-500/10" />
                                            </div>
                                        )}

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="relative flex items-center justify-center">
                                                <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
                                                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10 border-4 border-black/20 group-hover/card:scale-110 transition-transform duration-500">
                                                    <div className="w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center">
                                                        <PlayCircle size={28} className="text-black fill-current ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                                <Zap size={10} className="fill-current" />
                                                Premium
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-7 flex flex-col flex-1 relative">
                                        {/* Decorative line */}
                                        <div className="absolute top-0 left-7 w-12 h-1 bg-emerald-500/40 rounded-full" />

                                        <h3 className="font-bold text-2xl leading-[1.15] text-white mt-4 group-hover/card:text-emerald-400 transition-colors duration-300">
                                            {course.title}
                                        </h3>

                                        {course.description && (
                                            <p className="text-sm text-zinc-500 font-medium leading-relaxed mt-4 line-clamp-2">
                                                {course.description}
                                            </p>
                                        )}

                                        {/* Footer Info */}
                                        <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-zinc-400">
                                                    <Clock size={14} />
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">{course._count?.lessons || 0} Lecciones</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs uppercase tracking-widest group-hover/card:translate-x-1 transition-transform">
                                                Empezar <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
