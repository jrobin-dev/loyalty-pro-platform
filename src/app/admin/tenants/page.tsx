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
import { Label } from "@/components/ui/label"
import { Search, Filter, MoreVertical, Edit, Trash2, Ban, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTenants, createTenant, updateTenantPlan, updateTenantStatus, updateTenant, deleteTenant } from "@/app/actions/admin-tenants"
import { toast } from "sonner"


export default function TenantsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [tenants, setTenants] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit Logic
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingTenant, setEditingTenant] = useState<{ id: string, name: string, slug: string } | null>(null)

    // Form States
    const [newName, setNewName] = useState("")
    const [newSlug, setNewSlug] = useState("")
    const [newOwnerEmail, setNewOwnerEmail] = useState("")
    const [newPlan, setNewPlan] = useState("FREE")

    useEffect(() => {
        fetchTenants()
    }, [])

    const fetchTenants = async () => {
        setIsLoading(true)
        try {
            const result = await getTenants()
            console.log("[TenantsPage] Result:", result) // Debug log
            if (result.success && result.data) {
                setTenants(result.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("name", newName)
            formData.append("slug", newSlug)
            formData.append("ownerEmail", newOwnerEmail)
            formData.append("plan", newPlan)

            const result = await createTenant(formData)

            if (result.success) {
                setIsCreateOpen(false)
                setNewName("")
                setNewSlug("")
                setNewOwnerEmail("")
                fetchTenants()
            } else {
                alert(result.error || "Error al crear cliente")
            }
        } catch (error) {
            console.error(error)
            alert("Ocurrió un error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleStatusChange = async (tenantId: string, newStatus: string) => {
        if (!confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return
        try {
            const result = await updateTenantStatus(tenantId, newStatus)
            if (result.success) {
                fetchTenants()
            } else {
                alert("Error al actualizar estado")
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Delete Logic
    const handleDeleteTenant = async (tenantId: string) => {
        if (!confirm("PELIGRO: ¿Estás seguro de eliminar este negocio y TODOS sus datos? Esta acción no se puede deshacer.")) return
        if (!confirm("¿De verdad? Se borrarán clientes, stamps y configuraciones.")) return

        try {
            const result = await deleteTenant(tenantId)
            if (result.success) {
                toast.success("Negocio eliminado correctamente")
                fetchTenants()
            } else {
                toast.error(result.error || "Error al eliminar")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error inesperado")
        }
    }

    const handleEditTenant = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTenant) return
        setIsSubmitting(true)
        try {
            const result = await updateTenant(editingTenant.id, {
                name: editingTenant.name,
                slug: editingTenant.slug
            })

            if (result.success) {
                setIsEditOpen(false)
                setEditingTenant(null)
                fetchTenants()
                toast.success("Negocio actualizado")
            } else {
                toast.error(result.error || "Error al actualizar")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error inesperado")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tenant.owner?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Gestión de Clientes</h1>
                    <p className="text-muted-foreground mt-1">Administra todos los negocios registrados en la plataforma.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                            + Nuevo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle>Registrar Nuevo Cliente SaaS</DialogTitle>
                            <DialogDescription>
                                Crea un nuevo espacio de trabajo (Tenant) asignado a un usuario existente.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateClient} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Negocio</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Cafetería Central"
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value)
                                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'))
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    placeholder="cafeteria-central"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">URL: loyalty.app/{newSlug}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email del Dueño (Usuario Existente)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    value={newOwnerEmail}
                                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Plan Inicial</Label>
                                <select
                                    id="plan"
                                    className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                    value={newPlan}
                                    onChange={(e) => setNewPlan(e.target.value)}
                                >
                                    <option value="FREE" className="bg-card text-foreground">Free</option>
                                    <option value="PRO" className="bg-card text-foreground">Pro</option>
                                    <option value="PLUS" className="bg-card text-foreground">Plus</option>
                                </select>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    {isSubmitting ? "Creando..." : "Crear Cliente"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex-1 relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, email o slug..."
                        className="pl-9 bg-background/50 border-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    Filtros
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl bg-card overflow-hidden shadow-sm border border-border">
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Negocio / Slug</TableHead>
                            <TableHead>Dueño</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Creado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Cargando datos...
                                </TableCell>
                            </TableRow>
                        ) : filteredTenants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No se encontraron clientes registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTenants.map((tenant) => (
                                <TableRow key={tenant.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center font-bold text-xs text-muted-foreground">
                                                {tenant.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{tenant.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">/{tenant.slug}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{tenant.owner?.name} {tenant.owner?.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{tenant.owner?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "font-mono text-xs px-2 py-1 rounded-md border",
                                            tenant.plan === 'PRO'
                                                ? 'bg-primary/10 text-primary border-primary/20'
                                                : tenant.plan === 'PLUS'
                                                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                        )}>
                                            {tenant.plan}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`
                                            ${tenant.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}
                                            ${tenant.status === 'SUSPENDED' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : ''}
                                            ${tenant.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : ''}
                                        `}>
                                            {tenant.status === 'ACTIVE' && 'Activo'}
                                            {tenant.status === 'SUSPENDED' && 'Suspendido'}
                                            {tenant.status === 'PENDING' && 'Pendiente'}
                                            {!tenant.status && 'Activo'} {/* Fallback */}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {new Date(tenant.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="gap-2 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingTenant({
                                                            id: tenant.id,
                                                            name: tenant.name,
                                                            slug: tenant.slug
                                                        })
                                                        setIsEditOpen(true)
                                                    }}
                                                >
                                                    <Edit size={14} /> Editar Detalles
                                                </DropdownMenuItem>
                                                {tenant.status !== 'ACTIVE' && (
                                                    <DropdownMenuItem
                                                        className="gap-2 cursor-pointer text-green-500 focus:text-green-500 focus:bg-green-500/10"
                                                        onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                                                    >
                                                        <CheckCircle2 size={14} /> Activar / Verificar
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                {tenant.status !== 'SUSPENDED' && (
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
                                                        onClick={() => handleStatusChange(tenant.id, 'SUSPENDED')}
                                                    >
                                                        <Ban size={14} /> Suspender Servicio
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
                                                    onClick={() => handleDeleteTenant(tenant.id)}
                                                >
                                                    <Trash2 size={14} /> Eliminar Cuenta
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Editar Negocio</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles principales del negocio.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditTenant} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nombre del Negocio</Label>
                            <Input
                                id="edit-name"
                                value={editingTenant?.name || ""}
                                onChange={(e) => setEditingTenant(prev => prev ? { ...prev, name: e.target.value } : null)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-slug">Slug (URL)</Label>
                            <Input
                                id="edit-slug"
                                value={editingTenant?.slug || ""}
                                onChange={(e) => setEditingTenant(prev => prev ? { ...prev, slug: e.target.value } : null)}
                                required
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
