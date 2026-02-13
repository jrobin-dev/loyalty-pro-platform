
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Apps() {
    return (
        <section className="py-24 px-6 bg-gray-50 dark:bg-[#0E1413] transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* Customer App */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bento-card p-1 bg-white dark:bg-[#1F2A26] rounded-[2.5rem] shadow-xl dark:shadow-none border border-gray-200 dark:border-transparent"
                >
                    <div className="bg-gray-50 dark:bg-[#101615] rounded-[2.3rem] overflow-hidden border border-gray-200 dark:border-[#1F2A26] relative h-[500px] flex flex-col">
                        <div className="p-8 pb-0 z-10">
                            <span className="text-emerald-600 dark:text-[#19E28C] font-mono text-sm">PARA CLIENTES</span>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Experiencia Fluida</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-[#8FAFA2] text-sm">
                                <li className="flex gap-2">✔ Consulta de puntos en tiempo real</li>
                                <li className="flex gap-2">✔ Catálogo de premios actualizado</li>
                            </ul>
                        </div>
                        <div className="relative flex-1 mt-8 mx-8 rounded-t-3xl bg-white dark:bg-black border-t border-x border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden">
                            {/* Abstract UI Mockup */}
                            <div className="absolute inset-x-0 top-0 h-14 border-b border-gray-100 dark:border-white/10 flex items-center px-4 gap-2 bg-white dark:bg-transparent">
                                <div className="w-12 h-4 bg-gray-200 dark:bg-white/10 rounded-full" />
                            </div>
                            <div className="p-6 pt-20 grid grid-cols-2 gap-3">
                                <div className="h-32 bg-[#19E28C]/20 rounded-xl" />
                                <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Business App */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bento-card p-1 bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-[#19E28C] dark:to-[#10B981] rounded-[2.5rem] shadow-xl dark:shadow-none"
                >
                    <div className="bg-white dark:bg-[#0E1413] rounded-[2.3rem] overflow-hidden relative h-[500px] flex flex-col">
                        <div className="p-8 pb-0 z-10">
                            <span className="text-emerald-600 dark:text-[#19E28C] font-mono text-sm">PARA NEGOCIOS</span>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Control Total</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-[#8FAFA2] text-sm">
                                <li className="flex gap-2">✔ Escaneo de QR instantáneo</li>
                                <li className="flex gap-2">✔ Validación de premios segura</li>
                            </ul>
                        </div>
                        <div className="relative flex-1 mt-8 ml-8 rounded-tl-3xl bg-gray-50 dark:bg-[#101615] border-t border-l border-gray-200 dark:border-[#333] shadow-2xl overflow-hidden">
                            {/* Abstract Admin UI */}
                            <div className="absolute top-4 left-4 right-4 h-32 bg-[#19E28C]/10 rounded-xl border border-[#19E28C]/20 flex items-center justify-center">
                                <span className="text-3xl font-bold text-emerald-600 dark:text-[#19E28C]">+142%</span>
                            </div>
                            <div className="absolute top-40 left-4 right-0 h-40 bg-white dark:bg-white/5 rounded-l-xl border-t border-l border-gray-200 dark:border-transparent" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
