"use client";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";

export default function Hero() {
    const [showVideo, setShowVideo] = useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300 pt-20">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] dark:animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-400/5 dark:bg-green-400/5 rounded-full blur-[120px] dark:animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Column: Text */}
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-gray-100 dark:bg-[#151D1C] text-emerald-600 dark:text-[#19E28C] text-sm font-semibold mb-6 border border-gray-200 dark:border-[#1F2A26]">
                            🚀 Nuevo Sistema de Fidelización
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                            Convierte compras en{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 dark:from-[#19E28C] dark:to-[#10B981]">
                                Clientes Leales
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-[#8FAFA2] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Fideliza a tus clientes con un sistema digital de puntos y recompensas.
                            Aumenta la frecuencia de compra y controla tus ingresos en tiempo real.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 w-full px-4 sm:px-0 relative z-30">
                            <Link href="/onboarding" className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-[#19E28C] text-black font-bold hover:bg-[#19E28C]/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
                                Empieza gratis <ArrowRight size={20} />
                            </Link>
                            <button
                                onClick={() => setShowVideo(true)}
                                className="cursor-pointer w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl border bg-white text-gray-900 border-gray-200 hover:bg-gray-50 dark:bg-[#151D1C] dark:text-white dark:border-[#1F2A26] dark:hover:bg-[#1A2422] transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                            >
                                <div className="relative flex h-3 w-3 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </div>
                                Ver demo en vivo
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center text-gray-600 dark:text-[#8FAFA2] text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-[#19E28C]" /> Sin tarjeta de crédito
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-[#19E28C]" /> Instalación en 2 min
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-[#19E28C]" /> Cancelación gratuita
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Dynamic Images */}
                <div className="relative h-[600px] hidden lg:block">
                    {/* Back Image (Floating Up) */}
                    <motion.div
                        style={{ y: y2 }}
                        className="absolute right-0 top-10 w-3/4 z-10"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#1F2A26]/50 bg-[#101615]">
                            <Image
                                src="/assets/images/loyalty-demo-2.svg"
                                alt="Loyalty App Mobile Dashboard"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1413] via-transparent to-transparent opacity-40" />
                        </div>
                    </motion.div>

                    {/* Front Image (Floating Down) */}
                    <motion.div
                        style={{ y: y1 }}
                        className="absolute left-0 bottom-20 w-3/4 z-20"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(25,226,140,0.15)] border border-[#1F2A26] bg-[#0E1413]">
                            <Image
                                src="/assets/images/loyalty-demo-1.svg"
                                alt="Loyalty App Analytics"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Image Marquee (Visible only on lg and below) */}
                <div className="lg:hidden w-full overflow-hidden mt-12 relative">
                    <div className="flex gap-6 animate-marquee-infinite w-max">
                        {/* Duplicated for seamless loop */}
                        {[1, 2, 1, 2].map((item, i) => (
                            <div key={i} className="relative w-[280px] h-[350px] shrink-0 rounded-2xl overflow-hidden border border-[#1F2A26] bg-[#101615] shadow-lg">
                                <Image
                                    src={`/assets/images/loyalty-demo-${item}.svg`}
                                    alt="Loyalty App Demo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Fade Gradients */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0E1413] to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0E1413] to-transparent z-10" />
                </div>
            </div>

            <VideoModal
                isOpen={showVideo}
                onClose={() => setShowVideo(false)}
                videoId="lkqpo2hl9oE"
            />
        </section>
    );
}
