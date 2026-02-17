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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Video, Plus, Trash2, GripVertical, CheckCircle2, Layout, Settings2, PlayCircle, ExternalLink, Hash } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { createLesson, deleteLesson, getCourseLessons, updateLesson } from "@/app/actions/admin-academy"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    const [resources, setResources] = useState<{ title: string, url: string }[]>([])

    // Edit Lesson State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingLesson, setEditingLesson] = useState<any>(null)

    // Delete Alert State
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)

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
            formData.append("resources", JSON.stringify(resources))

            const result = await createLesson(formData)

            if (result.success) {
                toast.success("Lección master agregada")
                setIsCreateOpen(false)
                resetForm()
                fetchLessons()
            } else {
                toast.error(result.error || "Error al agregar lección")
            }
        } catch (error) {
            toast.error("Error inesperado en el servidor")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateLesson = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingLesson) return
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("courseId", courseId)
            formData.append("title", editingLesson.title)
            formData.append("description", editingLesson.description || "")
            formData.append("provider", editingLesson.provider)
            formData.append("videoId", editingLesson.videoId)
            formData.append("order", editingLesson.order.toString())
            formData.append("resources", JSON.stringify(editingLesson.resources || []))

            const result = await updateLesson(editingLesson.id, formData)

            if (result.success) {
                toast.success("Lección actualizada")
                setIsEditOpen(false)
                setEditingLesson(null)
                fetchLessons()
            } else {
                toast.error(result.error || "Error al actualizar")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    const onConfirmDelete = async () => {
        if (!lessonToDelete) return
        try {
            const result = await deleteLesson(lessonToDelete, courseId)
            if (result.success) {
                toast.success("Lección eliminada")
                fetchLessons()
            } else {
                toast.error("Error al eliminar")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setDeleteAlertOpen(false)
            setLessonToDelete(null)
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setProvider("YOUTUBE")
        setVideoId("")
        setResources([])
        setOrder((lessons.length + 1).toString())
    }

    return (
        <div className="space-y-8">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Link href="/admin/academy">
                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Configurador de Contenido</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                            Gestionar <span className="text-emerald-500">Lecciones</span>
                        </h1>
                    </div>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#00c853] hover:bg-[#00e676] text-black font-black gap-2 h-12 px-6 rounded-2xl transition-all shadow-xl shadow-[#00c853]/10 active:scale-95 border-0">
                            <Plus size={18} /> Nueva Lección Master
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-white/5 sm:max-w-[500px] rounded-[2rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">Nueva Lección</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">
                                Define los detalles del video y su posición en el curso.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateLesson} className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-zinc-400">Título de la Lección</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Bienvenida al Programa"
                                    required
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="provider" className="text-xs font-black uppercase tracking-widest text-zinc-400">Plataforma</Label>
                                    <Select value={provider} onValueChange={setProvider}>
                                        <SelectTrigger className="h-12 bg-zinc-900/50 border-white/5 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10 rounded-xl">
                                            <SelectItem value="YOUTUBE" className="focus:bg-[#00c853]/10 focus:text-[#00c853]">YouTube</SelectItem>
                                            <SelectItem value="BUNNY" className="focus:bg-[#00c853]/10 focus:text-[#00c853]">Bunny.net</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order" className="text-xs font-black uppercase tracking-widest text-zinc-400">Orden / Índice</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        placeholder="1"
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="videoId" className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                    {provider === 'YOUTUBE' ? 'YouTube link o ID' : 'Bunny Iframe link'}
                                </Label>
                                <Input
                                    id="videoId"
                                    value={videoId}
                                    onChange={(e) => setVideoId(e.target.value)}
                                    placeholder={provider === 'YOUTUBE' ? "Pega el link de YouTube..." : "Pega el iframe de Bunny..."}
                                    required
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10"
                                />
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-1">
                                    Extraeremos el ID automáticamente 🪄
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc" className="text-xs font-black uppercase tracking-widest text-zinc-400">Descripción (Opcional)</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Contenido teórico de la lección..."
                                    className="bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10 min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Recursos Libres (Enlaces)</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setResources([...resources, { title: "", url: "" }])}
                                        className="h-8 bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 text-[10px] font-black uppercase tracking-tight"
                                    >
                                        <Plus size={14} className="mr-1" /> Añadir Enlace
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {resources.map((res, index) => (
                                        <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-start bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <Input
                                                placeholder="Título"
                                                value={res.title}
                                                onChange={(e) => {
                                                    const newRes = [...resources];
                                                    newRes[index].title = e.target.value;
                                                    setResources(newRes);
                                                }}
                                                className="h-9 text-xs bg-zinc-900/50 border-white/5"
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={res.url}
                                                onChange={(e) => {
                                                    const newRes = [...resources];
                                                    newRes[index].url = e.target.value;
                                                    setResources(newRes);
                                                }}
                                                className="h-9 text-xs bg-zinc-900/50 border-white/5"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-zinc-500 hover:text-red-500"
                                                onClick={() => setResources(resources.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    {resources.length === 0 && (
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight text-center py-2 italic">Sin recursos adicionales</p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00c853] hover:bg-[#00e676] text-black font-black h-12 rounded-xl transition-all border-0">
                                    {isSubmitting ? "Sincronizando Módulo..." : "Guardar Lección Master"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Status Banner */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-500 h-5 w-5 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm uppercase tracking-tight">Estructura del Curso</p>
                        <p className="text-zinc-500 text-xs font-medium">Los cambios se reflejan instantáneamente en la interfaz del cliente.</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lessons.length} Lecciones Totales</span>
                </div>
            </div>

            {/* Lessons Table */}
            <div className="rounded-[2.5rem] bg-zinc-900/30 backdrop-blur-sm overflow-hidden border border-white/5 shadow-2xl">
                <Table>
                    <TableHeader className="bg-zinc-900/50 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-0">
                            <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6 px-8">#</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6">Título de Clase</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6">Recurso Multimedia</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6 px-8">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-24">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cargando Lecciones...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : lessons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-32">
                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                        <div className="w-16 h-16 rounded-3xl bg-zinc-800 flex items-center justify-center">
                                            <Video size={32} className="text-zinc-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-zinc-500 uppercase tracking-widest text-xs">Sin contenido todavía</p>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Comienza agregando tu primera lección arriba.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            lessons.map((lesson) => (
                                <TableRow key={lesson.id} className="group border-white/[0.03] hover:bg-white/[0.01] transition-all">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center font-mono text-[11px] font-black text-zinc-500 group-hover:text-emerald-500 transition-colors">
                                                {lesson.order.toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 transition-all flex-shrink-0">
                                                <PlayCircle size={20} className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div className="min-w-0 max-w-[300px] lg:max-w-[450px]">
                                                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight truncate">{lesson.title}</div>
                                                <div className="text-[10px] font-medium text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {lesson.description || "Sin descripción adicional"}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                                lesson.provider === 'YOUTUBE' ? "bg-red-500/5 border-red-500/10 text-red-500/70" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-500/70"
                                            )}>
                                                {lesson.provider}
                                            </span>
                                            <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[120px]">{lesson.videoId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-6 px-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl bg-zinc-900 border border-transparent hover:border-[#00c853]/20 text-zinc-500 hover:text-[#00c853] hover:bg-[#00c853]/5 transition-all"
                                                onClick={() => {
                                                    setEditingLesson(lesson)
                                                    setIsEditOpen(true)
                                                }}
                                            >
                                                <Settings2 size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl bg-zinc-900 border border-transparent hover:border-red-500/20 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
                                                onClick={() => {
                                                    setLessonToDelete(lesson.id)
                                                    setDeleteAlertOpen(true)
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Edit Lesson Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-zinc-950 border-white/5 sm:max-w-[500px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">Editar Lección</DialogTitle>
                    </DialogHeader>
                    {editingLesson && (
                        <form onSubmit={handleUpdateLesson} className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Título de la Lección</Label>
                                <Input
                                    value={editingLesson.title}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                    required
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Plataforma</Label>
                                    <Select
                                        value={editingLesson.provider}
                                        onValueChange={(val) => setEditingLesson({ ...editingLesson, provider: val })}
                                    >
                                        <SelectTrigger className="h-12 bg-zinc-900/50 border-white/5 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10 rounded-xl">
                                            <SelectItem value="YOUTUBE" className="focus:bg-[#00c853]/10 focus:text-[#00c853]">YouTube</SelectItem>
                                            <SelectItem value="BUNNY" className="focus:bg-[#00c853]/10 focus:text-[#00c853]">Bunny.net</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Orden</Label>
                                    <Input
                                        type="number"
                                        value={editingLesson.order}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, order: parseInt(e.target.value) })}
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">
                                    {editingLesson.provider === 'YOUTUBE' ? 'YouTube link o ID' : 'Bunny Iframe link'}
                                </Label>
                                <Input
                                    value={editingLesson.videoId}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, videoId: e.target.value })}
                                    required
                                    placeholder="Pega el nuevo link o ID..."
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Descripción (Opcional)</Label>
                                <Textarea
                                    value={editingLesson.description || ""}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                                    className="bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10 min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Recursos Libres (Enlaces)</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const currentRes = editingLesson.resources || [];
                                            setEditingLesson({ ...editingLesson, resources: [...currentRes, { title: "", url: "" }] });
                                        }}
                                        className="h-8 bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 text-[10px] font-black uppercase tracking-tight"
                                    >
                                        <Plus size={14} className="mr-1" /> Añadir Enlace
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {(editingLesson.resources || []).map((res: any, index: number) => (
                                        <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-start bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                            <Input
                                                placeholder="Título"
                                                value={res.title}
                                                onChange={(e) => {
                                                    const newRes = editingLesson.resources.map((res: any, i: number) =>
                                                        i === index ? { ...res, title: e.target.value } : res
                                                    );
                                                    setEditingLesson({ ...editingLesson, resources: newRes });
                                                }}
                                                className="h-9 text-xs bg-zinc-900/50 border-white/5"
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={res.url}
                                                onChange={(e) => {
                                                    const newRes = editingLesson.resources.map((res: any, i: number) =>
                                                        i === index ? { ...res, url: e.target.value } : res
                                                    );
                                                    setEditingLesson({ ...editingLesson, resources: newRes });
                                                }}
                                                className="h-9 text-xs bg-zinc-900/50 border-white/5"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-zinc-500 hover:text-red-500"
                                                onClick={() => {
                                                    const newRes = editingLesson.resources.filter((_: any, i: number) => i !== index);
                                                    setEditingLesson({ ...editingLesson, resources: newRes });
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    {(!editingLesson.resources || editingLesson.resources.length === 0) && (
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight text-center py-2 italic">Sin recursos adicionales</p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00c853] hover:bg-[#00e676] text-black font-black h-12 rounded-xl transition-all border-0">
                                    {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Lesson Alert */}
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent className="bg-zinc-950 border-white/5 rounded-[2rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">¿Eliminar Lección?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500 font-medium pt-2">
                            Estás a punto de borrar esta lección permanentemente. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel className="bg-zinc-900 border-white/5 text-zinc-400 hover:text-white rounded-xl h-12 font-bold px-6">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-black h-12 rounded-xl px-6 transition-all"
                        >
                            ELIMINAR LECCIÓN
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
