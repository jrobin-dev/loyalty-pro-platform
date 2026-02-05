"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCustomers } from "@/hooks/use-customers"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function RecentActivityTable() {
    const { customers, loading } = useCustomers()

    // Show only the 5 most recent customers
    const recentCustomers = customers.slice(0, 5)

    if (loading) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-funnel-display)]">Actividad Reciente</h3>
                </div>
                <div className="p-8 text-center text-white/40">
                    Cargando...
                </div>
            </div>
        )
    }

    if (recentCustomers.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-funnel-display)]">Actividad Reciente</h3>
                </div>
                <div className="p-8 text-center text-white/40">
                    <p className="mb-2">No hay actividad reciente</p>
                    <p className="text-sm">Los clientes aparecerán aquí cuando realicen transacciones</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold font-[family-name:var(--font-funnel-display)]">Actividad Reciente</h3>
                <span className="text-xs text-[#00FF94] cursor-pointer hover:underline">Ver todo</span>
            </div>
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/60">Cliente</TableHead>
                        <TableHead className="text-white/60">Stamps</TableHead>
                        <TableHead className="text-white/60">Visitas</TableHead>
                        <TableHead className="text-white/60">Estado</TableHead>
                        <TableHead className="text-right text-white/60">Última Visita</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentCustomers.map((customer) => {
                        const timeAgo = formatDistanceToNow(new Date(customer.last_visit), {
                            addSuffix: true,
                            locale: es
                        })

                        return (
                            <TableRow key={customer.id} className="border-white/10 hover:bg-white/5 group">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/20 text-primary">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-white group-hover:text-[#00FF94] transition-colors">
                                                {customer.name}
                                            </div>
                                            <div className="text-xs text-white/40">{customer.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-bold text-[#00FF94]">
                                        {customer.stamps}
                                    </div>
                                </TableCell>
                                <TableCell className="text-white/80">
                                    {customer.visits}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="default"
                                        className="bg-white/10 text-white hover:bg-white/20 border-0"
                                    >
                                        {customer.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">
                                    {timeAgo}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
