import { ScrollArea } from "@/components/ui/scroll-area"
import { Coffee, Star, Calendar, TrendingUp, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
    id: string
    type: string // EARNED, REDEEMED
    amount: number
    description: string | null
    createdAt: string
    stampsEarned: number
}

interface TransactionHistoryProps {
    transactions?: Transaction[]
    currency?: string
    className?: string
    primaryColor?: string
}

export const TransactionHistory = ({ transactions = [], currency = "$", className, primaryColor = "#ffffff" }: TransactionHistoryProps) => {
    if (transactions.length === 0) {
        return (
            <div className={cn("bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md p-8 text-center flex flex-col", className)}>
                <h3 className="text-white font-bold text-lg mb-2 text-left shrink-0">Actividad Reciente</h3>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-white/40 text-sm">Aún no tienes actividad reciente.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-4 relative", className)}>
            <h3 className="font-bold text-xl text-white shrink-0 z-10">Actividad Reciente</h3>

            <div className="flex-1 min-h-0 relative">
                <div
                    className="absolute inset-0 overflow-y-auto pr-2 space-y-3 py-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)'
                    }}
                >
                    {transactions.map((tx) => {
                        const isEarned = tx.type === 'EARNED'
                        const date = new Date(tx.createdAt)
                        const formattedDate = date.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        const formattedTime = date.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })

                        return (
                            <div
                                key={tx.id}
                                className="border p-4 rounded-2xl flex items-center justify-between group transition-colors relative z-0"
                                style={{
                                    backgroundColor: `${primaryColor}08`, // ~3% opacity
                                    borderColor: `${primaryColor}20`      // ~12% opacity
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: isEarned ? `${primaryColor}20` : 'rgba(168, 85, 247, 0.2)',
                                            color: isEarned ? primaryColor : '#a855f7'
                                        }}
                                    >
                                        {isEarned ? <TrendingUp size={24} /> : <Gift size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-base">
                                            {isEarned ? 'Consumo' : 'Canje de Premio'}
                                        </p>
                                        <p className="text-xs text-white/50 capitalize">
                                            {formattedDate} a las {formattedTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {tx.amount > 0 && (
                                        <p className="font-bold text-white text-lg font-[family-name:var(--font-funnel-display)]">
                                            {currency} {tx.amount.toFixed(2)}
                                        </p>
                                    )}
                                    <p
                                        className="text-xs font-bold"
                                        style={{ color: isEarned ? primaryColor : '#a855f7' }}
                                    >
                                        {isEarned ? '+' : ''}{tx.stampsEarned} {tx.stampsEarned === 1 ? 'sello' : 'sellos'}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
