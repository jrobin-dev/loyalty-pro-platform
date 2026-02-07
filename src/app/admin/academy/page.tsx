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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Trash2, Video, Plus, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { createVideo, deleteVideo, getAdminVideos } from "@/app/actions/admin-academy"

export default function AdminAcademyPage() {
    const [videos, setVideos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form States
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [provider, setProvider] = useState("YOUTUBE")
    const [url, setUrl] = useState("")

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        setIsLoading(true)
        try {
            const result = await getAdminVideos()
            if (result.success && result.data) {
                setVideos(result.data)
            }
        } catch (error) {
            toast.error("Error al cargar videos")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateVideo = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("provider", provider)
            formData.append("url", url) // ID or full URL depending on provider

            const result = await createVideo(formData)

            if (result.success) {
                toast.success("Video agregado correctamente")
                setIsCreateOpen(false)
                resetForm()
                fetchVideos()
            } else {
                toast.error(result.error || "Error al crear video")
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteVideo = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este video?")) return
        try {
            const result = await deleteVideo(id)
            if (result.success) {
                toast.success("Video eliminado")
                fetchVideos()
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
        setUrl("")
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Academia (Tutoriales)</h1>
                    <p className="text-muted-foreground mt-1">Sube y gestiona los videos tutoriales para tus clientes.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 gap-2">
                            <Plus size={18} /> Agregar Video
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Tutorial</DialogTitle>
                            <DialogDescription>
                                Los videos aparecerán en la sección "Academia" de todos los clientes.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateVideo} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título del Video</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Cómo crear tu primer programa"
                                    required
                                />
                            </div>

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
                                <Label htmlFor="url">
                                    {provider === 'YOUTUBE' ? 'ID del Video (YouTube)' : 'URL del Iframe/Embed'}
                                </Label>
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder={provider === 'YOUTUBE' ? "Ej: dQw4w9WgXcQ" : "https://iframe.mediadelivery.net/..."}
                                    required
                                />
                                {provider === 'YOUTUBE' && (
                                    <p className="text-xs text-muted-foreground">Solo el código ID, no la URL completa.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción (Opcional)</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Breve explicación del contenido..."
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Guardando..." : "Publicar Video"}
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
                            <TableHead>Video</TableHead>
                            <TableHead>Plataforma</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Cargando videos...
                                </TableCell>
                            </TableRow>
                        ) : videos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No hay videos publicados aún.
                                </TableCell>
                            </TableRow>
                        ) : (
                            videos.map((video) => (
                                <TableRow key={video.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                                <Video size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium">{video.title}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {video.url}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-mono px-2 py-1 rounded border ${video.provider === 'YOUTUBE'
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {video.provider}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {video.provider === 'YOUTUBE' && (
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${video.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVideo(video.id)}
                                                className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
