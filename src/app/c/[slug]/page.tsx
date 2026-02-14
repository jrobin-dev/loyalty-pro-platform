"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { WalletCard } from "@/components/wallet/wallet-card"
import { LogOut, Loader2, Award, Zap, History, Coffee, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileEditModal } from "@/components/wallet/profile-edit-modal"

export default function ClientCardPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const slug = params.slug as string
    const emailParam = searchParams.get("email")
    const autoParam = searchParams.get("auto")

    const [loading, setLoading] = useState(true)
    const [tenant, setTenant] = useState<any>(null)
    const [customer, setCustomer] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [showConfetti, setShowConfetti] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)

    useEffect(() => {
        fetchData()
    }, [slug, emailParam])

    const fetchData = async () => {
        setLoading(true)
        try {
            const supabase = createClient()

            // 1. Get Tenant with Branding and Loyalty
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select(`
                    *,
                    branding:Branding(*),
                    loyalty:LoyaltyProgram(*)
                `)
                .eq('slug', slug)
                .single()

            if (tenantError || !tenantData) throw new Error("Negocio no encontrado")
            setTenant(tenantData)

            // 2. Get Customer (Autologin or Session)
            let currentCustomer = null

            if (emailParam && autoParam === "true") {
                const { data: custData, error: custError } = await supabase
                    .from('Customer')
                    .select(`
                        id,
                        userId,
                        tenantId,
                        totalStamps,
                        currentStamps,
                        joinedAt,
                        user:User!inner(*)
                    `)
                    .eq('tenantId', tenantData.id)
                    .eq('User.email', emailParam)
                    .maybeSingle()

                if (custData) {
                    currentCustomer = {
                        ...custData,
                        name: (custData.user as any)?.name || 'Cliente',
                        lastName: (custData.user as any)?.lastName || '',
                        email: (custData.user as any)?.email,
                        avatarUrl: (custData.user as any)?.avatarUrl,
                        phone: (custData.user as any)?.phone,
                        birthday: (custData.user as any)?.birthday
                    }
                }
            }

            if (!currentCustomer) {
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    const { data: sessionCust } = await supabase
                        .from('Customer')
                        .select(`
                            *,
                            user:User(*)
                        `)
                        .eq('tenantId', tenantData.id)
                        .eq('userId', session.user.id)
                        .single()

                    if (sessionCust) {
                        currentCustomer = {
                            ...sessionCust,
                            name: sessionCust.user?.name || 'Cliente',
                            lastName: sessionCust.user?.lastName || '',
                            email: sessionCust.user?.email,
                            avatarUrl: sessionCust.user?.avatarUrl,
                            phone: sessionCust.user?.phone,
                            birthday: sessionCust.user?.birthday
                        }
                    }
                }
            }

            if (!currentCustomer) {
                toast.error("Por favor inicia sesión para ver tu tarjeta")
                router.push(`/login?redirect=/c/${slug}`)
                return
            }

            setCustomer(currentCustomer)

            // 3. Get Transactions (StampTransaction)
            const { data: transData } = await supabase
                .from('StampTransaction')
                .select('*')
                .eq('customerId', currentCustomer.id)
                .order('createdAt', { ascending: false })
                .limit(5)

            setTransactions(transData || [])

            // Optional: Trigger confetti if a new stamp was just added
            if (searchParams.get("newStamp") === "true") {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 5000)
            }

        } catch (error: any) {
            console.error("Error fetching card data:", error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                <p className="text-white/40 font-medium">Preparando tu experiencia...</p>
            </div>
        )
    }

    if (!tenant || !customer) return null

    // Branding variables from the Branding model
    const branding = tenant.branding?.[0] || tenant.branding || {} // handle both single and array
    const primaryColor = branding.primaryColor || "#10b981"
    const secondaryColor = branding.secondaryColor || "#000000"
    const hasGradient = branding.gradient ?? true
    const logoUrl = branding.logoUrl || tenant.logoUrl

    const getBackgroundStyle = () => {
        if (!hasGradient) return { backgroundColor: "#000" }
        return {
            background: `radial-gradient(circle at top left, ${primaryColor}25, transparent 40%), radial-gradient(circle at bottom right, ${secondaryColor}20, transparent 60%), #000`
        }
    }

    const maxStamps = tenant.loyalty?.[0]?.stampsRequired || tenant.loyalty?.stampsRequired || 10
    const stampsMissing = Math.max(0, maxStamps - customer.currentStamps)

    return (
        <main className="relative h-[100dvh] flex flex-col items-center overflow-hidden"
            style={getBackgroundStyle()}>

            {/* Header fixed */}
            <div className="w-full max-w-md flex-none flex items-center justify-between pt-8 pb-6 px-8 z-20">
                <div className="h-9">
                    {logoUrl ? (
                        <img src={logoUrl} alt={tenant.name} className="h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                    ) : (
                        <h1 className="text-2xl font-black italic tracking-tighter" style={{ color: primaryColor }}>
                            {tenant.name}
                        </h1>
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/30 hover:text-white hover:bg-white/5 rounded-full backdrop-blur-sm border border-white/5">
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>

            {/* Static Section: Card, Stats & Title */}
            <div className="w-full max-w-md px-6 pt-4 flex-none z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                >
                    <WalletCard
                        tenant={tenant}
                        customer={customer}
                        stamps={customer.currentStamps}
                        maxStamps={maxStamps}
                        primaryColor={primaryColor}
                        onAvatarClick={() => setShowProfileModal(true)}
                    />
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                    >
                        <div className="flex flex-col gap-1 items-center">
                            <Coffee className="w-6 h-6 mb-2" style={{ color: primaryColor }} />
                            <span className="text-3xl font-black tracking-tighter leading-none">{stampsMissing}</span>
                            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Para Premio</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-center items-center text-center"
                    >
                        <Award className="w-6 h-6 mb-2 opacity-30" />
                        <span className="text-sm font-bold text-white mb-0.5">Próximo Nivel</span>
                        <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">En Breve</span>
                    </motion.div>
                </div>

                <h3 className="text-xl font-black mt-10 mb-6 px-1 tracking-tight">
                    Actividad Reciente
                </h3>
            </div>

            {/* Scrollable Section: ONLY Activity list */}
            <div className="w-full flex-1 overflow-y-auto no-scrollbar px-6"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
                }}
            >
                <div className="w-full max-w-md mx-auto pb-12">
                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((tx, idx) => (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1), duration: 0.4 }}
                                    className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                                            <Zap className="w-4 h-4" style={{ color: primaryColor }} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-sm tracking-tight">Consumo</div>
                                            <div className="text-[10px] text-white/30 font-semibold uppercase">
                                                {new Date(tx.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-base tracking-tighter">
                                            {tenant.currency || '$'} {tx.amount?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: primaryColor }}>
                                            {tx.stampsEarned > 0 ? `+${tx.stampsEarned} Sello` : 'Canje'}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white/[0.02] rounded-2xl border border-dashed border-white/10"
                            >
                                <History className="w-8 h-8 mx-auto mb-3 opacity-10" />
                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Sin actividad reciente</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dynamic Confetti / Serpentinas Layers */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                        <ConfettiParticles color={primaryColor} />
                    </div>
                )}
            </AnimatePresence>

            {/* Profile Edit Modal */}
            <ProfileEditModal
                open={showProfileModal}
                onOpenChange={setShowProfileModal}
                primaryColor={primaryColor}
                onSuccess={fetchData}
                customerId={customer?.id}
            />
        </main>
    )
}

function ConfettiParticles({ color }: { color: string }) {
    return (
        <>
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: -20,
                        backgroundColor: color,
                        width: Math.random() * 8 + 4,
                        height: Math.random() * 4 + 2,
                        borderRadius: 1,
                        filter: `drop-shadow(0 0 5px ${color}50)`
                    }}
                    initial={{ y: -20, rotate: 0, opacity: 1 }}
                    animate={{
                        y: 1200,
                        rotate: Math.random() * 1000 + 500,
                        opacity: [1, 1, 0.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2.5 + 2,
                        ease: [0.22, 1, 0.36, 1],
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </>
    )
}
