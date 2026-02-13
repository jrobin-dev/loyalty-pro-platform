
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, QrCode, Bell, Gift, Ticket, Users, Coffee, X, Lock, Star, Crown, ShoppingBag, Utensils, Zap } from "lucide-react";

export default function Features() {
    const [showDemo, setShowDemo] = useState(false);
    const [activeTab, setActiveTab] = useState("diario");
    const [qrSeed, setQrSeed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQrSeed(prev => prev + 1);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 px-6 bg-white dark:bg-[#0B0F0E] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-[#19E28C] font-semibold text-sm tracking-widest uppercase">Funcionalidades</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3">Todo lo que necesitas</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]">
                    {/* Large Item: Analytics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0 }}
                        className="md:col-span-2 lg:col-span-2 lg:row-span-1 bg-white dark:bg-[#101615] rounded-3xl p-6 md:p-6 lg:p-8 border border-gray-200 dark:border-[#1F2A26] shadow-md dark:shadow-none relative overflow-hidden group hover:border-[#19E28C]/30 transition-all flex flex-col md:flex-row items-center gap-4 lg:gap-8 active:border-[#19E28C]/30 active:shadow-[0_0_30px_rgba(25,226,140,0.15)]"
                    >
                        <div className="flex-1 w-full md:min-w-[180px]">
                            <div className="flex items-center gap-3 mb-3">
                                <BarChart3 className="text-[#19E28C]" size={24} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analítica Avanzada</h3>
                            </div>
                            <p className="text-gray-500 dark:text-[#8FAFA2] text-sm">Toma decisiones basadas en datos reales. Conoce quiénes son tus mejores clientes y qué compran más.</p>
                        </div>

                        {/* Animated Analytics UI (Vertical Chart) */}
                        <div className="block flex-1 w-full bg-gray-50 dark:bg-[#101615] rounded-xl border border-gray-200 dark:border-[#1F2A26] relative h-[200px] min-h-[200px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 dark:from-[#101615]/90 to-transparent pointer-events-none z-0" />

                            {/* Tabs */}
                            <div className="absolute top-[6px] right-[6px] z-20 flex justify-end">
                                <div className="flex gap-1 bg-white dark:bg-[#111a199c] p-1 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                                    {['diario', 'semanal', 'mensual'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors border ${activeTab === tab
                                                ? 'bg-[#19E28C]/10 text-[#19E28C] border-[#19E28C]/30'
                                                : 'text-gray-400 dark:text-white/40 border-transparent hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* DIARIO: 7 Bars */}
                            {activeTab === 'diario' && (
                                <div className="absolute bottom-6 left-4 right-4 grid grid-cols-7 gap-1 h-[80px] items-end z-30 border-b border-gray-200 dark:border-[#17211f]">
                                    {[
                                        { d: "LUN", v: "$150", p: 50 },
                                        { d: "MAR", v: "$220", p: 73 },
                                        { d: "MIÉ", v: "$280", p: 93 },
                                        { d: "JUE", v: "$200", p: 66 },
                                        { d: "VIE", v: "$270", p: 90 },
                                        { d: "SÁB", v: "$300", p: 100 },
                                        { d: "DOM", v: "$220", p: 73 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center justify-end h-full group/bar relative">
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 group-active/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 group-active/bar:translate-y-0 bg-[#19E28C] text-black text-[10px] font-bold px-2 py-1 rounded shadow-[0_4px_10px_rgba(25,226,140,0.3)] pointer-events-none whitespace-nowrap z-20">
                                                {item.v}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#19E28C] rotate-45"></div>
                                            </div>

                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${item.p}%` }}
                                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                                className={`w-full max-w-[12px] rounded-t-sm bg-[#19E28C]/20 border border-[#19E28C]/50 group-hover/bar:bg-[#19E28C] group-active/bar:bg-[#19E28C] group-hover/bar:shadow-[0_0_15px_rgba(25,226,140,0.6)] group-active/bar:shadow-[0_0_15px_rgba(25,226,140,0.6)] transition-all duration-300`}
                                            />

                                            {/* Label */}
                                            <div className="absolute -bottom-5 text-[9px] font-medium text-gray-400 dark:text-white/30 tracking-wider">
                                                {item.d}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* SEMANAL: Smooth Area Chart */}
                            {activeTab === 'semanal' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[100px] z-10">
                                    <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="gradWeek" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#19E28C" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#19E28C" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,100 L0,50 C30,40 50,20 100,40 C150,60 170,10 200,30 L200,100 Z"
                                            fill="url(#gradWeek)"
                                            stroke="none"
                                        />
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,50 C30,40 50,20 100,40 C150,60 170,10 200,30"
                                            fill="none"
                                            stroke="#19E28C"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* MENSUAL: Smooth Area Chart with Tooltip */}
                            {activeTab === 'mensual' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[100px] z-10">
                                    <div className="absolute top-2 left-1/3 -translate-x-1/2 bg-white dark:bg-[#101615] border border-gray-200 dark:border-[#19E28C]/30 px-2 py-1 rounded text-[9px] text-[#19E28C] font-bold z-20 shadow-md dark:shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                        Feb: $4,646
                                    </div>
                                    <div className="absolute top-[30px] left-1/3 w-2 h-2 rounded-full bg-[#19E28C] ring-4 ring-[#19E28C]/20 z-20" />

                                    <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="gradMonth" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#19E28C" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#19E28C" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,100 L0,60 C40,55 60,30 100,35 C140,40 160,20 200,45 L200,100 Z"
                                            fill="url(#gradMonth)"
                                            stroke="none"
                                        />
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            d="M0,60 C40,55 60,30 100,35 C140,40 160,20 200,45"
                                            fill="none"
                                            stroke="#19E28C"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Tall Item: QR Dynamic (Interactive) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        onClick={() => setShowDemo(true)}
                        className="md:row-span-2 bg-white dark:bg-[#151D1C] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#1F2A26] shadow-md dark:shadow-none relative overflow-hidden group hover:border-[#19E28C]/30 hover:shadow-[0_0_50px_rgba(25,226,140,0.15)] transition-all flex flex-col cursor-pointer active:border-[#19E28C]/30 active:shadow-[0_0_50px_rgba(25,226,140,0.15)]"
                    >
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#19E28C]/10 rounded-full blur-[80px] pointer-events-none" />

                        {/* Click Hint */}
                        <div className="absolute top-4 right-4 bg-black/10 dark:bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-black/10 dark:border-white/10 z-20">
                            <div className="w-2 h-2 rounded-full bg-[#19E28C] animate-pulse" />
                            PROBAR DEMO
                        </div>

                        {/* Dynamic QR Visual */}
                        <div className="bg-gray-100 dark:bg-black/40 p-3 rounded-xl mb-6 w-fit border border-gray-200 dark:border-[#1F2A26] shadow-[0_0_15px_rgba(25,226,140,0.1)] group-hover:border-[#19E28C]/50 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(25,226,140,0.2)]">
                            <div className="relative w-[140px] h-[140px]">
                                {/* QR Eyes */}
                                {/* Top Left */}
                                <div className="absolute top-0 left-0 w-[40px] h-[40px] border-[4px] border-black dark:border-[#19E28C] rounded-md flex items-center justify-center z-10 bg-white dark:bg-[#151D1C]">
                                    <div className="w-[16px] h-[16px] bg-black dark:bg-[#19E28C] rounded-sm" />
                                </div>
                                {/* Top Right */}
                                <div className="absolute top-0 right-0 w-[40px] h-[40px] border-[4px] border-black dark:border-[#19E28C] rounded-md flex items-center justify-center z-10 bg-white dark:bg-[#151D1C]">
                                    <div className="w-[16px] h-[16px] bg-black dark:bg-[#19E28C] rounded-sm" />
                                </div>
                                {/* Bottom Left */}
                                <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-[4px] border-black dark:border-[#19E28C] rounded-md flex items-center justify-center z-10 bg-white dark:bg-[#151D1C]">
                                    <div className="w-[16px] h-[16px] bg-black dark:bg-[#19E28C] rounded-sm" />
                                </div>

                                {/* Matrix Grid (14x14 density for visual balance) */}
                                <div className="grid grid-cols-14 gap-0.5 w-full h-full p-0.5">
                                    {Array.from({ length: 196 }).map((_, i) => {
                                        const r = Math.floor(i / 14);
                                        const c = i % 14;
                                        // Skip eyes area
                                        if ((r < 4 && c < 4) || (r < 4 && c >= 10) || (r >= 10 && c < 4)) return <div key={i} />;

                                        return (
                                            <motion.div
                                                key={`${qrSeed}-${i}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: (i + qrSeed) % 3 === 0 ? 1 : 0.1 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-black dark:bg-[#19E28C] rounded-[1px] w-full h-full"
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Dinámico</h3>

                        <div className="font-mono text-[10px] text-gray-500 dark:text-[#4A5E57] break-all mb-4 bg-gray-50 dark:bg-[#101615] px-2 py-1 rounded border border-gray-200 dark:border-[#1F2A26] w-fit">
                            token: <span className="text-[#19E28C]">417{qrSeed}122-623b-{qrSeed}d7c</span>
                        </div>

                        <p className="text-gray-500 dark:text-[#8FAFA2] mb-8 text-sm leading-relaxed">
                            El sistema más rápido para sumar puntos. Haz clic para ver cómo funciona la tarjeta digital.
                        </p>

                        {/* Status Bar */}
                        <div className="mt-auto w-full bg-gray-50 dark:bg-[#101615] rounded-xl p-3 border border-gray-200 dark:border-[#1F2A26]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#19E28C] animate-pulse" />
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-[#8FAFA2] tracking-widest uppercase">ESTADO: ACTIVO</span>
                                </div>
                                <span className="text-[9px] text-[#19E28C] font-mono">100%</span>
                            </div>
                            <div className="h-1 w-full bg-[#19E28C]/10 rounded-full overflow-hidden relative">
                                <motion.div
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className="h-full bg-[#19E28C] rounded-full box-shadow-[0_0_10px_#19E28C]"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile Marquee for Small Items */}
                    <div className="md:hidden w-full overflow-hidden py-4 -mx-6 w-[calc(100%+3rem)] relative">
                        <div className="flex gap-4 animate-marquee-infinite w-max px-6">
                            {[
                                { t: "Notificaciones", i: Bell, s: "Push & Email" },
                                { t: "Premios", i: Gift, s: "Catálogo" },
                                { t: "Cupones", i: Ticket, s: "Promociones" },
                                { t: "Notificaciones", i: Bell, s: "Push & Email" },
                                { t: "Premios", i: Gift, s: "Catálogo" },
                                { t: "Cupones", i: Ticket, s: "Promociones" }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#101615] rounded-3xl p-6 border border-gray-200 dark:border-[#1F2A26] shadow-sm dark:shadow-none min-w-[180px] flex flex-col justify-center items-center text-center">
                                    <div className="w-10 h-10 bg-[#19E28C]/10 rounded-full flex items-center justify-center mb-3 text-[#19E28C]">
                                        <item.i size={20} />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.t}</h3>
                                    <span className="text-gray-500 dark:text-[#8FAFA2] text-[10px] uppercase tracking-wider">{item.s}</span>
                                </div>
                            ))}
                        </div>
                        {/* Fade Gradients */}
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0B0F0E] to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0B0F0E] to-transparent z-10" />
                    </div>

                    {/* Desktop Static Items */}
                    <div className="hidden md:contents">
                        <FeatureCard title="Notificaciones" icon={Bell} delay={0.2} subtitle="Push & Email" />
                        <FeatureCard title="Premios" icon={Gift} delay={0.3} subtitle="Catálogo" />
                        <FeatureCard title="Cupones" icon={Ticket} delay={0.4} subtitle="Promociones" />
                    </div>

                    {/* Wide Item: CRM */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-2 bg-white dark:bg-[#101615] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#1F2A26] shadow-md dark:shadow-none relative overflow-hidden group hover:border-[#19E28C]/30 transition-all flex flex-col md:flex-row items-center gap-3 md:gap-8 active:border-[#19E28C]/30 active:shadow-[0_0_30px_rgba(25,226,140,0.15)] h-[450px] md:h-auto"
                    >
                        <div className="w-full md:flex-1 md:min-w-[200px]">
                            <div className="flex items-center gap-3 mb-3">
                                <Users className="text-[#19E28C]" size={24} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">CRM Integrado</h3>
                            </div>
                            <p className="text-gray-500 dark:text-[#8FAFA2] text-sm">Gestiona tu base de datos de clientes, segmenta y envía promociones personalizadas.</p>
                        </div>

                        {/* Animated CRM UI (Vertical Marquee) */}
                        <div className="block flex-1 w-full bg-gray-50 dark:bg-[#101615] p-3 rounded-xl border border-gray-200 dark:border-[#1F2A26] relative h-full md:h-[160px] overflow-hidden mask-linear-gradient-vertical">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-[#101615] via-transparent to-transparent z-10 h-6 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-50 dark:from-[#101615] via-transparent to-transparent z-10 h-6 pointer-events-none" />

                            {/* Marquee Container */}
                            <div className="flex flex-col gap-3 animate-marquee-vertical">
                                {/* Duplicate list for seamless loop - Added more items */}
                                {[...crmUsers, ...crmUsers, ...crmUsers, ...crmUsers].map((user, index) => (
                                    <div
                                        key={index}
                                        className="h-10 shrink-0 flex items-center gap-3 bg-white dark:bg-white/5 rounded-lg px-3 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${user.c}`}>
                                            {user.i}
                                        </div>
                                        <div className="flex-1 text-[10px] text-gray-400 dark:text-white/60 font-medium">
                                            Hola: <span className="text-gray-900 dark:text-white font-bold">{user.name}</span>
                                        </div>
                                        {/* Status Dot */}
                                        <div className="w-1.5 h-1.5 bg-[#19E28C] rounded-full shadow-[0_0_5px_rgba(25,226,140,0.5)]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Demo Modal */}
            <AnimatePresence>
                {showDemo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDemo(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-sm w-full"
                        >
                            <button
                                onClick={() => setShowDemo(false)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={32} />
                            </button>
                            <DemoWalletCard />
                            <div className="mt-6 text-center">
                                <p className="text-white font-bold text-lg mb-1">Experiencia del Cliente</p>
                                <p className="text-[#8FAFA2] text-sm">Así verán tus clientes su tarjeta de puntos.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// --- Subcomponents ---

function MarqueeGraph() {
    const bars = [45, 75, 55, 85, 60, 90, 50, 80, 65, 95, 55, 85, 60, 90, 50, 75];

    return (
        <div className="w-full h-full flex items-end overflow-hidden pb-0 opacity-100">
            {/* Sliding container with CSS marquee */}
            <div className="flex items-end gap-3 animate-marquee-infinite w-max">
                {/* 4 sets of bars for seamless loop */}
                {[...bars, ...bars, ...bars, ...bars].map((h, i) => (
                    <div
                        key={i}
                        className="w-14 shrink-0 rounded-t-xl bg-gradient-to-b from-[#19E28C]/60 to-transparent border-t-4 border-[#19E28C] shadow-[0_0_30px_rgba(25,226,140,0.3)]"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

const DEMO_USERS = [
    { name: "Juan", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Carol", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Percy", avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
    { name: "Sofia", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    { name: "Diego", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    { name: "Ana", avatar: "https://randomuser.me/api/portraits/women/10.jpg" }
];

const crmUsers = [
    { i: "JP", c: "bg-orange-500/20 text-orange-400", name: "Juan Pablo" },
    { i: "A", c: "bg-[#19E28C]/20 text-[#19E28C]", name: "Ana Maria" },
    { i: "CR", c: "bg-blue-500/20 text-blue-400", name: "Carlos R." },
    { i: "JD", c: "bg-purple-500/20 text-purple-400", name: "Jorge D." },
];

function DemoWalletCard() {
    const [userbwIndex, setUserIndex] = useState(0);
    const [selectedIconId, setSelectedIconId] = useState('coffee');
    const primaryColor = "#19E28C";
    const stamps = 4;
    const [maxStamps, setMaxStamps] = useState(10);
    const progress = (stamps / maxStamps) * 100;

    const ICONS = [
        { id: 'coffee', icon: Coffee },
        { id: 'star', icon: Star },
        { id: 'crown', icon: Crown },
        { id: 'zap', icon: Zap },
        { id: 'shopping', icon: ShoppingBag },
        { id: 'utensils', icon: Utensils },
    ];

    const SelectedIcon = ICONS.find(i => i.id === selectedIconId)?.icon || Coffee;

    // Rotate users every 2.5 seconds (Balance speed for typing)
    useEffect(() => {
        const interval = setInterval(() => {
            setUserIndex((prev) => (prev + 1) % DEMO_USERS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const currentUser = DEMO_USERS[userbwIndex];

    return (
        <div className="relative w-full h-auto min-h-[620px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            style={{
                background: `radial-gradient(circle at top right, ${primaryColor}40, transparent 60%), linear-gradient(to bottom right, #18181b, #000000)`
            }}
        >
            {/* Glow Effects */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: primaryColor }} />

            <div className="relative h-full p-8 flex flex-col justify-between z-10 gap-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 h-8">
                            Hola:
                            <span className="text-[#19E28C] min-w-[60px] inline-flex items-center font-[200]">
                                <TypewriterText text={currentUser.name} />
                            </span>
                            <div className="flex items-center gap-2 ml-1">
                                <span className="w-2 h-2 rounded-full bg-[#19E28C] shadow-[0_0_8px_#19E28C]" />
                            </div>
                        </h2>
                        <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium mt-1">Cliente VIP</p>
                    </div>
                    <div className="bg-white/10 rounded-full border border-white/5 w-10 h-10 flex items-center justify-center overflow-hidden relative">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={currentUser.avatar}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Progress */}
                    <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Nivel Actual</span>
                            <span className="font-bold" style={{ color: primaryColor }}>{stamps} / {maxStamps} Stamps</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full relative transition-[width] duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: primaryColor }}>
                                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white]" />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {/* Grid */}
                    <div className="grid grid-cols-5 gap-3">
                        {Array.from({ length: maxStamps }).map((_, i) => {
                            const isEarned = i < stamps;
                            const isReward = i === maxStamps - 1;

                            return (
                                <div key={i} className={`aspect-square rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500
                                  ${isEarned
                                        ? `border bg-[${primaryColor}]/20 shadow-[0_0_10px_rgba(25,226,140,0.3)]`
                                        : 'bg-white/5 border border-white/10'}`}
                                    style={{ borderColor: isEarned ? primaryColor : 'rgba(255,255,255,0.1)' }}
                                >
                                    {isEarned ? (
                                        <SelectedIcon size={16} className="text-[#19E28C]" />
                                    ) : isReward ? (
                                        <Gift size={16} className="text-white/50" />
                                    ) : (
                                        <div className="text-white/20">
                                            {/* Lock Icon for empty stamps */}
                                            <Lock size={12} className="opacity-50" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Stamp Count Slider */}
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-bold text-xs">Sellos requeridos para premio</span>
                            <span className="text-[#19E28C] font-bold text-xl">{maxStamps}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="15"
                            step="1"
                            value={maxStamps}
                            onChange={(e) => setMaxStamps(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#19E28C]"
                        />
                        <p className="text-[10px] text-white/50 mt-1">Los clientes necesitarán {maxStamps} sellos para obtener su premio</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/5" style={{ paddingBottom: "calc(var(--spacing) * 8)", paddingLeft: "calc(var(--spacing) * 8)", paddingRight: "calc(var(--spacing) * 8)" }}>
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] text-white/60 max-w-[200px]">Muestra este código en caja para sumar puntos.</p>
                    <button className="bg-white text-black p-2 rounded-xl hover:bg-white/90">
                        <QrCode size={20} />
                    </button>
                </div>

                {/* Icon Selector Header */}
                <div className="mb-3">
                    <p className="text-white font-bold text-xs">Stamps Personalizadas</p>
                    <p className="text-[10px] text-white/50">Puedes escoger la stamp de tu preferencia en tu programa de lealtad.</p>
                </div>

                {/* Icon Selector */}
                <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                    {ICONS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedIconId(item.id)}
                            className={`p-2 rounded-lg transition-all relative z-20 cursor-pointer ${selectedIconId === item.id
                                ? 'bg-[#19E28C]/20 text-[#19E28C] border border-[#19E28C]'
                                : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
                                }`}
                        >
                            <item.icon size={16} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TypewriterText({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayedText(""); // Reset on text change
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100); // Typing speed

        return () => clearInterval(typingInterval);
    }, [text]);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className="inline-flex items-center">
            {displayedText}
            <span className={`${showCursor ? "opacity-100" : "opacity-0"} text-[#19E28C] ml-0.5`}>|</span>
        </span>
    );
}

function FeatureCard({ title, icon: Icon, delay, subtitle }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="bg-white dark:bg-[#101615] rounded-3xl p-6 border border-gray-200 dark:border-[#1F2A26] shadow-sm dark:shadow-none hover:border-[#19E28C]/30 hover:shadow-[0_0_30px_rgba(25,226,140,0.1)] transition-all flex flex-col justify-center items-center text-center group"
        >
            <div className="w-12 h-12 bg-[#19E28C]/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-[#19E28C] group-hover:text-black text-[#19E28C]">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
            <span className="text-gray-500 dark:text-[#8FAFA2] text-xs uppercase tracking-wider">{subtitle}</span>
        </motion.div>
    )
}
