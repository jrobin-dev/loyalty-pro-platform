"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getCourseBySlug } from "@/app/actions/academy"
import { VideoPlayer } from "@/components/academy/video-player"
import { CommentSection } from "@/components/academy/comment-section"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayCircle, CheckCircle2, Lock, ChevronLeft, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CoursePlayerPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()

    const slug = params.slug as string
    const lessonIdParam = searchParams.get("lessonId")

    const [course, setCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (slug) {
            fetchCourse()
        }
    }, [slug])

    const fetchCourse = async () => {
        setIsLoading(true)
        try {
            const result = await getCourseBySlug(slug)
            if (result.success) {
                setCourse(result.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[50vh]">Cargando curso...</div>
    }

    if (!course) {
        return <div className="flex items-center justify-center min-h-[50vh]">Curso no encontrado</div>
    }

    const lessons = course.lessons || []
    const currentLesson = lessons.find((l: any) => l.id === lessonIdParam) || lessons[0]

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Left Content: Video & Comments (Scrollable independently?) 
                Actually, the whole page usually scrolls, but let's try a fixed layout like YouTube/Udemy 
            */}

            <ScrollArea className="flex-1 h-full pr-4">
                <div className="space-y-6 pb-20">
                    <div className="flex items-center gap-2 mb-2 lg:hidden">
                        <Link href="/dashboard/academy" className="text-muted-foreground hover:text-foreground">
                            <ChevronLeft />
                        </Link>
                        <span className="font-semibold truncate">{course.title}</span>
                    </div>

                    {/* Video Player */}
                    {currentLesson ? (
                        <div className="w-full">
                            <VideoPlayer
                                provider={currentLesson.provider}
                                url={currentLesson.videoId}
                                title={currentLesson.title}
                                autoPlay={!!lessonIdParam} // Autoplay if navigated specifically
                            />
                            <div className="mt-4">
                                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                                <div className="text-muted-foreground mt-2 prose dark:prose-invert">
                                    {currentLesson.description}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center rounded-xl">
                            <p>No hay lecciones disponibles.</p>
                        </div>
                    )}

                    <div className="border-t border-border pt-6">
                        {currentLesson && <CommentSection lessonId={currentLesson.id} />}
                    </div>
                </div>
            </ScrollArea>

            {/* Right Sidebar: Playlist */}
            <div className={cn(
                "w-full lg:w-80 border-l border-border bg-card flex flex-col h-full",
                // Mobile behavior needed? For now straightforward responsive
            )}>
                <div className="p-4 border-b border-border bg-muted/20">
                    <h2 className="font-semibold text-lg line-clamp-1">{course.title}</h2>
                    <p className="text-xs text-muted-foreground">{lessons.length} Lecciones</p>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {lessons.map((lesson: any, index: number) => {
                            const isActive = currentLesson?.id === lesson.id
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => router.push(`/dashboard/academy/${slug}?lessonId=${lesson.id}`)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg flex gap-3 transition-colors",
                                        isActive
                                            ? "bg-primary/10 hover:bg-primary/15"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <div className="mt-0.5">
                                        {isActive ? (
                                            <PlayCircle size={16} className="text-primary fill-primary/20" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-medium line-clamp-2", isActive && "text-primary")}>
                                            {lesson.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground">{lesson.duration || "Video"}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
