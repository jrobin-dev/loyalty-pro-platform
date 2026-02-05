"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentTransactions = [
    {
        customer: "María González",
        email: "maria@gmail.com",
        amount: "S/. 45.00",
        stamps: "+1",
        status: "Completado",
        date: "Hace 2 min",
        avatar: "/avatars/01.png",
    },
    {
        customer: "Carlos Ruiz",
        email: "carlos.r@hotmail.com",
        amount: "S/. 120.00",
        stamps: "+2",
        status: "Completado",
        date: "Hace 15 min",
        avatar: "/avatars/02.png",
    },
    {
        customer: "Ana Lopez",
        email: "ana.lo@company.com",
        amount: "-",
        stamps: "-6 (Canje)",
        status: "Canjeado",
        date: "Hace 1 hora",
        avatar: "/avatars/03.png",
    },
    {
        customer: "Jorge Campos",
        email: "jorge@yahoo.com",
        amount: "S/. 25.00",
        stamps: "+1",
        status: "Completado",
        date: "Hace 3 horas",
        avatar: "/avatars/04.png",
    },
]

export function RecentActivityTable() {
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
                        <TableHead className="text-white/60">Monto</TableHead>
                        <TableHead className="text-white/60">Stamps</TableHead>
                        <TableHead className="text-white/60">Estado</TableHead>
                        <TableHead className="text-right text-white/60">Tiempo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTransactions.map((tx, i) => (
                        <TableRow key={i} className="border-white/10 hover:bg-white/5 group">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={tx.avatar} />
                                        <AvatarFallback>{tx.customer[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-white group-hover:text-[#00FF94] transition-colors">{tx.customer}</div>
                                        <div className="text-xs text-white/40">{tx.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-white/80">{tx.amount}</TableCell>
                            <TableCell>
                                <div className={`text-sm font-bold ${tx.stamps.includes('-') ? 'text-[#FF00E5]' : 'text-[#00FF94]'}`}>
                                    {tx.stamps}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={tx.status === 'Canjeado' ? 'secondary' : 'default'} className="bg-white/10 text-white hover:bg-white/20 border-0">
                                    {tx.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">{tx.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
