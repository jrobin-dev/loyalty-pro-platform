"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Image as ImageIcon, Film, Trash2, Eye, MoreHorizontal, PlayCircle, Monitor, Smartphone } from "lucide-react"

// Mock Data
const initialBanners = [
    {
        id: "1",
        title: "Promo Verano Pro",
        type: "image",
        status: "active",
        urlDesktop: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop", // Wide
        urlMobile: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop", // Square-ish
        target: "all_tenants",
        views: 1240,
        clicks: 85
    },
    {
        id: "2",
        title: "Tutorial Nuevo Dashboard",
        type: "video",
        status: "active",
        urlDesktop: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
        urlMobile: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4", // Using same for mock
        target: "free_plan",
        views: 530,
        clicks: 120
    }
]

export default function BannersPage() {
    const [banners, setBanners] = useState(initialBanners)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newBannerType, setNewBannerType] = useState("image")
    const [previewMode, setPreviewMode] = useState<Record<string, 'desktop' | 'mobile'>>({})

    const togglePreview = (id: string, mode: 'desktop' | 'mobile') => {
        setPreviewMode(prev => ({ ...prev, [id]: mode }))
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Marketing Global</h1>
                    <p className="text-muted-foreground mt-1">Gestiona los anuncios responsivos (Desktop y Mobile) para tus clientes.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Banner
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-card border-border">
                        <DialogHeader>
                            <DialogTitle>Crear Banner Responsivo</DialogTitle>
                            <DialogDescription>
                                Sube versiones optimizadas para Escritorio y Celular. Soporta JPG, PNG, WEBP, GIF y MP4.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4 overflow-y-auto max-h-[60vh] pr-2">
                            <div className="space-y-2">
                                <Label>Tipo de Contenido</Label>
                                <Tabs defaultValue="image" className="w-full" onValueChange={setNewBannerType}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="image" className="gap-2"><ImageIcon size={16} /> Imagen / GIF / WEBP</TabsTrigger>
                                        <TabsTrigger value="video" className="gap-2"><Film size={16} /> Video MP4</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Título de Campaña</Label>
                                <Input id="title" placeholder="Ej: Black Friday 2024" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Desktop Asset */}
                                <div className="space-y-3 p-4 border border-border rounded-xl bg-muted/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Monitor size={18} className="text-primary" />
                                        <Label className="font-bold">Versión Desktop</Label>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">Recomendado: 1920x400px (Panorámico)</div>
                                    <Input id="url-desktop" placeholder="URL Desktop Asset" />
                                    <Button variant="secondary" size="sm" className="w-full">Subir Archivo</Button>
                                </div>

                                {/* Mobile Asset */}
                                <div className="space-y-3 p-4 border border-border rounded-xl bg-muted/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone size={18} className="text-primary" />
                                        <Label className="font-bold">Versión Mobile</Label>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">Recomendado: 1080x1080px (Cuadrado)</div>
                                    <Input id="url-mobile" placeholder="URL Mobile Asset" />
                                    <Button variant="secondary" size="sm" className="w-full">Subir Archivo</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Segmentación</Label>
                                    <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                        <option value="all">Todos los Tenants</option>
                                        <option value="free">Solo Plan Free</option>
                                        <option value="pro">Solo Plan Pro</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Link de Destino (CTA)</Label>
                                    <Input placeholder="https://..." />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3 border-border bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Estado Activo</Label>
                                    <p className="text-xs text-muted-foreground">Visibilidad inmediata tras guardar.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Publicar Campaña</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => {
                    const mode = previewMode[banner.id] || 'desktop'
                    const currentUrl = mode === 'desktop' ? banner.urlDesktop : banner.urlMobile

                    return (
                        <Card key={banner.id} className="group overflow-hidden border-border bg-card hover:border-border transition-all">

                            {/* Preview Controls */}
                            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Preview Mode</span>
                                <div className="flex bg-muted rounded-lg p-0.5">
                                    <button
                                        onClick={() => togglePreview(banner.id, 'desktop')}
                                        className={`p-1.5 rounded-md transition-all ${mode === 'desktop' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Monitor size={14} />
                                    </button>
                                    <button
                                        onClick={() => togglePreview(banner.id, 'mobile')}
                                        className={`p-1.5 rounded-md transition-all ${mode === 'mobile' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Smartphone size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Media Preview Container */}
                            <div className={`w-full bg-black relative overflow-hidden transition-all duration-300 flex items-center justify-center ${mode === 'desktop' ? 'aspect-video' : 'aspect-square'
                                }`}>
                                {banner.type === 'video' ? (
                                    <video
                                        src={currentUrl}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={currentUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                {/* Overlay Badges */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-none">
                                        {banner.type === 'video' ? <Film size={12} className="mr-1" /> : <ImageIcon size={12} className="mr-1" />}
                                        {banner.type.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg font-[family-name:var(--font-funnel-display)]">{banner.title}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${banner.target === 'free_plan' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                    Target: {banner.target === 'all_tenants' ? 'Todos' : banner.target === 'free_plan' ? 'Plan Free' : 'Plan Pro'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider">Vistas</span>
                                        <span className="font-bold flex items-center gap-1"><Eye size={12} className="text-primary" /> {banner.views}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider">Clicks</span>
                                        <span className="font-bold text-primary">{banner.clicks}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="justify-end pt-2 border-t border-border bg-muted/20">
                                <Button variant="ghost" size="sm" className="text-muted-foreground h-8 text-xs hover:text-destructive">
                                    <Trash2 size={14} className="mr-1" /> Eliminar
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
