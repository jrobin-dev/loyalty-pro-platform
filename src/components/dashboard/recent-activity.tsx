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
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/40">
                    <h3 className="text-xl font-bold font-display text-foreground">Actividad Reciente</h3>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                    Cargando...
                </div>
            </div>
        )
    }

    if (recentCustomers.length === 0) {
        return (
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/40">
                    <h3 className="text-xl font-bold font-display text-foreground">Actividad Reciente</h3>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                    <p className="mb-2 font-medium">No hay actividad reciente</p>
                    <p className="text-sm opacity-70">Los clientes aparecerán aquí cuando realicen transacciones</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-white dark:bg-card shadow-md overflow-hidden group/table">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-foreground">Actividad Reciente</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline transition-all">Ver todo</span>
            </div>
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Cliente</TableHead>
                        <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Stamps</TableHead>
                        <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Visitas</TableHead>
                        <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground font-bold text-xs uppercase tracking-wider">Última Visita</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentCustomers.map((customer) => {
                        const timeAgo = formatDistanceToNow(new Date(customer.last_visit), {
                            addSuffix: true,
                            locale: es
                        })

                        return (
                            <TableRow key={customer.id} className="border-border/40 hover:bg-secondary/30 transition-colors group">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border/40">
                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                {customer.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                        {customer.stamps}
                                    </span>
                                </TableCell>
                                <TableCell className="text-foreground/80 font-medium">
                                    {customer.visits}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold text-[10px] uppercase"
                                    >
                                        {customer.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground text-[10px] font-medium uppercase tracking-tighter">
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
