"use client"

import { useState } from "react"
import { Check, Zap, Crown, Rocket, Info, Star, ShieldCheck, ZapIcon, Users, CreditCard, Gift, GraduationCap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function PlansPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

    const plans = [
        {
            name: "Free",
            icon: Zap,
            price: billingCycle === "monthly" ? "S/. 0" : "S/. 0",
            period: "/mes",
            description: "Para validar tu idea y empezar a fidelizar.",
            features: [
                "Hasta 50 clientes",
                "1 Sede activa",
                "Tarjeta de lealtad básica",
                "Soporte por email"
            ],
            color: "text-slate-400",
            borderColor: "border-slate-200 dark:border-slate-800",
            bgColor: "bg-slate-50 dark:bg-slate-900/50"
        },
        {
            name: "Pro",
            icon: Crown,
            price: billingCycle === "monthly" ? "S/. 49" : "S/. 39",
            period: "/mes",
            description: "El estándar para negocios en crecimiento constante.",
            features: [
                "Clientes ilimitados",
                "Hasta 3 sedes",
                "Personalización full branding",
                "Analytics avanzados",
                "Soporte prioritario 24/7"
            ],
            popular: true,
            color: "text-emerald-600 dark:text-emerald-400",
            borderColor: "border-emerald-500/50 dark:border-emerald-500/30",
            bgColor: "bg-emerald-50/50 dark:bg-emerald-500/5"
        },
        {
            name: "Plus",
            icon: Rocket,
            price: billingCycle === "monthly" ? "S/. 99" : "S/. 79",
            period: "/mes",
            description: "Para marcas consolidadas y franquicias.",
            features: [
                "Todo lo de Pro",
                "Sedes ilimitadas",
                "API de integración",
                "Account Manager dedicado",
                "Campañas automáticas IA"
            ],
            color: "text-purple-600 dark:text-purple-400",
            borderColor: "border-purple-500/50 dark:border-purple-500/30",
            bgColor: "bg-purple-50/50 dark:bg-purple-500/5"
        }
    ]

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold font-sans tracking-tight">Planes y Suscripción</h1>
                    <p className="text-muted-foreground text-lg">Gestiona tu plan actual y descubre nuevas funcionalidades para tu negocio.</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-4 bg-secondary/50 p-1 rounded-2xl border border-border/50">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-semibold transition-all",
                            billingCycle === "monthly" ? "bg-white dark:bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mensual
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                            billingCycle === "yearly" ? "bg-white dark:bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Anual
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full">
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative overflow-hidden group rounded-[2.5rem] border-2 p-8 transition-all duration-300 hover:scale-[1.02] flex flex-col h-full",
                            plan.borderColor,
                            plan.bgColor
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                                    Recomendado
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <div className={cn("w-14 h-14 rounded-2xl bg-white dark:bg-background flex items-center justify-center mb-6 shadow-sm", plan.color)}>
                                <plan.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        <div className="mb-8 p-6 bg-white/50 dark:bg-background/50 rounded-3xl border border-white/20 dark:border-white/5">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tighter">{plan.price}</span>
                                <span className="text-muted-foreground font-medium">{plan.period}</span>
                            </div>
                            {billingCycle === "yearly" && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Facturado anualmente</p>
                            )}
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <div className={cn("p-1 rounded-full", plan.bgColor, plan.color)}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            className={cn(
                                "w-full h-14 rounded-2xl font-bold text-base transition-all",
                                plan.popular
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                    : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                            )}
                        >
                            {plan.name === "Free" ? "Plan Actual" : "Cambiar a " + plan.name}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Feature Comparison Table */}
            <div className="mt-20 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold font-sans">Comparación de Funcionalidades</h2>
                    <p className="text-muted-foreground">Analiza en detalle lo que ofrece cada nivel del sistema.</p>
                </div>

                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border/50">
                    <PricingTable />
                </div>
            </div>
        </div>
    )
}

