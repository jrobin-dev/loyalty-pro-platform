"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Check, Loader2, Minus, Plus, RefreshCw, Coffee, Gift } from "lucide-react"
import Link from "next/link"
import { useTenantSettings } from "@/hooks/use-tenant-settings"
import { formatNumber } from "@/lib/utils"

export default function ScannerPage() {
    const [scannedData, setScannedData] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [customer, setCustomer] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [moneyAmount, setMoneyAmount] = useState("")
    const { settings } = useTenantSettings()
    const currency = settings?.tenant.currency || 'S/'

    const handleScan = async (result: any) => {
        if (result && result.length > 0 && !scannedData) {
            const rawValue = result[0].rawValue
            setScannedData(rawValue)
            fetchCustomer(rawValue)
        }
    }

    const fetchCustomer = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/customers/${id}`)
            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            setCustomer(data)
            toast.promise(Promise.resolve(), {
                loading: 'Detectando cliente...',
                success: 'Cliente identificado',
                error: 'Error'
            })
        } catch (err: any) {
            toast.error("Error: " + err.message)
            setScannedData(null) // Reset to scan again
        } finally {
            setIsLoading(false)
        }
    }

    const handleTransaction = async (type: 'EARN' | 'REDEEM') => {
        if (!customer) return
        setIsProcessing(true)

        // Logic: 1 Stamp per Visit (Confirmar Visita)
        // If Redeeming, we might want to redeem all needed for a reward or just 1? 
        // For simplicity in this logic update, we assume redeeming consumes necessary stamps for 1 reward (e.g. 10) or just 1.
        // Let's assume standard redeem is consuming full reward cost, but for now let's keep it simple or strictly follow "1 stamp logic" for earning.
        // "REDEEM" usually implies getting the reward. 

        const amount = type === 'EARN' ? 1 : 10 // Assuming 10 stamps = 1 Reward default, or we could make this dynamic later.
        const description = type === 'EARN'
            ? `Visita Registrada (Consumo: ${currency} ${formatNumber(moneyAmount)})`
            : 'Canje de Premio (Scanner)'

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: customer.id,
                    type,
                    amount: amount,
                    description: description
                })
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error)

            toast.success(type === 'EARN' ? `+1 Stamp añadido!` : `Premio Canjeado! (-${amount} Stamps)`)

            // Update local state
            setCustomer((prev: any) => ({
                ...prev,
                currentStamps: result.newBalance
            }))

        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsProcessing(false)
        }
    }

    const resetScanner = () => {
        setScannedData(null)
        setCustomer(null)
        setMoneyAmount("")
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-5 mb-8">
                <Link href="/dashboard">
                    <button className="h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
                <h2 className="text-xl font-bold text-zinc-500/40 font-sans uppercase tracking-widest text-xs">Escáner de Tarjetas</h2>
            </div>

            {!customer ? (
                <div className="overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-2xl rounded-[3rem]">
                    <div className="aspect-square relative bg-[#141414]">
                        <Scanner
                            onScan={handleScan}
                            allowMultiple={true}
                            scanDelay={2000}
                            styles={{ container: { height: '100%', width: '100%' } }}
                            components={{
                                onOff: false,
                                torch: true,
                                zoom: false,
                                finder: false
                            }}
                        />
                        {/* Custom Finder Overlay - Premium Style */}
                        <div className="absolute inset-0 border-[50px] border-[#0a0a0a]/80 pointer-events-none flex items-center justify-center">
                            <div className="w-56 h-56 border-2 border-white/20 rounded-[3rem] relative shadow-[0_0_0_1000px_rgba(0,0,0,0.3)]">
                                <div className="absolute inset-2 border border-white/5 rounded-[2.5rem] animate-pulse"></div>
                                {/* Minimalist Premium Corners */}
                                <div className="absolute -top-[2px] -left-[2px] w-8 h-8 border-t-[3px] border-l-[3px] border-white rounded-tl-[1.8rem]" />
                                <div className="absolute -top-[2px] -right-[2px] w-8 h-8 border-t-[3px] border-r-[3px] border-white rounded-tr-[1.8rem]" />
                                <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8 border-b-[3px] border-l-[3px] border-white rounded-bl-[1.8rem]" />
                                <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8 border-b-[3px] border-r-[3px] border-white rounded-br-[1.8rem]" />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 text-center bg-[#0a0a0a] border-t border-white/5">
                        <p className="text-zinc-500 font-bold text-sm tracking-tight">Apunta la cámara al código QR de la tarjeta</p>
                    </div>
                </div>
            ) : (
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] relative overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl text-white">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                    <div className="text-center pb-8 relative z-10 pt-10">
                        <div className="relative inline-block mx-auto mb-6">
                            <Avatar className="w-28 h-28 border-4 border-[#1c1c1c] shadow-2xl">
                                <AvatarImage src={customer.user?.avatarUrl || customer.avatarUrl} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-[#1c1c1c] text-zinc-400 font-black">
                                    {(customer.user?.name || customer.name)?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-xl">
                                <Check className="w-5 h-5 text-black" strokeWidth={4} />
                            </div>
                        </div>

                        <h3 className="text-3xl font-black tracking-tighter">{customer.user?.name || customer.name} {customer.user?.lastName || customer.lastName}</h3>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">{customer.email}</p>
                    </div>

                    <div className="px-8 pb-10 space-y-10 relative z-10">
                        {/* Balance Display */}
                        <div className="bg-[#141414] rounded-[2rem] p-8 border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Balance Actual</span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-zinc-400">Nivel Member</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-black text-white tracking-tighter">
                                    {customer.currentStamps}
                                </span>
                                <span className="text-xl text-zinc-600 font-bold">/ 10</span>
                            </div>
                            <div className="w-full bg-[#0a0a0a] h-3 rounded-full mt-6 overflow-hidden border border-white/5">
                                <div
                                    className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    style={{ width: `${Math.min((customer.currentStamps / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Monto del Consumo ({currency})</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 font-black">{currency}</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="bg-[#1c1c1c] border-white/5 h-14 rounded-2xl text-white font-black pl-12 focus-visible:ring-1 focus-visible:ring-white/10 transition-all placeholder:text-zinc-800 text-lg outline-none"
                                        value={moneyAmount}
                                        onChange={(e) => setMoneyAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    className="w-full h-14 rounded-2xl bg-white text-black font-black text-base transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                                    onClick={() => handleTransaction('EARN')}
                                    disabled={isProcessing || !moneyAmount || Number(moneyAmount) <= 0}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <>
                                            <Coffee className="w-5 h-5" />
                                            Confirmar (+1 Stamp)
                                        </>
                                    )}
                                </button>

                                <button
                                    className="w-full h-14 rounded-2xl bg-transparent border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 font-bold transition-all"
                                    onClick={() => handleTransaction('REDEEM')}
                                    disabled={isProcessing || customer.currentStamps < 10}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                        <>
                                            Canjear Premio (-10 Stamps)
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className="w-full text-zinc-600 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2" onClick={resetScanner}>
                            <RefreshCw className="h-4 w-4" /> Escanear otro cliente
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}
