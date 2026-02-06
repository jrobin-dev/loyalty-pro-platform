"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Customer } from "@/hooks/use-customers"
import { History, TrendingUp, TrendingDown, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CustomerHistoryModalProps {
    customer: Customer | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface Transaction {
    id: string
    created_at: string
    amount: number
    stamps_earned: number
    type: 'consumption' | 'reward'
}

export function CustomerHistoryModal({ customer, open, onOpenChange }: CustomerHistoryModalProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    const { settings } = useTenantSettings()
    const currency = settings?.branding.currency || '$'

    useEffect(() => {
        if (customer && open) {
            fetchTransactions()
        }
    }, [customer, open])

    const fetchTransactions = async () => {
        if (!customer) return

        setLoading(true)
        try {
            const supabase = createClient()

            // Fetch real transactions from StampTransaction table
            const { data, error } = await supabase
                .from('StampTransaction')
                .select('*')
                .eq('customerId', customer.id)
                .order('createdAt', { ascending: false })

            if (error) {
                console.error('Error fetching transactions:', error)
                setTransactions([])
                return
            }

            // Transform data to match Transaction interface
            const transformedTransactions: Transaction[] = (data || []).map((txn: any) => ({
                id: txn.id,
                created_at: txn.createdAt,
                amount: txn.amount || 0,
                stamps_earned: txn.stampsEarned || 1,
                type: txn.type === 'REDEEMED' ? 'reward' : 'consumption'
            }))

            setTransactions(transformedTransactions)
        } catch (error) {
            console.error('Error fetching transactions:', error)
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }

    if (!customer) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0a0a0a] border-transparent max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <History className="h-6 w-6 text-blue-400" />
                        Historial de Consumos
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        {customer.name} - {transactions.length} transacciones
                    </p>
                </DialogHeader>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Cargando historial...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay transacciones registradas
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="bg-card/50 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${transaction.type === 'reward'
                                            ? 'bg-yellow-500/20'
                                            : 'bg-emerald-500/20'
                                            }`}>
                                            {transaction.type === 'reward' ? (
                                                <Award className="h-5 w-5 text-yellow-400" />
                                            ) : (
                                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {transaction.type === 'reward' ? 'Premio Canjeado' : 'Consumo'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(transaction.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">
                                            {currency} {transaction.amount.toFixed(2)}
                                        </p>
                                        <p className={`text-xs ${transaction.type === 'reward'
                                            ? 'text-red-400'
                                            : 'text-emerald-400'
                                            }`}>
                                            {transaction.type === 'reward'
                                                ? `-10 sellos`
                                                : `+${transaction.stamps_earned} sello${transaction.stamps_earned > 1 ? 's' : ''}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
