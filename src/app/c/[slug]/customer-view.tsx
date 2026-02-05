"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LogOut, Coffee } from "lucide-react"
import { WalletCard } from "@/components/wallet/wallet-card"
import { TransactionHistory } from "@/components/wallet/transaction-history"

export default function CustomerView({ tenant }: { tenant: any }) {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [customer, setCustomer] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [booting, setBooting] = useState(true)

    const branding = tenant.branding || {}
    const loyalty = tenant.loyalty || {}

    // Design Tokens
    const primaryColor = branding.primaryColor || "#00FF94"

    useEffect(() => {
        // Check local storage for session
        const stored = localStorage.getItem(`loyalty_session_${tenant.id}`)
        if (stored) {
            setCustomer(JSON.parse(stored))
        }
        setBooting(false)
    }, [tenant.id])

    const handleLogin = async () => {
        if (!email) return
        setLoading(true)
        try {
            const res = await fetch('/api/customers/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, tenantId: tenant.id })
            })
            const data = await res.json()
            if (data.customer) {
                const fullData = { ...data.customer, user: data.user }
                setCustomer(fullData)
                localStorage.setItem(`loyalty_session_${tenant.id}`, JSON.stringify(fullData))
            }
        } catch (e) {
            alert("Error al ingresar")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem(`loyalty_session_${tenant.id}`)
        setCustomer(null)
        setEmail("")
    }

    if (booting) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#00FF94]" /></div>

    // --- LOGIN VIEW ---
    if (!customer) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center space-y-8 animate-in fade-in duration-500 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 rounded-full blur-[100px]" />

                {/* Brand Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center overflow-hidden mb-4 ring-1 ring-white/10 z-10"
                >
                    {branding.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold font-[family-name:var(--font-funnel-display)]">{tenant.name[0]}</span>
                    )}
                </motion.div>

                <div className="space-y-2 z-10">
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)]">
                        {tenant.name}
                    </h1>
                    <p className="text-white/60">Únete a nuestro programa de recompensas.</p>
                </div>

                <div className="w-full max-w-xs space-y-4 z-10">
                    <Input
                        placeholder="Tu Nombre (Opcional)"
                        className="bg-white/5 border-white/10 text-center h-12 text-lg focus-visible:ring-[#00FF94]/50"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Tu Email o Teléfono"
                        className="bg-white/5 border-white/10 text-center h-12 text-lg focus-visible:ring-[#00FF94]/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        className="w-full font-bold text-lg h-12"
                        style={{ backgroundColor: primaryColor, color: '#000' }}
                        onClick={handleLogin}
                        disabled={loading || !email}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Ingresar'}
                    </Button>
                </div>
            </div>
        )
    }

    // --- WALLET VIEW ---
    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col gap-8 relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
            {/* Header */}
            <header className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                        {branding.logoUrl && <img src={branding.logoUrl} className="object-cover w-full h-full" />}
                    </div>
                </div>
                <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors">
                    <LogOut size={18} />
                </button>
            </header>

            {/* Wallet Card */}
            <section className="perspective-1000 z-10">
                <WalletCard
                    tenant={tenant}
                    customer={customer}
                    stamps={customer.currentStamps || 0}
                    maxStamps={loyalty.stampsRequired || 10}
                    primaryColor={primaryColor}
                />
            </section>

            {/* Quick Stats or Message */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 z-10"
            >
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2">
                    <Coffee className="text-white/40" size={20} />
                    <div className="text-center">
                        <span className="block text-2xl font-bold font-[family-name:var(--font-funnel-display)]">{loyalty.stampsRequired - customer.currentStamps}</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Para Premio</span>
                    </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2">
                    <div className="text-center">
                        <span className="block text-sm font-bold text-white/80">Próximo Nivel</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">En breve</span>
                    </div>
                </div>
            </motion.div>

            {/* History */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="z-10"
            >
                <TransactionHistory />
            </motion.section>

            {/* Ambient Background */}
            <div
                className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ backgroundColor: primaryColor }}
            />
            <div
                className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full blur-[100px] opacity-10 bg-blue-600 pointer-events-none"
            />
        </div>
    )
}
