"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getAdminUserDetails } from "@/app/actions/admin-users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function UserDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

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
                return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]"
            case 'STARTER':
                return "bg-violet-500/20 text-violet-400 border-violet-500/30 shadow-[0_0_20px_-3px_rgba(139,92,246,0.2)]"
            case 'PRO':
                return "bg-amber-500/15 text-amber-500 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]"
            case 'AGENCY':
                return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)]"
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

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none" />

                    <div className="flex items-center gap-6 relative">
                        <Avatar className="w-24 h-24 border-2 border-white/10 ring-4 ring-emerald-500/10 shadow-2xl">
                            <AvatarImage src={user.avatarUrl} className="object-cover" />
                            <AvatarFallback className="text-2xl font-black bg-zinc-800 text-zinc-400">
                                {user.name?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                                    {user.name} {user.lastName}
                                </h1>
                                <Badge className={cn("text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg border", getPlanStyles(user.plan))}>
                                    Plan {user.plan}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-zinc-400 font-medium text-sm">
                                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-zinc-500" /> {user.email}</span>
                                {user.phone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-zinc-500" /> {user.phone}</span>}
                                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-zinc-500" /> Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="flex flex-col items-center px-6 py-3 bg-zinc-800/50 rounded-2xl border border-white/5">
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Negocios</span>
                            <span className="text-2xl font-black text-emerald-400">{user.tenants?.length || 0}</span>
                        </div>
                        <div className="flex flex-col items-center px-6 py-3 bg-zinc-800/50 rounded-2xl border border-white/5">
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Rol</span>
                            <span className="text-xs font-black text-zinc-300 uppercase tracking-tighter">{user.role?.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business List Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Store className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-white uppercase">Negocios Asociados</h2>
                </div>

                {user.tenants.length === 0 ? (
                    <Card className="bg-zinc-900/40 border-white/5 rounded-[2rem] border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-zinc-500">
                            <Building2 className="h-12 w-12 mb-4 opacity-20" />
                            <p className="font-bold">Este usuario no tiene negocios creados aún.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {user.tenants.map((tenant: any) => (
                            <motion.div
                                key={tenant.id}
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Card className="bg-zinc-900/50 border-white/5 rounded-[2.5rem] overflow-hidden group shadow-xl">
                                    <div className="p-1 h-2 relative">
                                        <div
                                            className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity"
                                            style={{ backgroundColor: tenant.branding?.primaryColor || '#10b981' }}
                                        />
                                    </div>
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center shadow-inner overflow-hidden">
                                                    {tenant.branding?.logoUrl ? (
                                                        <img src={tenant.branding.logoUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Store className="h-6 w-6 text-zinc-600" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                                                        {tenant.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-zinc-500 font-mono text-xs">
                                                        /{tenant.slug}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'destructive'} className="rounded-lg font-black text-[9px] tracking-widest uppercase">
                                                {tenant.status === 'ACTIVE' ? <Zap className="h-3 w-3 mr-1 fill-current" /> : <Lock className="h-3 w-3 mr-1" />}
                                                {tenant.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-4 space-y-6">
                                        {/* Stats Bar */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-white/[0.02] flex flex-col items-center">
                                                <Users className="h-4 w-4 text-zinc-600 mb-2" />
                                                <span className="text-lg font-black text-white">{tenant._count?.customers || 0}</span>
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Clientes</span>
                                            </div>
                                            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-white/[0.02] flex flex-col items-center">
                                                <Star className="h-4 w-4 text-zinc-600 mb-2" />
                                                <span className="text-lg font-black text-white">{tenant.loyalty?.stampsRequired || 0}</span>
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Stamps Req.</span>
                                            </div>
                                            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-white/[0.02] flex flex-col items-center">
                                                <Calendar className="h-4 w-4 text-zinc-600 mb-2" />
                                                <span className="text-sm font-black text-white">{new Date(tenant.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Creado</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs h-12 rounded-2xl group/btn transition-all"
                                                onClick={() => router.push(`/admin/tenants?search=${tenant.slug}`)}
                                            >
                                                Gestionar Negocio
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-12 h-12 rounded-2xl border-white/5 bg-zinc-800/30 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                                                onClick={() => window.open(`/dashboard?tenant=${tenant.id}`, '_blank')}
                                            >
                                                <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
