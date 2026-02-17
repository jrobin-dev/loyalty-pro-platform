"use client"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { BookOpen, FolderPlus, Plus, Calendar, MoreHorizontal, Settings, Trash2, GraduationCap, Sparkles, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createCourse, deleteCourse, getAdminCourses, updateCourse } from "@/app/actions/admin-academy"

export default function AdminAcademyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [published, setPublished] = useState(true)
    const [instructorName, setInstructorName] = useState("")
    const [instructorBio, setInstructorBio] = useState("")

    // Edit State
    const [editingCourse, setEditingCourse] = useState<any>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Delete Alert State
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const result = await getAdminCourses()
            if (result.success && result.data) {
                setCourses(result.data)
            }
        } catch (error) {
            toast.error("Error al cargar cursos")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("imageUrl", imageUrl)
            formData.append("published", published.toString())
            formData.append("instructorName", instructorName)
            formData.append("instructorBio", instructorBio)

            const result = await createCourse(formData)

            if (result.success) {
                toast.success("Curso creado correctamente")
                setIsCreateOpen(false)
                resetForm()
                fetchCourses()
            } else {
                toast.error(result.error || "Error al crear curso")
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCourse) return
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", editingCourse.title)
            formData.append("description", editingCourse.description || "")
            formData.append("imageUrl", editingCourse.imageUrl || "")
            formData.append("published", editingCourse.published.toString())
            formData.append("instructorName", editingCourse.instructorName || "")
            formData.append("instructorBio", editingCourse.instructorBio || "")

            const result = await updateCourse(editingCourse.id, formData)

            if (result.success) {
                toast.success("Curso actualizado correctamente")
                setIsEditOpen(false)
                setEditingCourse(null)
                fetchCourses()
            } else {
                toast.error(result.error || "Error al actualizar curso")
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const onConfirmDelete = async () => {
        if (!courseToDelete) return
        try {
            const result = await deleteCourse(courseToDelete)
            if (result.success) {
                toast.success("Curso eliminado")
                fetchCourses()
            } else {
                toast.error("Error al eliminar")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setDeleteAlertOpen(false)
            setCourseToDelete(null)
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setImageUrl("")
        setInstructorName("")
        setInstructorBio("")
    }

    return (
        <div className="space-y-8">
            {/* Premium Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -z-10" />

                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-px w-8 bg-emerald-500/50" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Gestión de Contenidos</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                        Academia <span className="text-emerald-500">Master</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium max-w-lg">
                        Crea y organiza la base de conocimientos para tus clientes. Mantén la calidad premium en cada lección.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#00c853] hover:bg-[#00e676] text-black font-black gap-2 h-12 px-6 rounded-2xl transition-all shadow-xl shadow-[#00c853]/10 active:scale-95 border-0">
                            <FolderPlus size={18} /> Nuevo Curso Master
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-white/5 sm:max-w-[500px] rounded-[2rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">Crear Nuevo Curso</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">
                                Un curso es la estructura principal que agrupa tus lecciones.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCourse} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-zinc-400">Título del Curso</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Estrategias de Retención 101"
                                    required
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc" className="text-xs font-black uppercase tracking-widest text-zinc-400">Descripción</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="¿De qué trata este curso?..."
                                    className="bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="image" className="text-xs font-black uppercase tracking-widest text-zinc-400">Imagen de Portada</Label>
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                    bucket="course-covers"
                                    className="bg-zinc-900/50 border-white/5"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instructorName" className="text-xs font-black uppercase tracking-widest text-zinc-400">Nombre del Instructor</Label>
                                    <Input
                                        id="instructorName"
                                        value={instructorName}
                                        onChange={(e) => setInstructorName(e.target.value)}
                                        placeholder="Ej: Equipo LoyaltyPro"
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instructorBio" className="text-xs font-black uppercase tracking-widest text-zinc-400">Biografía/Lema</Label>
                                    <Input
                                        id="instructorBio"
                                        value={instructorBio}
                                        onChange={(e) => setInstructorBio(e.target.value)}
                                        placeholder="Ej: Nuestro objetivo es que logres..."
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-black text-white uppercase tracking-tighter">Visibilidad</Label>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        {published ? "Visible para clientes" : "Solo visible para admin"}
                                    </p>
                                </div>
                                <Switch
                                    checked={published}
                                    onCheckedChange={setPublished}
                                    className="data-[state=checked]:bg-[#00c853]"
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00c853] hover:bg-[#00e676] text-black font-black h-12 rounded-xl transition-all">
                                    {isSubmitting ? "Procesando Entrenamiento..." : "Lanzar Curso Master"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Courses Table Section */}
            <div className="rounded-[2rem] bg-zinc-900/30 backdrop-blur-sm overflow-hidden border border-white/5 shadow-2xl">
                <Table>
                    <TableHeader className="bg-zinc-900/50 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-0">
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6 px-8">Identidad del Curso</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6">Módulos</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6">Visibilidad</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 py-6 px-8">Control</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sincronizando Academia...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-24">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <BookOpen size={48} className="text-zinc-500" />
                                        <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">No hay cursos configurados en el sistema</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course.id} className="group border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-xl bg-zinc-950 border border-white/10 overflow-hidden flex-shrink-0 relative group/thumb">
                                                {course.imageUrl ? (
                                                    <img src={course.imageUrl} alt="" className="w-full h-full object-cover grayscale-[40%] group-hover/thumb:grayscale-0 transition-all duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-emerald-500/5">
                                                        <GraduationCap size={20} className="text-emerald-500/20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{course.title}</div>
                                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 truncate max-w-[200px]">
                                                    /{course.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <span className="text-xs font-black text-emerald-400">{course._count?.lessons || 0}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lecciones</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            course.published
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                : "bg-zinc-800 border-white/5 text-zinc-500"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", course.published ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-500")} />
                                            {course.published ? "Actuando" : "Borrador"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right py-6 px-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-800 border border-transparent hover:border-white/10 transition-all">
                                                    <span className="sr-only">Menu</span>
                                                    <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 p-2 rounded-xl shadow-2xl min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-3 py-2">Configuración</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <button
                                                        onClick={() => {
                                                            setEditingCourse(course)
                                                            setIsEditOpen(true)
                                                        }}
                                                        className="w-full cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2.5 hover:bg-zinc-900 transition-colors text-left"
                                                    >
                                                        <Settings className="h-4 w-4 text-zinc-500" />
                                                        <span className="font-bold text-sm">Editar Detalles</span>
                                                    </button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/academy/${course.id}`} className="cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2.5 hover:bg-[#00c853]/10 hover:text-[#00c853] group/item transition-colors">
                                                        <GraduationCap className="h-4 w-4 text-zinc-500 group-hover/item:text-[#00c853]" />
                                                        <span className="font-bold text-sm">Gestionar Lecciones</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/academy/${course.slug}`} target="_blank" className="cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2.5 hover:bg-zinc-900 transition-colors">
                                                        <ExternalLink className="h-4 w-4 text-zinc-500" />
                                                        <span className="font-bold text-sm">Vista Previa</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setCourseToDelete(course.id)
                                                        setDeleteAlertOpen(true)
                                                    }}
                                                    className="cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2.5 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="font-bold text-sm uppercase tracking-tighter">Eliminar Curso</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Edit Course Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-zinc-950 border-white/5 sm:max-w-[500px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">Editar Curso</DialogTitle>
                    </DialogHeader>
                    {editingCourse && (
                        <form onSubmit={handleUpdateCourse} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title" className="text-xs font-black uppercase tracking-widest text-zinc-400">Título del Curso</Label>
                                <Input
                                    id="edit-title"
                                    value={editingCourse.title}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                                    required
                                    className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-desc" className="text-xs font-black uppercase tracking-widest text-zinc-400">Descripción</Label>
                                <Textarea
                                    id="edit-desc"
                                    value={editingCourse.description || ""}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                                    className="bg-zinc-900/50 border-white/5 rounded-xl focus:border-[#00c853]/50 focus:ring-[#00c853]/10 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400">Imagen de Portada</Label>
                                <ImageUpload
                                    value={editingCourse.imageUrl || ""}
                                    onChange={(url) => setEditingCourse({ ...editingCourse, imageUrl: url })}
                                    bucket="course-covers"
                                    className="bg-zinc-900/50 border-white/5"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-instructorName" className="text-xs font-black uppercase tracking-widest text-zinc-400">Nombre del Instructor</Label>
                                    <Input
                                        id="edit-instructorName"
                                        value={editingCourse.instructorName || ""}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, instructorName: e.target.value })}
                                        placeholder="Ej: Equipo LoyaltyPro"
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-instructorBio" className="text-xs font-black uppercase tracking-widest text-zinc-400">Biografía/Lema</Label>
                                    <Input
                                        id="edit-instructorBio"
                                        value={editingCourse.instructorBio || ""}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, instructorBio: e.target.value })}
                                        placeholder="Ej: Nuestro objetivo es que logres..."
                                        className="h-12 bg-zinc-900/50 border-white/5 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-black text-white uppercase tracking-tighter">Visibilidad</Label>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        {editingCourse.published ? "Visible para clientes" : "Solo visible para admin"}
                                    </p>
                                </div>
                                <Switch
                                    checked={editingCourse.published}
                                    onCheckedChange={(val) => setEditingCourse({ ...editingCourse, published: val })}
                                    className="data-[state=checked]:bg-[#00c853]"
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00c853] hover:bg-[#00e676] text-black font-black h-12 rounded-xl transition-all border-0">
                                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent className="bg-zinc-950 border-white/5 rounded-[2rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight text-white uppercase tracking-tighter">¿Eliminar Curso?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500 font-medium pt-2">
                            Esta acción es irreversible. Se eliminarán permanentemente el curso y todas sus lecciones asociadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel className="bg-zinc-900 border-white/5 text-zinc-400 hover:text-white rounded-xl h-12 font-bold px-6">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-black h-12 rounded-xl px-6 transition-all"
                        >
                            ELIMINAR CURSO
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
