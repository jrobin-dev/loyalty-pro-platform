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
import { Search, Filter, MoreVertical, Trash2, CheckCircle2, RefreshCw, Download, UserPlus, Shield, ExternalLink, Mail, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAdminUsers, updateUserAdmin, deleteUserAdmin, sendBulkInvitations } from "@/app/actions/admin-users"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const ITEMS_PER_PAGE = 15

export default function UsersPage() {
    const router = useRouter()
    // Data State
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [planFilter, setPlanFilter] = useState<string[]>(["ALL"])
    const [roleFilter, setRoleFilter] = useState<string[]>(["ALL"])

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)

    // Safety Alert States
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [targetUser, setTargetUser] = useState<any>(null)
    const [confirmInput, setConfirmInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Invitation State
    const [inviteEmails, setInviteEmails] = useState("")
    const [inviteRole, setInviteRole] = useState("BUSINESS_OWNER")
    const [invitePlan, setInvitePlan] = useState("FREE")

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleBulkInvite = async () => {
        const emails = inviteEmails.split("\n").map(e => e.trim()).filter(e => e.length > 5 && e.includes("@"))
        if (emails.length === 0) {
            toast.error("Ingresa al menos un correo válido")
            return
        }

        setIsSubmitting(true)
        const result = await sendBulkInvitations(emails, inviteRole, invitePlan)
        if (result.success) {
            toast.success(`${result.count} invitaciones enviadas correctamente`)
            setIsInviteOpen(false)
            setInviteEmails("")
        } else {
            toast.error("Error al enviar invitaciones")
        }
        setIsSubmitting(false)
    }

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const result = await getAdminUsers()
            if (result.success && result.data) {
                setUsers(result.data)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error al cargar usuarios")
        } finally {
            setIsLoading(false)
        }
    }

    // --- Filtering Logic ---
    const filteredUsers = users.filter(user => {
        // 1. Search Term
        const matchesSearch =
            (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        // 2. Plan Filter
        const matchesPlan = planFilter.includes("ALL") || planFilter.includes(user.plan)

        // 3. Role Filter
        const matchesRole = roleFilter.includes("ALL") || roleFilter.includes(user.role)

        return matchesSearch && matchesPlan && matchesRole
    })

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleFilterToggle = (type: 'role' | 'plan', value: string) => {
        const currentFilter = type === 'role' ? roleFilter : planFilter
        const setFilter = type === 'role' ? setRoleFilter : setPlanFilter

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

    const onUpdatePlan = async (userId: string, newPlan: string) => {
        const result = await updateUserAdmin(userId, { plan: newPlan })
        if (result.success) {
            toast.success("Plan actualizado")
            fetchUsers()
        } else {
            toast.error("Error al actualizar plan")
        }
    }

    const onUpdateRole = async (userId: string, newRole: string) => {
        const result = await updateUserAdmin(userId, { role: newRole })
        if (result.success) {
            toast.success("Rol actualizado")
            fetchUsers()
        } else {
            toast.error("Error al actualizar rol")
        }
    }

    const onDeleteClick = (user: any) => {
        setTargetUser(user)
        setConfirmInput("")
        setDeleteAlertOpen(true)
    }

    const confirmDelete = async () => {
        if (!targetUser) return
        setIsSubmitting(true)
        const result = await deleteUserAdmin(targetUser.id)
        if (result.success) {
            toast.success("Usuario eliminado permanentemente")
            fetchUsers()
        } else {
            toast.error("Error al eliminar usuario")
        }
        setIsSubmitting(false)
        setDeleteAlertOpen(false)
    }

    const handleExport = () => {
        if (users.length === 0) {
            toast.error("No hay datos para exportar")
            return
        }

        const headers = ["ID", "Nombre", "Apellido", "Email", "Plan", "Rol", "Negocios", "Creado"]
        const csvContent = [
            headers.join(","),
            ...users.map(u => [
                u.id,
                `"${u.name || ''}"`,
                `"${u.lastName || ''}"`,
                u.email,
                u.plan,
                u.role,
                u.tenants?.length || 0,
                new Date(u.createdAt).toISOString()
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `usuarios_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Archivo CSV descargado")
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
                return "bg-muted/50 text-muted-foreground border-border"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative flex-1 w-full md:max-w-xl">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

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

                        <Button variant="outline" className="gap-2 h-9" onClick={fetchUsers}>
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refrescar
                        </Button>

                        <Button
                            className="gap-2 h-9 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                            onClick={() => setIsInviteOpen(true)}
                        >
                            <UserPlus size={16} />
                            Invitar Usuario
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-muted/30 border border-border/50 rounded-lg overflow-hidden"
                        >
                            <div className="p-4 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-muted-foreground w-16 uppercase tracking-wider">Plan:</span>
                                    {['ALL', 'FREE', 'STARTER', 'PRO', 'AGENCY'].map((plan) => (
                                        <Button
                                            key={plan}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFilterToggle('plan', plan)}
                                            className={cn(
                                                "rounded-full text-[11px] h-7 px-4 border border-transparent transition-all font-bold tracking-tight",
                                                planFilter.includes(plan)
                                                    ? {
                                                        'ALL': "bg-primary/20 text-primary border-primary/30",
                                                        'FREE': "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                                        'STARTER': "bg-violet-500/25 text-violet-400 border-violet-500/40",
                                                        'PRO': "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                                        'AGENCY': "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                                    }[plan] || "bg-primary/20 text-primary border-primary/30"
                                                    : "bg-background/50 hover:bg-background border-border/50 text-muted-foreground"
                                            )}
                                        >
                                            {plan === 'ALL' ? 'TODOS' : plan}
                                        </Button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-bold text-muted-foreground w-16 uppercase tracking-wider">Rol:</span>
                                    {['ALL', 'SUPER_ADMIN', 'BUSINESS_OWNER', 'END_USER'].map((role) => (
                                        <Button
                                            key={role}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFilterToggle('role', role)}
                                            className={cn(
                                                "rounded-full text-[11px] h-7 px-4 border border-transparent transition-all font-bold tracking-tight",
                                                roleFilter.includes(role)
                                                    ? "bg-primary/20 text-primary border-primary/30"
                                                    : "bg-background/50 hover:bg-background border-border/50 text-muted-foreground"
                                            )}
                                        >
                                            {role === 'ALL' ? 'TODOS' : role.replace('_', ' ')}
                                        </Button>
                                    ))}
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
                            <TableHead className="w-[300px]">Usuario</TableHead>
                            <TableHead>Negocios</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Registro</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Cargando usuarios...
                                </TableCell>
                            </TableRow>
                        ) : paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((user) => (
                                <TableRow key={user.id} className="transition-colors hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border border-border/50 bg-muted">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                                                <AvatarFallback className="font-bold text-xs text-muted-foreground">
                                                    {(user.name || 'U').substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{user.name} {user.lastName}</span>
                                                <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="secondary" className="w-fit h-5 px-1.5 text-[10px]">
                                                {user.tenants?.length || 0} Negocios
                                            </Badge>
                                            {user.tenants && user.tenants.length > 0 && (
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {user.tenants.slice(0, 2).map((t: any) => (
                                                        <span key={t.id} className="text-[10px] text-muted-foreground bg-muted px-1 rounded truncate">
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                    {user.tenants.length > 2 && (
                                                        <span className="text-[10px] text-muted-foreground">+{user.tenants.length - 2}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "cursor-pointer font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 border-t-white/5 transition-all text-[10px]",
                                                        getPlanStyles(user.plan)
                                                    )}
                                                >
                                                    {user.plan || 'FREE'}
                                                </Badge>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Cambiar Plan</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {['FREE', 'STARTER', 'PRO', 'AGENCY'].map((p) => (
                                                    <DropdownMenuItem
                                                        key={p}
                                                        onClick={() => onUpdatePlan(user.id, p)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full ring-1 ring-white/10 shadow-sm transition-transform group-hover:scale-125",
                                                            p === 'FREE' ? 'bg-emerald-400' :
                                                                p === 'STARTER' ? 'bg-violet-400' :
                                                                    p === 'PRO' ? 'bg-amber-400' : 'bg-cyan-400'
                                                        )} />
                                                        <span className={cn(
                                                            "text-[11px] font-bold uppercase",
                                                            p === user.plan ? "text-primary" : "text-muted-foreground"
                                                        )}>
                                                            {p}
                                                        </span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Badge variant="outline" className="cursor-pointer text-[10px] h-5 px-1.5 uppercase font-mono bg-muted/30">
                                                    {user.role}
                                                </Badge>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground tracking-widest">Cambiar Rol</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {['SUPER_ADMIN', 'BUSINESS_OWNER', 'END_USER'].map((r) => (
                                                    <DropdownMenuItem key={r} onClick={() => onUpdateRole(user.id, r)} className="text-[11px]">
                                                        {r.replace('_', ' ')}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
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
                                                <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                                    <UserCheck className="mr-2 h-4 w-4" /> Ver Perfil
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => window.open(`mailto:${user.email}`)}>
                                                    <Mail className="mr-2 h-4 w-4" /> Enviar Correo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled>
                                                    <Shield className="mr-2 h-4 w-4" /> Forzar Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onDeleteClick(user)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar Usuario
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

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-background">
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages || 1}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

            {/* Invitation Modal */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <UserPlus className="h-5 w-5 text-emerald-500" />
                            </div>
                            Invitación de nuevos usuarios
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Envía invitaciones de registro a una lista de correos electrónicos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-8 py-4 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-zinc-300 font-medium">Correos electrónicos (uno por línea)</Label>
                            <Textarea
                                placeholder="usuario1@email.com&#10;usuario2@email.com"
                                className="min-h-[140px] bg-zinc-900/50 border-white/5 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-2xl resize-none placeholder:text-zinc-700"
                                value={inviteEmails}
                                onChange={(e) => setInviteEmails(e.target.value)}
                            />
                            <p className="text-[11px] text-zinc-500 italic">
                                * Se enviará un enlace de registro pre-configurado a cada dirección.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-zinc-300 font-medium">Rol asignado</Label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger className="bg-zinc-900/50 border-white/5 rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                        <SelectItem value="BUSINESS_OWNER">Dueño de negocio</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">Administrador</SelectItem>
                                        <SelectItem value="END_USER">Usuario final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-zinc-300 font-medium">Plan inicial</Label>
                                <Select value={invitePlan} onValueChange={setInvitePlan}>
                                    <SelectTrigger className="bg-zinc-900/50 border-white/5 rounded-xl h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                        <SelectItem value="FREE">Gratis</SelectItem>
                                        <SelectItem value="STARTER">Starter</SelectItem>
                                        <SelectItem value="PRO">Pro</SelectItem>
                                        <SelectItem value="AGENCY">Agency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-4 flex flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsInviteOpen(false)}
                            className="flex-1 h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="flex-[1.5] h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                            onClick={handleBulkInvite}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Enviar invitaciones
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white rounded-[2rem] p-8 shadow-2xl max-w-md">
                    <AlertDialogHeader className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-2">
                            <Trash2 className="h-7 w-7 text-red-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-semibold tracking-tight">
                            ¿Eliminar usuario permanentemente?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400 text-base leading-relaxed">
                            Esta acción eliminará al usuario <span className="text-white font-medium">{targetUser?.email}</span> y <span className="text-red-400">todos sus negocios asociados</span> de forma irreversible.
                        </AlertDialogDescription>

                        <div className="pt-4 space-y-3">
                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Confirma escribiendo eliminar</p>
                            <Input
                                value={confirmInput}
                                onChange={(e) => setConfirmInput(e.target.value.toLowerCase())}
                                placeholder="escribe eliminar"
                                className="h-12 bg-zinc-900/50 border-white/5 focus:border-red-500/50 focus:ring-red-500/20 rounded-xl placeholder:text-zinc-700"
                            />
                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-8 flex flex-row gap-3">
                        <AlertDialogCancel className="flex-1 h-12 rounded-xl bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={confirmInput !== "eliminar" || isSubmitting}
                            className="flex-[1.5] h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 border-none transition-all"
                        >
                            {isSubmitting ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                "Eliminar usuario"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
