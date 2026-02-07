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
import { BookOpen, FolderPlus, Plus, Calendar, MoreHorizontal, Settings, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createCourse, deleteCourse, getAdminCourses } from "@/app/actions/admin-academy"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminAcademyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form States
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")

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

    const handleDeleteCourse = async (id: string) => {
        if (!confirm("¿Estás seguro? Se eliminarán todas las lecciones y comentarios.")) return
        try {
            const result = await deleteCourse(id)
            if (result.success) {
                toast.success("Curso eliminado")
                fetchCourses()
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
        setImageUrl("")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Academia (Cursos)</h1>
                    <p className="text-muted-foreground mt-1">Gestiona los cursos y tutoriales para tus clientes.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 gap-2">
                            <FolderPlus size={18} /> Crear Curso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Curso</DialogTitle>
                            <DialogDescription>
                                Un curso agrupa varias lecciones de video.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCourse} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título del Curso</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Curso Básico de Lealtad"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Breve explicación del contenido..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">URL de Portada (Opcional)</Label>
                                <Input
                                    id="image"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creando..." : "Crear Curso"}
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
                            <TableHead>Curso</TableHead>
                            <TableHead>Lecciones</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Cargando cursos...
                                </TableCell>
                            </TableRow>
                        ) : courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No hay cursos creados. Crea el primero arriba.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                                                {course.imageUrl ? (
                                                    <img src={course.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{course.title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    /{course.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {course._count?.lessons || 0} lecciones
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.published
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                            }`}>
                                            {course.published ? "Publicado" : "Borrador"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/academy/${course.id}`} className="cursor-pointer">
                                                        <Settings className="mr-2 h-4 w-4" /> Gestionar Lecciones
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar Curso
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
        </div>
    )
}
