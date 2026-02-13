
"use client";
import { motion } from "framer-motion";
import { Smartphone, Laptop, Tablet } from "lucide-react";

export default function Devices() {
    return (
        <section className="py-24 px-6 bg-white dark:bg-[#0E1413] relative overflow-hidden transition-colors duration-300">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#19E28C]/5 dark:bg-[#19E28C]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Accesible desde cualquier lugar
                    </h2>
                    <p className="text-gray-600 dark:text-[#8FAFA2] text-lg max-w-3xl mx-auto">
                        Tus clientes pueden consultar sus puntos desde su celular sin instalar apps pesadas.
                        Tú gestionas todo desde cualquier navegador.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Mockup Left: Mobile */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative mx-auto"
                    >
                        <div className="w-[280px] h-[580px] bg-white dark:bg-black border-[8px] border-gray-100 dark:border-[#1F2A26] rounded-[3rem] p-4 shadow-2xl relative overflow-hidden transition-colors duration-300">
                            {/* Screen Content */}
                            <div className="w-full h-full bg-gray-50 dark:bg-[#101615] rounded-[2rem] flex flex-col relative overflow-hidden transition-colors duration-300">
                                <div className="h-8 w-32 bg-gray-200 dark:bg-black rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20 transition-colors" />

                                {/* Fake App UI */}
                                <div className="p-6 pt-12 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-8 h-8 rounded-full bg-[#19E28C]" />
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
                                    </div>
                                    <div className="h-32 bg-gradient-to-br from-[#19E28C] to-[#10B981] rounded-2xl p-4 flex flex-col justify-between">
                                        <div className="w-16 h-4 bg-black/10 dark:bg-black/20 rounded" />
                                        <div className="text-4xl font-bold text-black">1,450</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-16 bg-gray-200/50 dark:bg-white/5 rounded-xl transition-colors" />
                                        <div className="h-16 bg-gray-200/50 dark:bg-white/5 rounded-xl transition-colors" />
                                        <div className="h-16 bg-gray-200/50 dark:bg-white/5 rounded-xl transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Icon */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white dark:bg-[#101615] p-4 rounded-2xl border border-gray-200 dark:border-[#19E28C]/30 shadow-xl hidden md:block">
                            <Smartphone size={32} className="text-[#19E28C]" />
                        </div>
                    </motion.div>

                    {/* Mockup Right: Laptop/Tablet */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white dark:bg-[#101615] border border-gray-200 dark:border-[#1F2A26] rounded-xl p-2 shadow-2xl">
                            <div className="bg-gray-50 dark:bg-[#101615] rounded-lg border border-gray-200 dark:border-[#1F2A26] aspect-[16/10] relative overflow-hidden flex flex-col">
                                {/* Browser Header */}
                                <div className="h-8 border-b border-gray-200 dark:border-[#1F2A26] flex items-center px-4 gap-2 bg-white dark:bg-[#101615]">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    <div className="ml-4 w-40 h-4 bg-gray-100 dark:bg-[#1F2A26] rounded-full" />
                                </div>
                                {/* Browser Content */}
                                <div className="flex-1 p-6 flex gap-6">
                                    <div className="w-16 h-full bg-gray-200 dark:bg-[#1F2A26]/30 rounded-lg hidden sm:block" />
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between">
                                            <div className="w-32 h-8 bg-[#19E28C]/20 rounded-lg" />
                                            <div className="w-24 h-8 bg-gray-200 dark:bg-[#1F2A26] rounded-lg" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-24 bg-gray-100 dark:bg-[#1F2A26]/30 rounded-xl" />
                                            <div className="h-24 bg-gray-100 dark:bg-[#1F2A26]/30 rounded-xl" />
                                            <div className="h-24 bg-gray-100 dark:bg-[#1F2A26]/30 rounded-xl" />
                                        </div>
                                        <div className="h-32 bg-gray-50 dark:bg-[#1F2A26]/20 rounded-xl border border-gray-200 dark:border-[#1F2A26]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Icons */}
                        <div className="absolute -left-6 -bottom-6 flex gap-4">
                            <div className="bg-white dark:bg-[#101615] p-3 rounded-xl border border-gray-200 dark:border-[#1F2A26] shadow-xl">
                                <Laptop size={24} className="text-gray-900 dark:text-white" />
                            </div>
                            <div className="bg-white dark:bg-[#101615] p-3 rounded-xl border border-gray-200 dark:border-[#1F2A26] shadow-xl">
                                <Tablet size={24} className="text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
