"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getAdminUserDetails, getAdminTenantCustomers } from "@/app/actions/admin-users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ChevronLeft,
    Store,
    Users,
    Mail,
    Phone,
    Zap,
    Building2,
    Clock,
    Calendar,
    ArrowRight,
    Star,
    LayoutDashboard,
    Lock,
    ExternalLink,
    Eye,
    Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function UserDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Client Detail State
    const [isClientsModalOpen, setIsClientsModalOpen] = useState(false)
    const [selectedTenant, setSelectedTenant] = useState<any>(null)
    const [clients, setClients] = useState<any[]>([])
    const [isClientsLoading, setIsClientsLoading] = useState(false)

    useEffect(() => {
        if (id) fetchUserDetails()
    }, [id])

    const fetchUserDetails = async () => {
        setIsLoading(true)
        const result = await getAdminUserDetails(id as string)
        if (result.success) {
            setUser(result.data)
        } else {
            toast.error(result.error || "Error al cargar detalles")
            router.push("/admin/users")
        }
        setIsLoading(false)
    }

    const handleViewClients = async (tenant: any) => {
        setSelectedTenant(tenant)
        setIsClientsModalOpen(true)
        setIsClientsLoading(true)

        const result = await getAdminTenantCustomers(tenant.id)
        if (result.success) {
            setClients(result.data)
        } else {
            toast.error("Error al cargar clientes")
        }
        setIsClientsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    if (!user) return null

    const getPlanStyles = (plan: string = 'FREE') => {
        switch (plan.toUpperCase()) {
            case 'FREE':
                return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
            case 'STARTER':
                return "bg-violet-500/20 text-violet-400 border-violet-500/30"
            case 'PRO':
                return "bg-amber-500/15 text-amber-500 border-amber-500/20"
            case 'AGENCY':
                return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
            default:
                return "bg-muted/50 text-muted-foreground border-border"
        }
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <Button
                    variant="ghost"
                    className="w-fit text-zinc-400 hover:text-white -ml-4"
                    onClick={() => router.push("/admin/users")}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver a Usuarios Globales
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="flex items-center gap-6 relative">
                        <Avatar className="w-20 h-20 border-2 border-white/10 shadow-2xl">
                            <AvatarImage src={user.avatarUrl} className="object-cover" />
                            <AvatarFallback className="text-xl font-black bg-zinc-800 text-zinc-400 uppercase">
                                {user.name?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-none">
                                    {user.name} {user.lastName}
                                </h1>
                                <Badge className={cn("text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md border", getPlanStyles(user.plan))}>
                                    Plan {user.plan}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-zinc-500 font-medium text-xs">
                                <span className="flex items-center gap-2 tracking-tight"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                                {user.phone && <span className="flex items-center gap-2 tracking-tight"><Phone className="h-3.5 w-3.5" /> {user.phone}</span>}
                                <span className="flex items-center gap-2 tracking-tight"><Clock className="h-3.5 w-3.5" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="flex flex-col items-center px-5 py-2.5 bg-zinc-800/30 rounded-2xl border border-white/5 min-w-[100px]">
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Negocios</span>
                            <span className="text-xl font-black text-white">{user.tenants?.length || 0}</span>
                        </div>
                        <div className="flex flex-col items-center px-5 py-2.5 bg-zinc-800/30 rounded-2xl border border-white/5 min-w-[100px]">
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Rol</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{user.role?.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business List Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="p-2 rounded-xl bg-zinc-800/50 border border-white/5">
                        <Store className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">Negocios Asociados</h2>
                </div>

                {user.tenants.length === 0 ? (
                    <Card className="bg-zinc-900/40 border-white/5 rounded-3xl border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-zinc-600">
                            <Building2 className="h-10 w-10 mb-4 opacity-10" />
                            <p className="font-bold uppercase tracking-tight text-xs">Este usuario no tiene negocios creados aún.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {user.tenants.map((tenant: any) => (
                            <motion.div
                                key={tenant.id}
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="bg-zinc-900 border-white/5 rounded-3xl overflow-hidden group shadow-lg border-none relative">
                                    <div className="p-6 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4 items-center">
                                                {/* Free Logo Container */}
                                                <div className="flex-shrink-0">
                                                    {tenant.branding?.logoUrl ? (
                                                        <img
                                                            src={tenant.branding.logoUrl}
                                                            className="h-12 w-auto object-contain max-w-[100px]"
                                                            alt={tenant.name}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center">
                                                            <Store className="h-5 w-5 text-zinc-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg font-black text-white uppercase tracking-tight">
                                                        {tenant.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-zinc-500 font-mono text-[10px] font-medium">
                                                        /{tenant.slug}
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            {/* ACTIVE Badge Inspired by Image 4 */}
                                            <div className={cn(
                                                "px-3 py-1 rounded-lg font-black text-[9px] tracking-widest uppercase flex items-center gap-1.5",
                                                tenant.status === 'ACTIVE'
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-destructive text-white"
                                            )}>
                                                {tenant.status === 'ACTIVE' ? <Zap className="h-3 w-3 fill-current" /> : <Lock className="h-3 w-3" />}
                                                {tenant.status}
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 pt-4 space-y-6">
                                        {/* Stats Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center group/stat relative overflow-hidden transition-all hover:bg-zinc-800">
                                                <Users className="h-4 w-4 text-zinc-600 mb-1.5" />
                                                <span className="text-xl font-black text-white leading-none mb-1">{tenant._count?.customers || 0}</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Clientes</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[8px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-md px-2"
                                                    onClick={() => handleViewClients(tenant)}
                                                >
                                                    <Eye className="h-2.5 w-2.5 mr-1" />
                                                    Ver Clientes
                                                </Button>
                                            </div>
                                            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                <Star className="h-4 w-4 text-zinc-600 mb-1.5" />
                                                <span className="text-xl font-black text-white leading-none mb-1">{tenant.loyalty?.stampsRequired || 0}</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SELLOS REQ.</span>
                                            </div>
                                            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                <Zap className="h-4 w-4 text-zinc-600 mb-1.5" />
                                                <span className="text-xl font-black text-white leading-none mb-1">{tenant.totalDistributedStamps || 0}</span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SELLOS REPARTIDOS</span>
                                            </div>
                                            <div className="bg-zinc-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                <Calendar className="h-4 w-4 text-zinc-600 mb-1.5" />
                                                <span className="text-[10px] font-black text-white leading-none mb-1 uppercase text-center">
                                                    {new Date(tenant.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">CREADO</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                className="flex-1 bg-white hover:bg-white/80 text-zinc-950 font-black text-xs h-12 rounded-2xl group/btn transition-all uppercase tracking-wider relative overflow-hidden"
                                                onClick={() => router.push(`/admin/tenants?search=${tenant.slug}`)}
                                            >
                                                <span className="relative z-10 flex items-center justify-center">
                                                    Gestionar Negocio
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clients Detail Modal */}
            <Dialog open={isClientsModalOpen} onOpenChange={setIsClientsModalOpen}>
                <DialogContent className="max-w-4xl bg-[#0c0c0c] border-white/10 text-white rounded-3xl p-0 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <DialogHeader className="p-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <Users className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                    Clientes de {selectedTenant?.name}
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 font-medium text-xs">
                                    Listado detallado de usuarios registrados en este negocio.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="rounded-2xl border border-white/5 bg-zinc-900/20 overflow-hidden">
                            <div className="max-h-[500px] overflow-y-auto thin-scrollbar">
                                <Table>
                                    <TableHeader className="bg-zinc-900/50 sticky top-0 z-10">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-zinc-500 font-black text-[9px] uppercase tracking-widest pl-6">Cliente</TableHead>
                                            <TableHead className="text-zinc-500 font-black text-[9px] uppercase tracking-widest">Contacto</TableHead>
                                            <TableHead className="text-zinc-500 font-black text-[9px] uppercase tracking-widest">Registro</TableHead>
                                            <TableHead className="text-zinc-500 font-black text-[9px] uppercase tracking-widest text-right pr-6">Sellos</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isClientsLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Cargando...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : clients.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3 text-zinc-700">
                                                        <Users className="h-8 w-8 opacity-10" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Sin clientes registrados</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            clients.map((client) => (
                                                <TableRow key={client.id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8 border border-white/5 shadow-sm">
                                                                <AvatarImage src={client.user?.avatarUrl} className="object-cover" />
                                                                <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">
                                                                    {client.user?.name?.charAt(0) || 'C'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-bold text-white text-sm">{client.user?.name || 'Cliente sin nombre'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-zinc-400 font-medium">{client.user?.email}</span>
                                                            <span className="text-[9px] text-zinc-600 font-mono">{client.user?.phone || 'Sin número'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-2 text-zinc-500">
                                                            <Calendar className="h-3 w-3" />
                                                            <span className="text-xs font-medium">{new Date(client.joinedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/80 rounded-full border border-white/5">
                                                                <Star className="h-3 w-3 text-emerald-500" />
                                                                <span className="text-xs font-black text-white">{client.currentStamps}</span>
                                                            </div>
                                                            <span className="text-[8px] font-black text-zinc-700 mt-1 uppercase">Total: {client.totalStamps}</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