function PricingTable() {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className={cn(
                        "text-foreground dark:text-white",
                        "border-b-2 border-emerald-500/50 dark:border-[#00FF94]/30"
                    )}>
                        <th className="py-8 px-10 text-left font-bold text-xl w-[40%] font-sans">Funcionalidad</th>
                        <th className="py-8 px-4 text-center font-bold text-xl w-[20%] font-sans">Free</th>
                        <th className="py-8 px-4 text-center font-bold text-xl text-emerald-600 dark:text-emerald-400 w-[20%] font-sans">Pro</th>
                        <th className="py-8 px-4 text-center font-bold text-xl w-[20%] font-sans">Plus</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {/* Clientes */}
                    <tr className="bg-emerald-50/10 dark:bg-emerald-500/[0.02]">
                        <td colSpan={4} className="py-4 px-10">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                                <Users size={14} /> Gestión de Clientes
                            </div>
                        </td>
                    </tr>
                    <TableRow label="Clientes registrados" free="Hasta 50" pro="Ilimitados" plus="Ilimitados" />
                    <TableRow label="Sedes activas" free="1" pro="Hasta 3" plus="Ilimitadas" />
                    <TableRow label="Base de datos de clientes" free={true} pro={true} plus={true} />
                    <TableRow label="Segmentación avanzada" free={false} pro={true} plus={true} />

                    {/* Lealtad */}
                    <tr className="bg-blue-50/10 dark:bg-blue-500/[0.02]">
                        <td colSpan={4} className="py-4 px-10">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                                <Gift size={14} /> Sistema de Lealtad
                            </div>
                        </td>
                    </tr>
                    <TableRow label="Tarjetas de sellos" free="Básica" pro="Personalizada" plus="White Label" />
                    <TableRow label="Premios configurables" free="3" pro="Ilimitados" plus="Ilimitados" />
                    <TableRow label="Escaneo QR avanzado" free={true} pro={true} plus={true} />
                    <TableRow label="Campañas temporales" free={false} pro={true} plus={true} />

                    {/* Negocio */}
                    <tr className="bg-purple-50/10 dark:bg-purple-500/[0.02]">
                        <td colSpan={4} className="py-4 px-10">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                                <GraduationCap size={14} /> Negocio y Crecimiento
                            </div>
                        </td>
                    </tr>
                    <TableRow label="Analytics en tiempo real" free="Básico" pro="Avanzado" plus="Predictivo (IA)" />
                    <TableRow label="Exportación de reportes" free={false} pro={true} plus={true} />
                    <TableRow label="Academia para dueños" free={true} pro={true} plus={true} />
                    <TableRow label="Múltiples administradores" free={false} pro="Hasta 5" plus="Ilimitados" />

                    {/* Soporte */}
                    <tr className="bg-orange-50/10 dark:bg-orange-500/[0.02]">
                        <td colSpan={4} className="py-4 px-10">
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest text-[10px]">
                                <ShieldCheck size={14} /> Seguridad y Soporte
                            </div>
                        </td>
                    </tr>
                    <TableRow label="Canal de soporte" free="Email" pro="Prioritario" plus="Account Manager" />
                    <TableRow label="SLA garantizado" free={false} pro={false} plus={true} />
                    <TableRow label="Respaldo diario" free={true} pro={true} plus={true} />
                </tbody>
            </table>
        </div>
    )
}

function TableRow({ label, free, pro, plus }: { label: string, free: any, pro: any, plus: any }) {
    const renderCell = (val: any) => {
        if (typeof val === "boolean") {
            return val ? (
                <div className="mx-auto w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check size={14} strokeWidth={3} />
                </div>
            ) : (
                <div className="mx-auto w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
            )
        }
        return <span className="text-sm font-semibold">{val}</span>
    }

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
            <td className="py-5 px-10 font-medium text-slate-700 dark:text-slate-300">{label}</td>
            <td className="py-5 px-4 text-center">{renderCell(free)}</td>
            <td className="py-5 px-4 text-center text-emerald-600 dark:text-emerald-400">{renderCell(pro)}</td>
            <td className="py-5 px-4 text-center">{renderCell(plus)}</td>
        </tr>
    )
}
