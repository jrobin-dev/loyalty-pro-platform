import { ScrollArea } from "@/components/ui/scroll-area"
import { Coffee, Star, Calendar } from "lucide-react"

const transactions = [
    { id: 1, type: "stamp", amount: 1, location: "Sucursal Central", date: "Hoy, 10:23 AM" },
    { id: 2, type: "reward", amount: -10, location: "Sucursal Norte", date: "Ayer, 4:15 PM" },
    { id: 3, type: "stamp", amount: 2, location: "Sucursal Central", date: "02 Feb, 9:00 AM" },
]

export const TransactionHistory = () => {
    return (
        <div className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Actividad Reciente</h3>
                <button className="text-xs text-primary hover:underline">Ver todo</button>
            </div>
            <ScrollArea className="h-[200px] w-full p-4">
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 transition-colors ${tx.type === 'stamp' ? 'bg-[#00FF94]/10 text-[#00FF94] group-hover:bg-[#00FF94]/20' : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'}`}>
                                    {tx.type === 'stamp' ? <Coffee size={18} /> : <Star size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {tx.type === 'stamp' ? 'Consumo' : 'Canje de Premio'}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                                        <Calendar size={10} />
                                        <span>{tx.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`font-mono font-bold text-sm ${tx.type === 'stamp' ? 'text-[#00FF94]' : 'text-purple-400'}`}>
                                {tx.type === 'stamp' ? '+' : ''}{tx.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
