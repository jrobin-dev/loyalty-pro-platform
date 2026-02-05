"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Rocket } from "lucide-react"

export default function PlansPage() {
    const plans = [
        {
            name: "Free",
            icon: Zap,
            price: "S/. 0",
            period: "/mes",
            features: [
                "Hasta 50 clientes",
                "Tarjeta de lealtad básica",
                "Dashboard de estadísticas",
                "Soporte por email"
            ],
            current: true
        },
        {
            name: "Pro",
            icon: Crown,
            price: "S/. 49",
            period: "/mes",
            features: [
                "Clientes ilimitados",
                "Tarjetas personalizadas",
                "Analytics avanzados",
                "Integraciones",
                "Soporte prioritario"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            icon: Rocket,
            price: "Personalizado",
            period: "",
            features: [
                "Todo de Pro",
                "Múltiples ubicaciones",
                "API personalizada",
                "Soporte dedicado",
                "SLA garantizado"
            ]
        }
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)]">
                        Elige tu Plan
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Selecciona el plan que mejor se adapte a las necesidades de tu negocio.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const Icon = plan.icon
                        return (
                            <div
                                key={plan.name}
                                className={`glass-card rounded-3xl p-8 relative ${plan.popular ? 'border-2 border-primary' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary text-black px-4 py-1 rounded-full text-sm font-bold">
                                            Más Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className="inline-flex p-3 bg-primary/20 rounded-full mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-white/60">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-white/80 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    variant={plan.current ? "outline" : "default"}
                                    disabled={plan.current}
                                >
                                    {plan.current ? "Plan Actual" : "Actualizar"}
                                </Button>
                            </div>
                        )
                    })}
                </div>

                <p className="text-center text-xs text-white/40 mt-12">
                    Próximamente: Sistema de pagos y gestión de suscripciones
                </p>
            </div>
        </DashboardLayout>
    )
}
