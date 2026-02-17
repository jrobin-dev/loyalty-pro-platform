"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getCourseBySlug, toggleLessonProgress, rateCourse, getCourseUserStatus } from "@/app/actions/academy"
import { VideoPlayer } from "@/components/academy/video-player"
import { CommentSection } from "@/components/academy/comment-section"
import { AcademyProgressBar } from "@/components/academy/progress-bar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Play,
    CheckCircle2,
    Lock,
    ChevronLeft,
    ChevronRight,
    Menu,
    GraduationCap,
    Clock,
    MessageSquare,
    Info,
    BookOpen,
    Star,
    ThumbsUp,
    PanelRightClose,
    PanelRightOpen,
    CircleDashed,
    CheckCircle,
    ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CoursePlayerPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()

    const slug = params.slug as string
    const lessonIdParam = searchParams.get("lessonId")

    const [course, setCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // User Status States
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
    const [userRating, setUserRating] = useState(0)
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)

    useEffect(() => {
        if (slug) {
            fetchCourse()
        }
    }, [slug])

    const fetchCourse = async () => {
        setIsLoading(true)
        try {
            const result = await getCourseBySlug(slug)
            if (result.success && result.data) {
                setCourse(result.data)
                // Fetch user progress and rating
                const status = await getCourseUserStatus(result.data.id)
                if (status.success) {
                    setCompletedLessonIds(status.data?.completedLessonIds || [])
                    setUserRating(status.data?.rating || 0)
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleProgress = async (lessonId: string) => {
        const isCompleted = completedLessonIds.includes(lessonId)
        setIsUpdatingProgress(true)
        try {
            const result = await toggleLessonProgress(lessonId, !isCompleted)
            if (result.success) {
                if (isCompleted) {
                    setCompletedLessonIds(prev => prev.filter(id => id !== lessonId))
                } else {
                    setCompletedLessonIds(prev => [...prev, lessonId])
                    toast.success("Lección marcada como completada", {
                        icon: <CheckCircle className="text-emerald-500 w-4 h-4" />
                    })
                }
            }
        } catch (error) {
            toast.error("Error al actualizar progreso")
        } finally {
            setIsUpdatingProgress(false)
        }
    }

    const handleRate = async (rating: number) => {
        try {
            const result = await rateCourse(course.id, rating)
            if (result.success) {
                setUserRating(rating)
                toast.success(`Has calificado el curso con ${rating} estrellas`)
            }
        } catch (error) {
            toast.error("Error al calificar")
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Cargando experiencia...</p>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                    <Info className="h-10 w-10 text-zinc-600" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Curso no encontrado</h1>
                <p className="text-zinc-500 mb-8">Parece que el curso que buscas no está disponible o ha sido movido.</p>
                <Button variant="outline" asChild className="rounded-2xl border-white/5 bg-zinc-900">
                    <Link href="/dashboard/academy">Volver a la Academia</Link>
                </Button>
            </div>
        )
    }

    const lessons = course.lessons || []
    const currentLesson = lessons.find((l: any) => l.id === lessonIdParam) || lessons[0]
    const currentIndex = lessons.findIndex((l: any) => l.id === currentLesson?.id)
    const isCurrentLessonCompleted = completedLessonIds.includes(currentLesson?.id)

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] -m-6 md:-m-10">
            {/* Top Navigation Bar (Mobile Header & Breadcrumbs) */}
            <header className="flex items-center justify-between p-4 lg:px-8 bg-zinc-950 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md h-16">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/academy" className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5 text-zinc-400 hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">
                            <span>Academia</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-emerald-500/80">{course.title}</span>
                        </div>
                        <h2 className="font-bold text-sm text-white truncate max-w-[300px] uppercase tracking-tighter">
                            {currentLesson?.title || "Cargando..."}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-8">
                    <div className="hidden md:block w-[200px] lg:w-[280px]">
                        <AcademyProgressBar
                            total={lessons.length}
                            completed={completedLessonIds.length}
                            compact
                        />
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/5"
                    >
                        <Menu className="w-5 h-5 text-emerald-400" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Toggle Button (Desktop) - Minimalist Premium Style */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className={cn(
                        "hidden lg:flex fixed z-[70] w-8 h-12 bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-full items-center justify-center hover:bg-zinc-900 group/toggle transition-all duration-700 ease-[0.22,1,0.36,1] shadow-2xl overflow-hidden",
                        sidebarCollapsed
                            ? "right-6 top-1/2 -translate-y-1/2 border-emerald-500/20 shadow-emerald-500/5"
                            : "right-[364px] top-1/2 -translate-y-1/2"
                    )}
                >
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover/toggle:bg-emerald-500/5 transition-colors" />
                    <motion.div
                        animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10"
                    >
                        <PanelRightClose className={cn(
                            "w-4 h-4 transition-colors",
                            sidebarCollapsed ? "text-emerald-500" : "text-zinc-500 group-hover/toggle:text-emerald-400"
                        )} />
                    </motion.div>
                </button>

                {/* Left Content: Video & Info */}
                <main className={cn(
                    "flex-1 overflow-y-auto bg-black transition-all duration-500 ease-in-out",
                    sidebarCollapsed ? "lg:pr-0" : "lg:pr-0"
                )}>
                    <div className="max-w-6xl mx-auto xl:px-8 py-0 lg:py-8">
                        {/* Video Area */}
                        <div className="w-full relative group">
                            <div className="absolute -inset-1 bg-emerald-500/10 blur-2xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                            {currentLesson ? (
                                <div className="space-y-8">
                                    <div className="rounded-none lg:rounded-[2rem] overflow-hidden border-0 lg:border border-white/10 bg-zinc-900 shadow-2xl relative">
                                        <VideoPlayer
                                            provider={currentLesson.provider}
                                            url={currentLesson.videoId}
                                            title={currentLesson.title}
                                            autoPlay={!!lessonIdParam}
                                        />
                                    </div>

                                    {/* Actions Bar Under Video (Premium) */}
                                    <div className="px-6 lg:px-0 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={() => handleToggleProgress(currentLesson.id)}
                                                disabled={isUpdatingProgress}
                                                className={cn(
                                                    "rounded-2xl px-6 py-6 font-black uppercase tracking-widest text-xs transition-all flex gap-3",
                                                    isCurrentLessonCompleted
                                                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
                                                        : "bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800"
                                                )}
                                            >
                                                {isCurrentLessonCompleted ? <CheckCircle className="w-5 h-5" /> : <CircleDashed className="w-5 h-5" />}
                                                {isCurrentLessonCompleted ? "Lección Completada" : "Marcar como vista"}
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="rounded-2xl h-[52px] bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white gap-2 font-bold px-6">
                                                        <Star className={cn("w-5 h-5", userRating > 0 ? "fill-amber-500 text-amber-500" : "text-zinc-500")} />
                                                        {userRating > 0 ? `Calificado: ${userRating}/5` : "Calificar"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-zinc-950 border-white/10 p-4 rounded-[1.5rem] w-64 shadow-2xl">
                                                    <DropdownMenuLabel className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">Calificar este curso</DropdownMenuLabel>
                                                    <div className="flex items-center justify-between px-2 pb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => handleRate(star)}
                                                                className="group/star relative"
                                                            >
                                                                <Star
                                                                    className={cn(
                                                                        "w-8 h-8 transition-all duration-300",
                                                                        star <= userRating
                                                                            ? "fill-emerald-500 text-emerald-500 scale-110"
                                                                            : "text-zinc-800 hover:text-emerald-500/50"
                                                                    )}
                                                                />
                                                                <div className="absolute -top-1 -right-1 opacity-0 group-hover/star:opacity-100 transition-opacity">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={currentIndex === 0}
                                                onClick={() => router.push(`/dashboard/academy/${slug}?lessonId=${lessons[currentIndex - 1].id}`)}
                                                className="w-12 h-12 rounded-2xl bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={currentIndex === lessons.length - 1}
                                                onClick={() => router.push(`/dashboard/academy/${slug}?lessonId=${lessons[currentIndex + 1].id}`)}
                                                className="w-12 h-12 rounded-2xl bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Lesson Info Card */}
                                    <div className="px-6 lg:px-0">
                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                                                    Módulo {currentIndex + 1}
                                                </span>
                                                {currentLesson.duration && (
                                                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                                                        <Clock size={14} />
                                                        {currentLesson.duration}
                                                    </div>
                                                )}
                                            </div>
                                            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight">
                                                {currentLesson.title}
                                            </h1>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                            <div className="lg:col-span-2 space-y-10">
                                                <div className="bg-zinc-900/30 rounded-3xl p-6 border border-white/5 backdrop-blur-sm relative overflow-hidden group/about">
                                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                                        <BookOpen size={100} className="text-emerald-500" />
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <BookOpen className="w-5 h-5 text-emerald-400" />
                                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Notas de Clase</h3>
                                                    </div>
                                                    <div className="text-zinc-400 text-sm leading-relaxed prose dark:prose-invert max-w-none relative z-10">
                                                        {currentLesson.description || "Sin descripción adicional para esta lección."}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="w-5 h-5 text-emerald-400" />
                                                            <h3 className="text-lg font-bold text-white tracking-tight text-sm uppercase">Preguntas y Respuestas</h3>
                                                        </div>
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-white/5">Comunidad</span>
                                                    </div>
                                                    <CommentSection lessonId={currentLesson.id} />
                                                </div>
                                            </div>

                                            <aside className="space-y-6">
                                                {/* Author/Extra Card */}
                                                <div className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                            <GraduationCap className="w-6 h-6 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">Instructor</h4>
                                                            <p className="text-zinc-500 text-xs font-medium">{course.instructorName || "Equipo LoyaltyPro"}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                                                        "{course.instructorBio || "Nuestro objetivo es que logres fidelizar a tu clientela desde el primer día."}"
                                                    </p>
                                                </div>

                                                <div className="bg-zinc-950/50 rounded-3xl p-6 border border-white/5 border-dashed">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <ThumbsUp size={16} className="text-emerald-500" />
                                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Recursos Libres</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {currentLesson.resources && (currentLesson.resources as any[]).length > 0 ? (
                                                            (currentLesson.resources as any[]).map((res, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={res.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group/res"
                                                                >
                                                                    <span className="text-xs font-bold text-zinc-300 group-hover/res:text-emerald-400 transition-colors">{res.title}</span>
                                                                    <ExternalLink size={14} className="text-zinc-500 group-hover/res:text-emerald-500" />
                                                                </a>
                                                            ))
                                                        ) : (
                                                            <p className="text-[11px] text-zinc-600 font-medium italic text-center py-2">Sin recursos para esta lección</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-zinc-900 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 m-6 lg:m-0">
                                    <Play size={64} className="text-zinc-800 mb-4 fill-zinc-800/20" />
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Selecciona una lección para comenzar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: Playlist (Immersive) */}
                <aside className={cn(
                    "fixed inset-0 z-[60] lg:relative lg:z-0 lg:flex w-full bg-zinc-950 lg:bg-[#0c0c0e] border-l border-white/5 flex flex-col transition-all duration-700 ease-[0.22,1,0.36,1] shadow-2xl",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
                    sidebarCollapsed ? "lg:w-0 lg:opacity-0 lg:pointer-events-none lg:border-none" : "lg:w-[380px]"
                )}>
                    <div className="p-6 lg:p-8 flex flex-col gap-6 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="font-black text-xl text-white tracking-tighter leading-tight uppercase line-clamp-1">{course.title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lessons.length} Lecciones</span>
                                </div>
                            </div>
                            <button
                                className="lg:hidden w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Menu size={20} className="rotate-90" />
                            </button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 custom-scrollbar">
                        <div className="p-4 lg:p-6 space-y-3 pb-20">
                            {[...lessons].sort((a, b) => (a.order || 0) - (b.order || 0)).map((lesson: any, index: number) => {
                                const isActive = currentLesson?.id === lesson.id
                                const isCompleted = completedLessonIds.includes(lesson.id)

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => {
                                            router.push(`/dashboard/academy/${slug}?lessonId=${lesson.id}`)
                                            setMobileMenuOpen(false)
                                        }}
                                        className={cn(
                                            "w-full text-left p-4 rounded-[2rem] flex gap-4 transition-all duration-500 relative group/item overflow-hidden border",
                                            isActive
                                                ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
                                                : isCompleted
                                                    ? "bg-zinc-900/40 border-white/5 hover:border-emerald-500/20"
                                                    : "bg-zinc-900/60 border-white/5 hover:bg-zinc-900 hover:border-white/10 hover:translate-y-[-2px]"
                                        )}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={cn(
                                                "w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden relative",
                                                isActive
                                                    ? "bg-emerald-500 text-black px-1"
                                                    : isCompleted
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                        : "bg-zinc-950 text-zinc-600 group-hover/item:text-emerald-400 border border-white/5"
                                            )}>
                                                {isActive ? (
                                                    <div className="relative">
                                                        <Play size={20} className="fill-current" />
                                                        <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
                                                    </div>
                                                ) : isCompleted ? (
                                                    <CheckCircle size={20} />
                                                ) : (
                                                    <span className="text-[10px] font-black opacity-30 tracking-tighter">{(index + 1).toString().padStart(2, '0')}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1 py-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={cn(
                                                    "text-[11px] font-black transition-colors leading-tight uppercase tracking-widest truncate",
                                                    isActive ? "text-emerald-400" : isCompleted ? "text-zinc-100" : "text-zinc-500 group-hover/item:text-zinc-300"
                                                )}>
                                                    {lesson.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em]",
                                                    isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-black/40 text-zinc-700"
                                                )}>
                                                    {lesson.duration || "YOUTUBE • VIDEO"}
                                                </div>
                                                {isActive && (
                                                    <div className="flex gap-0.5 items-center ml-1">
                                                        <span className="w-0.5 h-3 bg-emerald-500/60 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                                        <span className="w-0.5 h-4 bg-emerald-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                                        <span className="w-0.5 h-3 bg-emerald-500/60 rounded-full animate-[bounce_1s_infinite_400ms]" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-l-full shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </ScrollArea>

                    <style jsx global>{`
                        .custom-scrollbar [data-radix-scroll-area-viewport]::-webkit-scrollbar {
                            width: 3px !important;
                        }
                        .custom-scrollbar [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
                            background: transparent !important;
                        }
                        .custom-scrollbar [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
                            background: rgba(16, 185, 129, 0.1) !important;
                            border-radius: 20px !important;
                        }
                        .custom-scrollbar [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
                            background: rgba(16, 185, 129, 0.4) !important;
                        }
                    `}</style>

                    {/* Sidebar Footer */}
                    <div className="p-6 bg-emerald-500/5 lg:bg-transparent border-t border-white/5">
                        <p className="text-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Sistema Loyalty Pro 2026</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
