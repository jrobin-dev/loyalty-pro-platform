"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Search, Filter, MoreVertical, Edit, Trash2, Ban, CheckCircle2, Zap, ChevronLeft, ChevronRight, RefreshCw, Download, Plus, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTenants, createTenant, updateTenantStatus, updateTenant, deleteTenant } from "@/app/actions/admin-tenants"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const ITEMS_PER_PAGE = 15

export default function TenantsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Data State
    const [tenants, setTenants] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string[]>(["ALL"])
    const [planFilter, setPlanFilter] = useState<string[]>(["ALL"])

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)

    // Form Modals State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingTenant, setEditingTenant] = useState<any | null>(null)

    // Safety Alert States
    const [suspendAlertOpen, setSuspendAlertOpen] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [targetTenant, setTargetTenant] = useState<any>(null)
    const [confirmInput, setConfirmInput] = useState("")

    // New Tenant Form State
    const [newName, setNewName] = useState("")
    const [newSlug, setNewSlug] = useState("")
    const [newOwnerEmail, setNewOwnerEmail] = useState("")
    const [newPlan, setNewPlan] = useState("FREE")

    // deep link handling
    useEffect(() => {
        const querySearch = searchParams.get('search')
        if (querySearch) {
            setSearchTerm(querySearch)
        }
        fetchTenants()
    }, [searchParams])

    const fetchTenants = async () => {
        setIsLoading(true)
        try {
            const result = await getTenants()
            if (result.success && result.data) {
                setTenants(result.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // --- Filtering Logic ---
    const filteredTenants = tenants.filter(tenant => {
        // 1. Search Term
        const matchesSearch =
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.owner.email.toLowerCase().includes(searchTerm.toLowerCase())

        // 2. Status Filter
        const matchesStatus = statusFilter.includes("ALL") || statusFilter.includes(tenant.status)

        // 3. Plan Filter
        const matchesPlan = planFilter.includes("ALL") || planFilter.includes(tenant.owner?.plan)

        return matchesSearch && matchesStatus && matchesPlan
    })

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE)
    const paginatedTenants = filteredTenants.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // --- Handlers ---

    const handleFilterToggle = (type: 'status' | 'plan', value: string) => {
        const currentFilter = type === 'status' ? statusFilter : planFilter
        const setFilter = type === 'status' ? setStatusFilter : setPlanFilter

        if (value === "ALL") {
            setFilter(["ALL"])
            return
        }

        let newFilter = [...currentFilter]
        if (newFilter.includes("ALL")) {
            newFilter = []
        }

        if (newFilter.includes(value)) {
            newFilter = newFilter.filter(item => item !== value)
        } else {
            newFilter.push(value)
        }

        if (newFilter.length === 0) {
            newFilter = ["ALL"]
        }

        setFilter(newFilter)
        setCurrentPage(1)
    }

    const onCreateTenant = async () => {
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("name", newName)
        formData.append("slug", newSlug)
        formData.append("ownerEmail", newOwnerEmail)
        // Plan is inherited from owner, so we don't send it here if owner exists
        // but the backend takes it if it's a new registration (handled in API usually)

        const result = await createTenant(formData)
        if (result.success) {
            toast.success("Negocio creado exitosamente")
            setIsCreateOpen(false)
            fetchTenants()
            // Reset form
            setNewName("")
            setNewSlug("")
            setNewOwnerEmail("")
            setNewPlan("FREE")
        } else {
            toast.error(result.error)
        }
        setIsSubmitting(false)
    }


    const onSuspendClick = (tenant: any) => {
        if (tenant.status === 'SUSPENDED') {
            // If already suspended, verify reactivation directly (maybe add alert later too)
            onUpdateStatus(tenant.id, 'ACTIVE')
        } else {
            setTargetTenant(tenant)
            setConfirmInput("")
            setSuspendAlertOpen(true)
        }
    }

    const confirmSuspend = async () => {
        if (!targetTenant) return
        const result = await updateTenantStatus(targetTenant.id, 'SUSPENDED')
        if (result.success) {
            toast.success("Negocio suspendido correctamente")
            fetchTenants()
        } else {
            toast.error("Error al suspender negocio")
        }
        setSuspendAlertOpen(false)
    }

    const onUpdateStatus = async (tenantId: string, newStatus: string) => {
        const result = await updateTenantStatus(tenantId, newStatus)
        if (result.success) {
            toast.success(`Estado actualizado a ${newStatus}`)
            fetchTenants()
        } else {
            toast.error("Error al actualizar estado")
        }
    }


    const onDeleteClick = (tenant: any) => {
        setTargetTenant(tenant)
        setConfirmInput("")
        setDeleteAlertOpen(true)
    }

    const confirmDelete = async () => {
        if (!targetTenant) return
        const result = await deleteTenant(targetTenant.id)
        if (result.success) {
            toast.success("Negocio eliminado permanentemente")
            fetchTenants()
        } else {
            toast.error("Error al eliminar negocio")
        }
        setDeleteAlertOpen(false)
    }

    // --- Export Functionality ---
    const handleExport = () => {
        if (tenants.length === 0) {
            toast.error("No hay datos para exportar")
            return
        }

        const headers = ["ID", "Nombre", "Slug", "Plan", "Estado", "Creado", "Dueño Nombre", "Dueño Email"]
        const csvContent = [
            headers.join(","),
            ...tenants.map(t => [
                t.id,
                `"${t.name}"`, // Quote to handle commas
                t.slug,
                t.plan,
                t.status,
                new Date(t.createdAt).toISOString(),
                `"${t.owner?.name} ${t.owner?.lastName || ''}"`,
                t.owner?.email
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `negocios_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Archivo CSV descargado")
    }

    // --- Autologin Functionality ---
    const [impersonateOpen, setImpersonateOpen] = useState(false)
    const [impersonationLink, setImpersonationLink] = useState("")
    const [isGeneratingLink, setIsGeneratingLink] = useState(false)

    const onImpersonateClick = async (tenant: any) => {
        setTargetTenant(tenant)
        setImpersonationLink("")
        setImpersonateOpen(true)
        setIsGeneratingLink(true)

        // Call Server Action
        try {
            const { generateImpersonationLink } = await import("@/app/actions/admin-auth")
            const result = await generateImpersonationLink(tenant.id)

            if (result.success && result.link) {
                setImpersonationLink(result.link)
            } else {
                toast.error(result.error || "Error generando enlace")
                setImpersonateOpen(false)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error de conexión")
            setImpersonateOpen(false)
        } finally {
            setIsGeneratingLink(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(impersonationLink)
        toast.success("Enlace copiado al portapapeles")
    }

    const getPlanStyles = (plan: string = 'FREE') => {
        switch (plan.toUpperCase()) {
            case 'FREE':
                return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]"
            case 'STARTER':
                return "bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/30 shadow-[0_0_20px_-3px_rgba(139,92,246,0.2)]"
            case 'PRO':
                return "bg-amber-500/15 text-amber-500 border-amber-500/20 hover:bg-amber-500/25 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]"
            case 'AGENCY':
                return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/25 shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)]"
            default:
                return "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                {/* Header Row: Search + Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Search Bar - Large */}
                    <div className="relative flex-1 w-full md:max-w-xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar por nombre, email o slug..."
                            className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant="outline"
                            className={cn("gap-2 border-dashed h-9", showFilters && "bg-accent text-accent-foreground border-solid")}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            Filtros
                        </Button>

                        <Button variant="outline" className="gap-2 h-9" onClick={handleExport}>
                            <Download size={16} />
                            Exportar
                        </Button>

                        <Button variant="outline" className="gap-2 h-9" onClick={fetchTenants}>
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refrescar
                        </Button>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 h-9 bg-green-600 hover:bg-green-700 text-white border-0">
                                    <Plus size={16} />
                                    Nuevo Cliente
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Crear Nuevo Negocio</DialogTitle>
                                    <DialogDescription>
                                        Ingresa los detalles iniciales del negocio y su dueño.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Nombre del Negocio</Label>
                                        <Input placeholder="Ej: Restaurante Mexicano" value={newName} onChange={e => setNewName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (URL)</Label>
                                        <Input placeholder="restaurante-mexicano" value={newSlug} onChange={e => setNewSlug(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email del Dueño (Debe existir)</Label>
                                        <Input placeholder="dueno@email.com" value={newOwnerEmail} onChange={e => setNewOwnerEmail(e.target.value)} />
                                        <p className="text-[10px] text-muted-foreground italic">
                                            * El nuevo negocio heredará automáticamente el plan PRO/STARTER/FREE activo en la cuenta del dueño.
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                                    <Button onClick={onCreateTenant} disabled={isSubmitting}>
                                        {isSubmitting ? "Creando..." : "Crear Negocio"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Inline Filters Area (Collapsible) */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-muted/30 border border-border/50 rounded-lg overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                {/* Status Row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-muted-foreground w-16 uppercase tracking-wider">Estado:</span>
                                    {['ALL', 'ACTIVE', 'SUSPENDED', 'PENDING'].map((status) => {
                                        const label = { 'ALL': 'TODOS', 'ACTIVE': 'ACTIVOS', 'SUSPENDED': 'INACTIVOS', 'PENDING': 'PENDIENTES' }[status] || status
                                        const isActive = statusFilter.includes(status)
                                        return (
                                            <Button
                                                key={status}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFilterToggle('status', status)}
                                                className={cn(
                                                    "rounded-full text-xs h-7 px-3 border border-transparent transition-all",
                                                    isActive
                                                        ? "bg-primary/20 text-primary border-primary/30 font-semibold hover:bg-primary/30"
                                                        : "bg-background/50 hover:bg-background border-border/50 text-muted-foreground"
                                                )}
                                            >
                                                {label}
                                            </Button>
                                        )
                                    })}
                                </div>

                                {/* Plan Row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-muted-foreground w-16 uppercase tracking-wider">Plan:</span>
                                    {['ALL', 'FREE', 'STARTER', 'PRO', 'AGENCY'].map((plan) => {
                                        const label = plan === 'ALL' ? 'TODOS' : plan
                                        const isActive = planFilter.includes(plan)

                                        // Colores para el filtro activo
                                        const activeColors = {
                                            'ALL': "bg-primary/20 text-primary border-primary/30",
                                            'FREE': "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                            'STARTER': "bg-violet-500/25 text-violet-400 border-violet-500/40",
                                            'PRO': "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                            'AGENCY': "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                        }[plan] || "bg-primary/20 text-primary border-primary/30"

                                        return (
                                            <Button
                                                key={plan}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFilterToggle('plan', plan)}
                                                className={cn(
                                                    "rounded-full text-[11px] h-7 px-4 border border-transparent transition-all font-bold tracking-tight",
                                                    isActive
                                                        ? activeColors
                                                        : "bg-background/50 hover:bg-background border-border/50 text-muted-foreground"
                                                )}
                                            >
                                                {label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[300px]">Negocio / Slug</TableHead>
                            <TableHead>Dueño</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Cargando negocios...
                                </TableCell>
                            </TableRow>
                        ) : paginatedTenants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTenants.map((tenant) => (
                                <TableRow
                                    key={tenant.id}
                                    className={cn(
                                        "transition-colors",
                                        searchParams.get('search') === tenant.slug && "bg-primary/5 animate-pulse-once"
                                    )}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border border-border/50 bg-muted">
                                                <AvatarImage src={tenant.owner?.avatarUrl} alt={tenant.owner?.name} className="object-cover" />
                                                <AvatarFallback className="font-bold text-xs text-muted-foreground">
                                                    {(tenant.owner?.name || tenant.name).substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{tenant.name}</span>
                                                <span className="text-xs text-muted-foreground font-mono">/{tenant.slug}</span>
                                            </div>
                                            {searchParams.get('search') === tenant.slug && (
                                                <Badge variant="default" className="ml-2 h-5 px-1.5 text-[10px] animate-bounce">
                                                    New
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{tenant.owner?.name} {tenant.owner?.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{tenant.owner?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 border-t-white/10 transition-all text-[10px]",
                                                getPlanStyles(tenant.owner?.plan)
                                            )}
                                        >
                                            {tenant.owner?.plan || 'FREE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'destructive'} className={cn(
                                            tenant.status === 'ACTIVE' ? "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20" : "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20"
                                        )}>
                                            {tenant.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(tenant.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setEditingTenant(tenant)
                                                    setIsEditOpen(true)
                                                }}>
                                                    <Edit className="mr-2 h-4 w-4" /> Editar Detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onImpersonateClick(tenant)} className="text-blue-600 focus:text-blue-600">
                                                    <LogIn className="mr-2 h-4 w-4" /> Ingresar como Dueño
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onSuspendClick(tenant)} className="text-amber-500 focus:text-amber-500">
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    {tenant.status === 'SUSPENDED' ? "Reactivar Servicio" : "Suspender Servicio"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onDeleteClick(tenant)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar Cuenta
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {filteredTenants.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredTenants.length)} de {filteredTenants.length} negocios
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium px-2">
                                Página {currentPage} de {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Tenant Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Negocio</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles principales del negocio.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre del Negocio</Label>
                            <Input
                                value={editingTenant?.name || ""}
                                onChange={(e) => setEditingTenant(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug (URL)</Label>
                            <Input
                                value={editingTenant?.slug || ""}
                                onChange={(e) => setEditingTenant(prev => prev ? { ...prev, slug: e.target.value } : null)}
                            />
                        </div>
                        {/* Owner email usually shouldn't be changed this simply as it links to Auth, 
                             keeping it read-only for now or adding specific mutation if requested */}
                        <div className="space-y-2">
                            <Label>Email del Dueño (Solo Lectura)</Label>
                            <Input
                                value={editingTenant?.owner?.email || ""}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button onClick={async () => {
                            if (!editingTenant) return
                            setIsSubmitting(true)
                            try {
                                const { updateTenant } = await import("@/app/actions/admin-tenants")
                                const result = await updateTenant(editingTenant.id, {
                                    name: editingTenant.name,
                                    slug: editingTenant.slug
                                })

                                if (result.success) {
                                    toast.success("Negocio actualizado")
                                    setIsEditOpen(false)
                                    fetchTenants()
                                } else {
                                    toast.error(result.error || "Error al actualizar")
                                }
                            } catch (e) {
                                console.error(e)
                                toast.error("Error de conexión")
                            } finally {
                                setIsSubmitting(false)
                            }
                        }} disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Alert Dialog */}
            <AlertDialog open={suspendAlertOpen} onOpenChange={setSuspendAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-amber-500">
                            <Ban className="h-5 w-5" />
                            ¿Suspender Negocio?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de suspender <strong>{targetTenant?.name}</strong>. Esto revocará el acceso inmediatamente.
                            <br /><br />
                            Para confirmar, escribe <strong>SUSPENDER</strong> abajo:
                        </AlertDialogDescription>
                        <Input
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder="Escribe SUSPENDER"
                            className="mt-4"
                        />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            disabled={confirmInput !== "SUSPENDER"}
                            onClick={confirmSuspend}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Suspender Negocio
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            ¿ELIMINAR Negocio Permanentemente?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción es <strong>IRREVERSIBLE</strong>. Se eliminarán permanentemente el negocio <strong>{targetTenant?.name}</strong> y TODOS sus datos asociados (clientes, stamps, configuraciones).
                            <br /><br />
                            Para confirmar que entiendes las consecuencias, escribe <strong>ELIMINAR</strong> abajo:
                        </AlertDialogDescription>
                        <Input
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder="Escribe ELIMINAR"
                            className="mt-4 border-destructive/50 focus-visible:ring-destructive"
                        />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            disabled={confirmInput !== "ELIMINAR"}
                            onClick={confirmDelete}
                        >
                            ELIMINAR DEFINITIVAMENTE
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Autologin Dialog */}
            <Dialog open={impersonateOpen} onOpenChange={setImpersonateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <LogIn className="h-5 w-5 text-blue-600" />
                            Ingresar como Dueño
                        </DialogTitle>
                        <DialogDescription>
                            Accede a la cuenta de <strong>{targetTenant?.name}</strong> sin contraseña.
                        </DialogDescription>
                    </DialogHeader>

                    {isGeneratingLink ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Generando llave de acceso...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex gap-2">
                                <span className="text-lg">⚠️</span>
                                <div>
                                    <strong>AVISO:</strong> Al entrar ahora, se cerrará tu sesión actual de Administrador para abrir la del cliente.
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Input value={impersonationLink} readOnly className="font-mono text-xs bg-muted" />
                                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                    <span className="sr-only">Copiar</span>
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11"
                                onClick={() => {
                                    if (impersonationLink) {
                                        window.location.href = impersonationLink
                                    }
                                }}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Entrar Ahora
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}
