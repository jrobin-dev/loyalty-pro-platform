
"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users, BarChart3, Repeat, ShieldCheck, Zap } from "lucide-react";

export default function Benefits() {
    const benefits = [
        {
            icon: TrendingUp,
            title: "Incrementa Ventas",
            text: "Los clientes fidelizados gastan un 67% más que los nuevos clientes."
        },
        {
            icon: Users,
            title: "Retención de Clientes",
            text: "Aumenta la tasa de retención en un 5% y tus beneficios crecerán hasta un 95%."
        },
        {
            icon: BarChart3,
            title: "Analítica Real",
            text: "Conoce los hábitos de compra y toma decisiones basadas en datos."
        },
        {
            icon: Repeat,
            title: "Compras Recurrentes",
            text: "Crea el hábito de visita con recompensas alcanzables y atractivas."
        },
        {
            icon: ShieldCheck,
            title: "A prueba de fraudes",
            text: "Sistema seguro de validación de puntos y canjes en tiempo real."
        },
        {
            icon: Zap,
            title: "Setup Instantáneo",
            text: "Sin hardware costoso. Funciona desde cualquier dispositivo con internet."
        }
    ];

    return (
        <section className="py-24 px-6 bg-gray-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-emerald-500 dark:text-[#19E28C] font-semibold text-sm tracking-widest uppercase">Beneficios</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">Por qué elegir LoyaltyApp</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <BenefitCard key={index} benefit={benefit} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BenefitCard({ benefit, index }: { benefit: any, index: number }) {
    const Icon = benefit.icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#101615] p-8 rounded-2xl border border-gray-200 dark:border-[#1F2A26] hover:border-[#19E28C]/40 hover:bg-gray-50 dark:hover:bg-[#151D1C] shadow-sm dark:shadow-none transition-all group"
        >
            <div className="w-12 h-12 bg-[#19E28C]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#19E28C] transition-colors">
                <Icon className="text-emerald-600 dark:text-[#19E28C] group-hover:text-black transition-colors" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
            <p className="text-gray-500 dark:text-[#8FAFA2] text-sm leading-relaxed">{benefit.text}</p>
        </motion.div>
    );
}
