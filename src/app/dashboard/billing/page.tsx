"use client"

import { Button } from "@/components/ui/button"
import { Check, Zap, Loader2, CreditCard, Coins, Globe } from "lucide-react"
import Script from "next/script"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

declare global {
    interface Window {
        Culqi: any;
        culqi: () => void;
    }
}

export default function BillingPage() {
    const [loading, setLoading] = useState(false)
    const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN')
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    // Exchange Rate (Simulated Real-time)
    const EXCHANGE_RATE = 3.75
    const prices = {
        PEN: { free: 0, pro: 50 },
        USD: { free: 0, pro: parseFloat((50 / EXCHANGE_RATE).toFixed(2)) } // ~13.33
    }

    // --- CULQI LOGIC ---
    useEffect(() => {
        window.culqi = async () => {
            if (window.Culqi.token) {
                await processCulqiPayment(window.Culqi.token.id, window.Culqi.token.email);
            } else {
                toast.error(window.Culqi.error?.user_message || 'Error en token')
            }
        };
    }, []);

    const processCulqiPayment = async (token: string, email: string) => {
        setLoading(true)
        try {
            const res = await fetch('/api/payments/create-charge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, plan: 'Pro', tenantId: "demo-id" })
            })
            const data = await res.json();
            if (data.error) throw new Error(data.error)
            toast.success("¡Pago exitoso con Culqi!")
            setIsPaymentOpen(false)
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    const openCulqi = () => {
        if (!window.Culqi) return;
        window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
        window.Culqi.settings({
            title: 'LoyaltyPro Plan Pro',
            currency: 'PEN',
            amount: 5000, // Always process in PEN for Culqi
            order: ''
        });
        window.Culqi.options({
            lang: 'auto',
            modal: true,
            paymentMethods: { tarjeta: true, yape: true },
        });
        window.Culqi.open();
    }

    // --- PAYPAL LOGIC ---
    const handlePayPalApprove = async (data: any, actions: any) => {
        try {
            const res = await fetch('/api/payments/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID, tenantId: "demo-id" })
            })
            const result = await res.json()
            if (result.success) {
                toast.success("Pago exitoso con PayPal")
                setIsPaymentOpen(false)
            }
        } catch (err) {
            toast.error("Error capturando pago PayPal")
        }
    }

    const plans = [
        {
            name: "Free",
            price: currency === 'PEN' ? `S/ 0` : `$ 0`,
            description: "Ideal para pequeños negocios que recién empiezan.",
            features: ["Hasta 50 Clientes", "Tarjeta Digital Básica", "Escáner QR", "1 Local"],
            current: true,
            cta: "Plan Actual",
            variant: "outline"
        },
        {
            name: "Pro",
            price: currency === 'PEN' ? `S/ ${prices.PEN.pro}` : `$ ${prices.USD.pro}`,
            period: "/mes",
            description: "Potencia tu fidelización con WhatsApp y Branding total.",
            features: ["Clientes Ilimitados", "WhatsApp API", "Branding Personalizado", "Múltiples Locales", "Soporte Prioritario"],
            current: false,
            cta: "Mejorar a Pro",
            variant: "premium"
        },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-sans">Planes y Facturación</h1>
                        <p className="text-muted-foreground">Elige el plan que mejor se adapte a tu crecimiento.</p>
                    </div>

                    {/* Currency Toggle */}
                    <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10">
                        <button
                            onClick={() => setCurrency('PEN')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'PEN' ? 'bg-[#00FF94] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            PEN (S/)
                        </button>
                        <button
                            onClick={() => setCurrency('USD')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-[#00C2FF] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            USD ($)
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative rounded-2xl border p-8 flex flex-col gap-6 glass-card ${plan.name === 'Pro' ? 'bg-gradient-to-b from-[#00FF94]/5 to-black border-[#00FF94]/50' : ''}`}>
                            {plan.name === 'Pro' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00FF94] text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Zap size={12} fill="black" /> RECOMENDADO
                                </div>
                            )}

                            <div>
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold font-sans">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                                </div>
                                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
                            </div>

                            <div className="flex-1 space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-sm">
                                        <div className={`rounded-full p-1 ${plan.name === 'Pro' ? 'bg-[#00FF94] text-black' : 'bg-white/10 text-white'}`}>
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                        <span className="opacity-90">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {plan.name === 'Pro' ? (
                                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="default" size="lg" className="w-full font-bold bg-[#00FF94] text-black hover:bg-[#00cc76]">
                                            {plan.cta}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-card border-white/10 text-white sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Elige tu método de pago</DialogTitle>
                                        </DialogHeader>

                                        <Tabs defaultValue="card" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                                <TabsTrigger value="card">Culqi</TabsTrigger>
                                                <TabsTrigger value="paypal">PayPal</TabsTrigger>
                                                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="card" className="space-y-4 pt-4">
                                                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 text-center">
                                                    <p className="text-sm text-white/60 mb-2">Total a pagar</p>
                                                    <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">S/. 1,240.00</div>
                                                </div>
                                                <Button onClick={openCulqi} className="w-full bg-emerald-500 text-black hover:bg-[#00cc76] font-bold h-12">
                                                    Pagar con Tarjeta o Yape
                                                </Button>
                                                <p className="text-xs text-center text-white/40">Procesado de forma segura por Culqi</p>
                                            </TabsContent>

                                            <TabsContent value="paypal" className="space-y-4 pt-4">
                                                <div className="bg-[#00C2FF]/5 p-4 rounded-xl border border-[#00C2FF]/20 text-center">
                                                    <p className="text-sm text-white/60 mb-2">Total a pagar</p>
                                                    <p className="text-3xl font-bold text-[#00C2FF]">$ {prices.USD.pro}</p>
                                                </div>
                                                <div className="w-full min-h-[150px] relative z-0">
                                                    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb" }}>
                                                        <PayPalButtons
                                                            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                                                            createOrder={async () => {
                                                                const res = await fetch('/api/payments/paypal/create-order', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ plan: 'Pro', tenantId: "demo-id" })
                                                                })
                                                                const order = await res.json()
                                                                return order.id
                                                            }}
                                                            onApprove={handlePayPalApprove}
                                                        />
                                                    </PayPalScriptProvider>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="crypto" className="space-y-4 pt-4">
                                                <div className="bg-[#FF00E5]/5 p-4 rounded-xl border border-[#FF00E5]/20 text-center">
                                                    <p className="text-sm text-white/60 mb-2">Total a pagar</p>
                                                    <p className="text-3xl font-bold text-[#FF00E5]">{prices.USD.pro} USDT</p>
                                                </div>
                                                <div className="border border-white/10 rounded-xl p-4 text-center bg-black/40">
                                                    <Coins className="mx-auto w-8 h-8 text-[#FF00E5] mb-2" />
                                                    <p className="text-xs font-mono break-all text-white/60 mb-2">
                                                        0x123...abc (Red Polygon)
                                                    </p>
                                                    <Button size="sm" variant="outline" className="w-full">
                                                        Copiar Dirección
                                                    </Button>
                                                </div>
                                                <Button className="w-full bg-[#FF00E5] hover:bg-[#d000bb] text-white font-bold">
                                                    Verificar Transacción
                                                </Button>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button variant="outline" size="lg" className="w-full font-bold" disabled>
                                    Plan Actual
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <Script src="https://checkout.culqi.com/js/v4" />
            </div>
        </DashboardLayout>
    )
}
