
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Users, Zap, Cpu, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [showComparison, setShowComparison] = useState(false);

    const plans = {
        monthly: { free: "S/. 0", pro: "S/. 99", plus: "S/. 249" },
        yearly: { free: "S/. 0", pro: "S/. 79", plus: "S/. 199" }
    };

    return (
        <section className="py-24 px-6 bg-white dark:bg-[#0E1413] relative transition-colors duration-300" id="pricing">
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <span className="text-emerald-600 dark:text-[#19E28C] font-semibold text-sm tracking-widest uppercase">Precios</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-6">
                        Comienza gratis, crece sin límites
                    </h2>
                    <p className="text-gray-600 dark:text-[#8FAFA2] text-lg mb-8">Planes transparentes que escalan con tu negocio.</p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-[#8FAFA2]"}`}>Mensual</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-14 h-8 bg-gray-200 dark:bg-[#1F2A26] rounded-full p-1 relative transition-colors hover:bg-gray-300 dark:hover:bg-[#2A3631]"
                        >
                            <motion.div
                                layout
                                className="w-6 h-6 bg-emerald-500 dark:bg-[#19E28C] rounded-full shadow-md"
                                animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold transition-colors ${billingCycle === "yearly" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-[#8FAFA2]"}`}>Anual</span>
                            <span className="bg-emerald-500/10 dark:bg-[#19E28C]/20 text-emerald-600 dark:text-[#19E28C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Ahorra 20%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 text-left mb-16 max-w-6xl mx-auto">
                    <Plan
                        title="Free"
                        price={billingCycle === "monthly" ? plans.monthly.free : plans.yearly.free}
                        billingCycle={billingCycle}
                        description="Para validar tu idea"
                        items={["Hasta 50 clientes", "1 Sede", "Recompensas básicas", "Soporte por email"]}
                        cta="Empezar gratis"
                        ctaLink="/onboarding"
                        delay={0}
                    />
                    <Plan
                        title="Pro"
                        price={billingCycle === "monthly" ? plans.monthly.pro : plans.yearly.pro}
                        billingCycle={billingCycle}
                        description="Para negocios en crecimiento"
                        highlight
                        items={["Clientes ilimitados", "Multisede (hasta 3)", "Personalización de marca", "Reportes avanzados", "Exportación de datos"]}
                        cta="Elegir Pro"
                        ctaLink="/onboarding?plan=pro"
                        delay={0.1}
                    />
                    <Plan
                        title="Plus"
                        price={billingCycle === "monthly" ? plans.monthly.plus : plans.yearly.plus}
                        billingCycle={billingCycle}
                        description="Para marcas consolidadas"
                        items={["Todo lo de Pro", "Sedes ilimitadas", "API Access", "Manager de cuenta", "Campañas automáticas"]}
                        cta="Contactar Ventas"
                        ctaLink="mailto:sales@loyaltyapp.com"
                        delay={0.2}
                    />
                </div>

                {/* Expandable Comparison Section */}
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="inline-flex items-center gap-2 text-gray-500 dark:text-[#8FAFA2] hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider mb-8"
                    >
                        {showComparison ? "Ocultar comparación" : "Ver comparación completa"}
                        {showComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <AnimatePresence>
                        {showComparison && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="text-left mb-24">
                                    <div className="mb-8 border-b border-gray-200 dark:border-[#1F2A26] pb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Comparación detallada</h3>
                                        <p className="text-gray-500 dark:text-[#8FAFA2]">Desglose completo de funcionalidades por plan.</p>
                                    </div>

                                    <div className="relative">
                                        {/* Split Table approach for Sticky Header + Horizontal Scroll */}
                                        <PricingTable />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function Plan({ title, price, billingCycle, description, items, cta, ctaLink, highlight, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`p-8 rounded-[2rem] border flex flex-col h-full relative group transition-all duration-300
        ${highlight
                    ? "bg-[#19E28C]/5 border-[#19E28C] hover:shadow-[0_0_50px_rgba(25,226,140,0.1)]"
                    : "bg-white dark:bg-[#101615] border-border dark:border-[#1F2A26] hover:border-[#19E28C]/30 shadow-md dark:shadow-none"
                }`}
        >
            {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white dark:text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MÁS POPULAR
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${highlight ? "text-emerald-600 dark:text-[#19E28C]" : "text-gray-900 dark:text-white"}`}>{title}</h3>
                <p className="text-gray-500 dark:text-[#8FAFA2] text-sm h-10">{description}</p>
            </div>

            <div className="mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
                        <span className="text-gray-500 dark:text-[#8FAFA2]">/{billingCycle === "monthly" ? "mes" : "año"}</span>
                    </motion.div>
                </AnimatePresence>
                {billingCycle === "yearly" && (
                    <span className="text-emerald-600 dark:text-[#19E28C] text-xs font-medium block mt-1">Facturado anualmente</span>
                )}
            </div>

            <ul className="mb-8 space-y-4 flex-1">
                {items.map((item: string) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-[#E2E8F0]">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-emerald-500 dark:bg-[#19E28C] text-white dark:text-black" : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {item}
                    </li>
                ))}
            </ul>

            <Link href={ctaLink} className={`w-full py-4 rounded-xl font-bold transition-all transform group-hover:scale-105 flex items-center justify-center
        ${highlight
                    ? "bg-emerald-500 dark:bg-[#19E28C] text-white dark:text-black hover:bg-emerald-600 dark:hover:bg-[#19E28C]/90 shadow-lg shadow-emerald-500/20 dark:shadow-[#19E28C]/20"
                    : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                }`}>
                {cta}
            </Link>
        </motion.div>
    );
}

function CategoryHeader({ title, icon: Icon }: { title: string, icon?: any }) {
    return (
        <tr className="bg-transparent">
            <td colSpan={4} className="pt-8 pb-4 border-b border-border dark:border-[#1F2A26]">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                            <Icon size={16} />
                        </div>
                    )}
                    <span className="text-emerald-600 dark:text-[#19E28C] font-semibold text-xs uppercase tracking-widest">{title}</span>
                </div>
            </td>
        </tr>
    );
}

function TableRow({ feature, free, pro, plus }: any) {
    const renderCell = (value: any) => {
        if (value === true) return <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-[#19E28C]/20 flex items-center justify-center"><Check size={14} className="text-emerald-600 dark:text-[#19E28C]" strokeWidth={3} /></div></div>;
        if (value === false) return <div className="flex justify-center"><div className="w-1.5 h-1.5 bg-gray-300 dark:bg-[#2A3631] rounded-full" /></div>;
        return <span className="text-gray-900 dark:text-white font-medium">{value}</span>;
    };

    return (
        <tr className="group hover:bg-secondary/30 dark:hover:bg-white/5 transition-colors border-b border-border dark:border-[#1F2A26] last:border-0 text-base">
            <td className="py-6 px-8 text-left font-medium text-foreground dark:text-white w-1/3">{feature}</td>
            <td className="py-6 px-8 text-center text-gray-500 dark:text-[#8FAFA2] w-1/6">
                {renderCell(free)}
            </td>
            <td className="py-6 px-8 text-center text-muted-foreground dark:text-[#8FAFA2] w-1/6">
                {renderCell(pro)}
            </td>
            <td className="py-6 px-8 text-center text-muted-foreground dark:text-[#8FAFA2] w-1/6">
                {renderCell(plus)}
            </td>
        </tr>
    );
}

function PricingTable() {
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (headerRef.current && bodyRef.current) {
            headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
        }
    };

    return (
        <div className="relative">
            {/* Sticky Header Container (Synced Scroll) */}
            <div className="sticky top-16 md:top-20 z-20 overflow-hidden" ref={headerRef}>
                <table className="w-full text-sm border-collapse min-w-[800px]">
                    <thead className="backdrop-blur-md after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#19E28C] after:to-transparent after:content-['']">
                        <tr className="bg-white/95 dark:bg-[#0E1413] text-foreground dark:text-white shadow-xl shadow-border/50 dark:shadow-black/20">
                            <th className="py-6 md:py-8 px-4 md:px-8 text-left font-bold text-lg md:text-xl w-1/3 relative">
                                Funcionalidad
                            </th>
                            <th className="py-6 md:py-8 px-4 md:px-8 text-center font-bold text-lg md:text-xl w-1/6">Free</th>
                            <th className="py-6 md:py-8 px-4 md:px-8 text-center font-bold text-lg md:text-xl text-emerald-600 dark:text-[#19E28C] w-1/6">Pro</th>
                            <th className="py-6 md:py-8 px-4 md:px-8 text-center font-bold text-lg md:text-xl w-1/6">Plus</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* Scrollable Body Container (Master Scroll) */}
            <div className="overflow-x-auto pb-4 no-scrollbar" ref={bodyRef} onScroll={handleScroll}>
                <table className="w-full text-sm border-collapse min-w-[800px]">
                    {/* Ghost Header to enforce column widths */}
                    <thead className="invisible h-0">
                        <tr>
                            <th className="py-0 px-4 md:px-8 w-1/3"></th>
                            <th className="py-0 px-4 md:px-8 w-1/6"></th>
                            <th className="py-0 px-4 md:px-8 w-1/6"></th>
                            <th className="py-0 px-4 md:px-8 w-1/6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-[#1F2A26]">
                        <CategoryHeader title="Gestión de Clientes" icon={Users} />
                        <TableRow feature="Clientes registrados" free="50" pro="Ilimitados" plus="Ilimitados" />
                        <TableRow feature="Sedes / Sucursales" free="1" pro="Hasta 3" plus="Ilimitadas" />
                        <TableRow feature="Segmentación de Clientes" free={false} pro="Básica" plus="Avanzada + IA" />

                        <CategoryHeader title="Personalización & Marketing" icon={Zap} />
                        <TableRow feature="Personalización de Tarjeta" free="Básica" pro="Full Branding" plus="White Label" />
                        <TableRow feature="Mailing Automático" free={false} pro={true} plus={true} />
                        <TableRow feature="Notificaciones Push" free={false} pro={true} plus={true} />

                        <CategoryHeader title="Tecnología & Integración" icon={Cpu} />
                        <TableRow feature="Escaneo QR" free={true} pro={true} plus={true} />
                        <TableRow feature="Exportación de Datos" free={false} pro={true} plus={true} />
                        <TableRow feature="API de Integración" free={false} pro={false} plus={true} />

                        <CategoryHeader title="Soporte" icon={LifeBuoy} />
                        <TableRow feature="Soporte Técnico" free="Email" pro="Prioritario" plus="24/7 Dedicado" />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

