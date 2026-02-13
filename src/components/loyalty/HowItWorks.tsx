
"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        {
            id: "01",
            title: "Configura tu programa",
            description: "Define puntos, premios y reglas en minutos. Personaliza tu tarjeta digital con tu logo y colores.",
        },
        {
            id: "02",
            title: "Tus clientes acumulan",
            description: "Escanea el código QR de tus clientes o ingresa su número para sumar puntos automáticamente.",
        },
        {
            id: "03",
            title: "Premia la lealtad",
            description: "Tus clientes canjean recompensas y reciben notificaciones que los motivan a volver.",
        }
    ];

    return (
        <section className="py-24 px-6 bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300" id="how-it-works">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">¿Cómo funciona?</h2>
                    <p className="text-gray-600 dark:text-[#8FAFA2] text-lg max-w-2xl mx-auto">
                        Tres pasos sencillos para transformar visitantes ocasionales en clientes frecuentes.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <Step key={step.id} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Step({ step, index }: { step: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-3xl -z-10" />
            <div className="bg-white dark:bg-[#101615]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 h-full hover:border-[#19E28C]/30 shadow-sm dark:shadow-none transition-all duration-300">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500/20 to-transparent dark:from-[#19E28C]/20 dark:to-transparent mb-6 font-mono">
                    {step.id}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-[#19E28C] transition-colors">
                    {step.title}
                </h3>
                <p className="text-gray-500 dark:text-[#8FAFA2] leading-relaxed">
                    {step.description}
                </p>
            </div>
        </motion.div>
    );
}
