"use client"

import { useState } from "react"
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
import { Search, Filter, MoreVertical, Edit, Trash2, Ban, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock Data for Tenants
const tenants = [
    {
        id: "1",
        name: "Café de la Esquina",
        slug: "cafe-esquina",
        owner: "Juan Pérez",
        email: "juan@cafe.com",
        plan: "Free",
        status: "active",
        createdAt: "2024-01-15",
        lastActive: "Hace 2 mins",
        revenue: "$0.00"
    },
    {
        id: "2",
        name: "Burger House Lima",
        slug: "burger-house",
        owner: "Maria Lopez",
        email: "maria@burger.com",
        plan: "Pro",
        status: "active",
        createdAt: "2024-01-10",
        lastActive: "Hace 15 mins",
        revenue: "$50.00"
    },
    {
        id: "3",
        name: "Spa & Wellness Center",
        slug: "spa-wellness",
        owner: "Sofia Rodriguez",
        email: "sofia@spa.com",
        plan: "Pro",
        status: "suspended",
        createdAt: "2024-01-05",
        lastActive: "Hace 2 días",
        revenue: "$50.00"
    },
    {
        id: "4",
        name: "Barbería El Bigote",
        slug: "barberia-bigote",
        owner: "Carlos Ruiz",
        email: "carlos@barber.com",
        plan: "Free",
        status: "pending_verification",
        createdAt: "2024-02-01",
        lastActive: "Hace 5 horas",
        revenue: "$0.00"
    },
]

export default function TenantsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Gestión de Tenants</h1>
                    <p className="text-muted-foreground mt-1">Administra todos los negocios registrados en la plataforma.</p>
                </div>
                <Button className="bg-[#FF00E5] hover:bg-[#D600C0] text-white font-medium">
                    + Nuevo Tenant Manual
                </Button>
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
            <div className="rounded-xl bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Negocio / Slug</TableHead>
                            <TableHead>Dueño</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Revenue (LTV)</TableHead>
                            <TableHead className="text-right">Última Act.</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenants.map((tenant) => (
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
                                        <span className="text-sm">{tenant.owner}</span>
                                        <span className="text-xs text-muted-foreground">{tenant.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                                        ${tenant.plan === 'Pro'
                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-500 border-indigo-500/20'
                                            : 'bg-muted text-muted-foreground'}
                                    `}>
                                        {tenant.plan}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={`
                                        ${tenant.status === 'active' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}
                                        ${tenant.status === 'suspended' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : ''}
                                        ${tenant.status === 'pending_verification' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' : ''}
                                    `}>
                                        {tenant.status === 'active' && 'Activo'}
                                        {tenant.status === 'suspended' && 'Suspendido'}
                                        {tenant.status === 'pending_verification' && 'Pendiente'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {tenant.revenue}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    {tenant.lastActive}
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
                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                <Edit size={14} /> Editar Detalles
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                <CheckCircle2 size={14} /> Verificar Manualmente
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                                                <Ban size={14} /> Suspender Servicio
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
