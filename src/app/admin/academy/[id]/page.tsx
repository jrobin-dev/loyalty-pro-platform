"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Video, Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { createLesson, deleteLesson, getCourseLessons } from "@/app/actions/admin-academy"
import Link from "next/link"

export default function AdminCourseDetailsPage() {
    const params = useParams()
    const courseId = params.id as string
    const router = useRouter()

    const [lessons, setLessons] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form States
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [provider, setProvider] = useState("YOUTUBE")
    const [videoId, setVideoId] = useState("")
    const [order, setOrder] = useState("")

    useEffect(() => {
        if (courseId) {
            fetchLessons()
        }
    }, [courseId])

    const fetchLessons = async () => {
        setIsLoading(true)
        try {
            const result = await getCourseLessons(courseId)
            if (result.success && result.data) {
                setLessons(result.data)
                // Set next order default
                setOrder((result.data.length + 1).toString())
            }
        } catch (error) {
            toast.error("Error al cargar lecciones")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("courseId", courseId)
            formData.append("title", title)
            formData.append("description", description)
            formData.append("provider", provider)
            formData.append("videoId", videoId)
            formData.append("order", order)

            const result = await createLesson(formData)

            if (result.success) {
                toast.success("Lección agregada")
                setIsCreateOpen(false)
                resetForm()
                fetchLessons()
            } else {
                toast.error(result.error || "Error al agregar lección")
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteLesson = async (id: string) => {
        if (!confirm("¿Eliminar esta lección?")) return
        try {
            const result = await deleteLesson(id, courseId)
            if (result.success) {
                toast.success("Lección eliminada")
                fetchLessons()
            } else {
                toast.error("Error al eliminar")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setProvider("YOUTUBE")
        setVideoId("")
        setOrder((lessons.length + 1).toString())
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/academy">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Gestionar Lecciones</h1>
                    <p className="text-muted-foreground">Agrega contenido a este curso.</p>
                </div>
            </div>

            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                    <span className="font-medium">Curso Activo</span>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 gap-2">
                            <Plus size={18} /> Agregar Lección
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Nueva Lección</DialogTitle>
                            <DialogDescription>
                                Agrega un video al temario del curso.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateLesson} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título de la Lección</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Introducción al sistema"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Plataforma</Label>
                                    <Select value={provider} onValueChange={setProvider}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="YOUTUBE">YouTube</SelectItem>
                                            <SelectItem value="BUNNY">Bunny.net</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Orden</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="videoId">
                                    {provider === 'YOUTUBE' ? 'ID del Video' : 'URL del Iframe'}
                                </Label>
                                <Input
                                    id="videoId"
                                    value={videoId}
                                    onChange={(e) => setVideoId(e.target.value)}
                                    placeholder={provider === 'YOUTUBE' ? "dQw4w9WgXcQ" : "https://..."}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción (Opcional)</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Detalles sobre esta lección..."
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Guardando..." : "Guardar Lección"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl bg-card overflow-hidden shadow-sm border border-border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Video ID</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Cargando lecciones...
                                </TableCell>
                            </TableRow>
                        ) : lessons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Este curso no tiene lecciones aún.
                                </TableCell>
                            </TableRow>
                        ) : (
                            lessons.map((lesson) => (
                                <TableRow key={lesson.id}>
                                    <TableCell className="font-mono text-muted-foreground">
                                        {lesson.order}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                <Video size={14} className="text-muted-foreground" />
                                            </div>
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {lesson.provider}: {lesson.videoId}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
