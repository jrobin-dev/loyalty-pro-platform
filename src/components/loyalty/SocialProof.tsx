
"use client";
import { motion } from "framer-motion";

export default function SocialProof() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0E1413] transition-colors duration-300">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 dark:bg-[#101615] dark:bg-gradient-to-br dark:from-[#19E28C]/10 dark:to-transparent p-12 rounded-[3rem] border border-gray-200 dark:border-[#19E28C]/20 backdrop-blur-sm shadow-xl dark:shadow-none"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        "Los clientes fidelizados compran hasta un
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-[#19E28C] dark:to-[#10B981]"> 67% más</span>."
                    </h2>
                    <p className="text-gray-600 dark:text-[#8FAFA2] text-lg">
                        No dejes dinero en la mesa. Empieza a construir relaciones duraderas hoy mismo.
                    </p>

                    <div className="mt-8 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full bg-[#19E28C]" />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
