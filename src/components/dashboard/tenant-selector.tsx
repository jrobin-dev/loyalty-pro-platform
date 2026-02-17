"use client"

import { useTenant } from "@/contexts/tenant-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Store, ChevronsUpDown, PlusCircle, Zap, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface TenantSelectorProps {
    isCollapsed?: boolean
}

export function TenantSelector({ isCollapsed }: TenantSelectorProps) {
    const { profile } = useUserProfile()
    const { activeTenant, activeTenantId, setActiveTenantId } = useTenant()
    const router = useRouter()
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

    // Trigger confetti when modal opens
    useEffect(() => {
        if (isUpgradeModalOpen) {
            const duration = 3 * 1000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)
                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
            }, 250)

            return () => clearInterval(interval)
        }
    }, [isUpgradeModalOpen])

    const tenants = profile?.tenants || []

    // Get plan limit
    const getLimit = (plan: string = 'FREE') => {
        const p = plan.toUpperCase()
        if (p === 'AGENCY') return 10
        if (p === 'PRO') return 3
        if (p === 'STARTER') return 1
        return 1 // FREE
    }

    const planLimit = getLimit(profile?.plan)

    // Process tenants to inject enforcedStatus (sync with context logic)
    const processedTenants = tenants.map((t, index) => {
        const isExceedingLimit = index >= planLimit
        const isSuspended = t.status === 'SUSPENDED' || isExceedingLimit
        return {
            ...t,
            isSuspended,
            isExceedingLimit
        }
    })

    if (processedTenants.length === 0) return null

    const currentActiveTenant = processedTenants.find(t => t.id === activeTenant?.id) || processedTenants[0]

    const handleCreateNew = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (processedTenants.length >= planLimit) {
            setIsUpgradeModalOpen(true)
        } else {
            // Redirect to onboarding but with a flag to create additional tenant
            router.push("/onboarding?mode=new")
        }
    }


    return (
        <div className={cn("w-full transition-all duration-300")}>
            <Select value={activeTenantId || ""} onValueChange={setActiveTenantId}>
                <SelectTrigger className={cn(
                    "w-full bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 transition-all duration-200 h-14 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none",
                    isCollapsed ? "px-2" : "px-3"
                )}>
                    <div className="flex items-center gap-3 overflow-hidden text-left w-full">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                            <Store className="w-4 h-4 text-emerald-400" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 pr-2 flex-1">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-none mb-1">
                                        Negocio Activo
                                    </span>
                                    <span className={cn(
                                        "text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                                        currentActiveTenant.isSuspended
                                            ? "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_15px_-5px_theme(colors.destructive.500/0.4)] animate-pulse"
                                            : processedTenants.length >= planLimit
                                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_-5px_theme(colors.amber.500/0.3)]"
                                                : "bg-zinc-800 text-zinc-500 border-white/5"
                                    )}>
                                        {currentActiveTenant.isSuspended ? (
                                            <>
                                                <Lock className="w-2 h-2" />
                                                Suspendido
                                            </>
                                        ) : (
                                            <>
                                                <span className="opacity-50 uppercase text-[7px] tracking-tighter">Uso:</span>
                                                {processedTenants.length}/{planLimit}
                                            </>
                                        )}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-white truncate leading-none">
                                    {currentActiveTenant.name}
                                </span>
                            </div>
                        )}
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white min-w-[240px]">
                    <div className="px-2 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">
                        Mis Negocios
                    </div>
                    {processedTenants.map((tenant) => (
                        <SelectItem
                            key={tenant.id}
                            value={tenant.id}
                            className={cn(
                                "focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer py-3 rounded-lg mx-1",
                                tenant.isSuspended && "focus:bg-destructive/10 focus:text-destructive text-zinc-500"
                            )}
                        >
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex flex-col">
                                    <span className={cn("font-bold text-sm", tenant.isSuspended && "text-zinc-500/80")}>
                                        {tenant.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-mono">/{tenant.slug}</span>
                                </div>
                                {tenant.isSuspended && (
                                    <div className="flex items-center gap-1 bg-destructive/10 text-destructive text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-destructive/20 ml-2">
                                        <Lock className="w-2.5 h-2.5" />
                                        {tenant.isExceedingLimit ? "Límite" : "Suspendido"}
                                    </div>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                    <div className="p-1 mt-1 border-t border-white/5">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 h-11 text-xs font-bold rounded-lg transition-all",
                                processedTenants.length >= planLimit
                                    ? "text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
                                    : "text-emerald-400 hover:bg-emerald-500/10"
                            )}
                            onClick={handleCreateNew}
                        >
                            <PlusCircle className="w-4 h-4" />
                            {processedTenants.length >= planLimit ? "Incrementar Límite" : "Crear Nuevo Negocio"}
                        </Button>
                    </div>
                </SelectContent>
            </Select>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {isUpgradeModalOpen && (
                    <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
                        <DialogContent className="bg-transparent border-none text-white max-w-md overflow-hidden p-0 rounded-[2rem] shadow-2xl gap-0">
                            {/* Rotating Border Beam Container */}
                            <div className="absolute inset-0 rounded-[2rem] p-[1.5px] overflow-hidden pointer-events-none">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,theme(colors.emerald.400)_360deg)] opacity-70"
                                />
                                <div className="absolute inset-[1.5px] bg-zinc-950/95 backdrop-blur-2xl rounded-[calc(2rem-1.5px)] shadow-inner" />
                            </div>

                            <div className="relative overflow-hidden w-full rounded-[2rem] flex flex-col">
                                <DialogTitle className="sr-only">Límite de negocios alcanzado</DialogTitle>

                                {/* Premium Banner Header - Background Image Style */}
                                <div
                                    style={{
                                        height: 'calc(var(--spacing) * 44)',
                                        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                                    }}
                                    className="w-full relative overflow-hidden bg-zinc-900 group rounded-t-[2rem]"
                                >
                                    <img
                                        src="/assets/images/Premium1.avif"
                                        alt="Premium Upgrade"
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                                </div>

                                <div className="p-8 pt-4 relative">
                                    {/* Decorative background glow behind text */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[60px] -z-10 rounded-full" />

                                    <div className="flex flex-col items-center text-center space-y-5">
                                        <div className="space-y-1">
                                            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                                Desbloquea todo <br /> el potencial
                                            </h2>
                                            <p className="text-zinc-400 text-sm font-medium">
                                                Uso actual: <span className="text-emerald-400">{processedTenants.length}/{planLimit}</span> negocios
                                            </p>
                                        </div>

                                        <div className="w-full bg-zinc-900/60 rounded-[1.25rem] border border-white/5 p-4 flex items-center justify-between backdrop-blur-md relative overflow-hidden group/stats">
                                            <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/stats:opacity-100 transition-opacity" />

                                            <div className="text-left space-y-0.5 relative">
                                                <p className="text-[10px] font-medium text-zinc-500 tracking-wider">Plan actual</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className={cn(
                                                        "text-2xl font-bold uppercase",
                                                        profile?.plan === "AGENCY" ? "text-cyan-400" :
                                                            profile?.plan === "PRO" ? "text-amber-500" :
                                                                profile?.plan === "STARTER" ? "text-violet-400" :
                                                                    "text-emerald-500"
                                                    )}>{profile?.plan}</span>
                                                </div>
                                            </div>

                                            <div className="h-10 w-px bg-white/10 mx-3" />

                                            <div className="text-right space-y-0.5 flex-1 relative">
                                                <p className="text-[10px] font-medium text-emerald-500/80 tracking-wider">Próximo nivel</p>
                                                <p className={cn(
                                                    "text-lg font-bold",
                                                    profile?.plan === 'FREE' ? 'text-violet-400' :
                                                        profile?.plan === 'STARTER' ? 'text-amber-500' :
                                                            'text-cyan-400'
                                                )}>
                                                    Plan {
                                                        profile?.plan === 'FREE' ? 'Starter' :
                                                            profile?.plan === 'STARTER' ? 'Pro' :
                                                                'Agency'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-4">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-lg rounded-2xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.4)] transition-all border-t border-white/30 relative overflow-hidden group"
                                                    onClick={() => router.push("/settings/billing")}
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        <Zap className="w-5 h-5 fill-current" />
                                                        Mejorar mi plan ahora
                                                    </span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                                                        whileHover={{ translateX: "100%" }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </Button>
                                            </motion.div>

                                            <button
                                                onClick={() => setIsUpgradeModalOpen(false)}
                                                className="text-zinc-500 text-sm font-medium hover:text-emerald-400 transition-colors py-2 flex items-center justify-center gap-2 w-full"
                                            >
                                                Tal vez en otro momento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    )
}
