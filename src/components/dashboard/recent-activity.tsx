"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { useCustomers } from "@/hooks/use-customers"
import { useTenantDate } from "@/hooks/use-tenant-date"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export function RecentActivityTable() {
    const { customers, loading } = useCustomers()
    const { formatDate } = useTenantDate()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Pagination Logic
    // Customers are already sorted globally by useCustomers
    const totalPages = Math.ceil(customers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }

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

    if (customers.length === 0) {
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
        <div className="rounded-2xl border border-border bg-white dark:bg-card shadow-md overflow-hidden group/table flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-foreground">Actividad Reciente</h3>
                <Link href="/dashboard/customers" className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline transition-all">
                    Ver todo
                </Link>
            </div>

            <div className="w-full">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow className="border-border/40 hover:bg-transparent">
                            <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Cliente</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Stamps</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Visitas</TableHead>
                            <TableHead className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Estado</TableHead>
                            <TableHead className="text-right text-muted-foreground font-bold text-xs uppercase tracking-wider">Última Visita</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers.map((customer) => {
                            const formattedDate = formatDate(customer.last_visit, "d MMM, HH:mm")

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
                                        {formattedDate}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls - Consistent Design */}
            {customers.length > itemsPerPage && (
                <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">
                        Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, customers.length)} de {customers.length}
                    </div>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="h-7 text-[10px] uppercase font-bold tracking-wider bg-background border-border hover:bg-muted"
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center justify-center min-w-[24px] h-7 rounded-md bg-muted text-[10px] font-bold text-foreground">
                            {currentPage}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="h-7 text-[10px] uppercase font-bold tracking-wider bg-background border-border hover:bg-muted"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
