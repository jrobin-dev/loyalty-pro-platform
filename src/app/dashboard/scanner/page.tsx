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

export default function ScannerPage() {
    const [scannedData, setScannedData] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [customer, setCustomer] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [moneyAmount, setMoneyAmount] = useState("")

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
            ? `Visita Registrada (Consumo: S/. ${moneyAmount})`
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
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">Escáner QR</h1>
            </div>

            {!customer ? (
                <Card className="overflow-hidden border-white/10 bg-black shadow-2xl">
                    <div className="aspect-square relative bg-white/5">
                        <Scanner
                            onScan={handleScan}
                            allowMultiple={true}
                            scanDelay={2000}
                            components={{
                                onOff: false,
                                torch: true,
                                zoom: false,
                                finder: false
                            }}
                            styles={{
                                container: { height: '100%', width: '100%' }
                            }}
                        />
                        {/* Custom Finder Overlay */}
                        <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-64 border-[3px] border-[#00FF94] rounded-3xl relative">
                                <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/20 rounded-2xl animate-pulse"></div>
                                {/* Corners */}
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#00FF94] rounded-tl-xl" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#00FF94] rounded-tr-xl" />
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#00FF94] rounded-bl-xl" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#00FF94] rounded-br-xl" />
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6 text-center bg-zinc-900/50 backdrop-blur-sm">
                        <p className="text-white/60 font-medium">Apunta la cámara al código QR del cliente</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-[#00FF94]/30 bg-black relative overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl shadow-[#00FF94]/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <CardHeader className="text-center pb-6 relative z-10 pt-8">
                        <div className="relative inline-block mx-auto mb-4">
                            <Avatar className="w-24 h-24 border-4 border-[#00FF94] shadow-[0_0_20px_rgba(0,255,148,0.3)]">
                                <AvatarImage src={customer.user?.image} />
                                <AvatarFallback className="text-3xl bg-[#00FF94] text-black font-bold font-[family-name:var(--font-funnel-display)]">
                                    {customer.user?.name?.[0] || 'C'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/10">
                                <Check className="w-6 h-6 text-[#00FF94] bg-[#00FF94]/20 rounded-full p-1" />
                            </div>
                        </div>

                        <CardTitle className="text-3xl font-[family-name:var(--font-funnel-display)]">{customer.user?.name || 'Cliente'}</CardTitle>
                        <p className="text-white/60 text-sm font-mono mt-1">{customer.user?.email}</p>
                    </CardHeader>

                    <CardContent className="space-y-8 relative z-10">
                        {/* Balance Display */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-white/60">Balance Actual</span>
                                <span className="text-xs uppercase px-2 py-0.5 rounded bg-white/10 text-white/60">Nivel Member</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold text-[#00FF94] font-[family-name:var(--font-funnel-display)] tracking-tighter">
                                    {customer.currentStamps}
                                </span>
                                <span className="text-lg text-white/60 mb-1 font-medium">/ 10 Stamps</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                                <div
                                    className="bg-[#00FF94] h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((customer.currentStamps / 10) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/10 space-y-4">

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/60 ml-1">Monto del Consumo (S/)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">S/</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        className="bg-white/5 border-white/10 text-white pl-8 focus-visible:ring-[#00FF94]/50"
                                        value={moneyAmount}
                                        onChange={(e) => setMoneyAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    className="w-full bg-[#00FF94] text-black hover:bg-[#00cc76] font-bold h-14 text-lg shadow-[0_0_15px_rgba(0,255,148,0.4)] hover:shadow-[0_0_25px_rgba(0,255,148,0.6)] transition-all"
                                    onClick={() => handleTransaction('EARN')}
                                    disabled={isProcessing || !moneyAmount || Number(moneyAmount) <= 0}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <Coffee className="mr-2 w-5 h-5" />
                                            Confirmar (+1 Stamp)
                                        </>
                                    )}
                                </Button>

                                <Button
                                    className="w-full bg-transparent border border-white/10 text-white hover:bg-white/5 font-medium h-12"
                                    onClick={() => handleTransaction('REDEEM')}
                                    disabled={isProcessing || customer.currentStamps < 10}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <Gift className="mr-2 w-4 h-4 text-[#FF00E5]" />
                                            Canjear Premio (-10 Stamps)
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button variant="ghost" className="w-full text-white/40 hover:text-white mt-4" onClick={resetScanner}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Escanear otro cliente
                        </Button>

                    </CardContent>
                </Card>
            )}
        </div>
    )
}
