"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "¿Es realmente gratis?",
        answer: "Sí, nuestro plan gratuito incluye todas las funciones esenciales sin límite de tiempo. No necesitas tarjeta de crédito para empezar. Puedes actualizar a un plan premium cuando tu negocio crezca.",
    },
    {
        question: "¿Necesito conocimientos técnicos?",
        answer: "Para nada. LoyaltyPro está diseñado para ser súper intuitivo. El proceso de configuración toma menos de 5 minutos y nuestro equipo de soporte está disponible para ayudarte en cada paso.",
    },
    {
        question: "¿Cómo funcionan las tarjetas digitales?",
        answer: "Tus clientes pueden agregar su tarjeta de lealtad directamente a Apple Wallet o Google Wallet desde su teléfono. También pueden usar nuestra app móvil. Las tarjetas se actualizan automáticamente con cada compra.",
    },
    {
        question: "¿Puedo personalizar mi programa de lealtad?",
        answer: "¡Absolutamente! Puedes personalizar los colores, logo, número de stamps necesarios, tipos de premios, y mucho más. Tu programa de lealtad reflejará la identidad de tu marca.",
    },
    {
        question: "¿Qué soporte ofrecen?",
        answer: "Ofrecemos soporte por email, chat en vivo y una base de conocimientos completa. Los planes premium incluyen soporte prioritario y llamadas de onboarding personalizadas.",
    },
    {
        question: "¿Cómo migro mis clientes actuales?",
        answer: "Puedes importar tu base de clientes fácilmente desde un archivo CSV o Excel. También ofrecemos asistencia personalizada para migraciones grandes. El proceso es rápido y seguro.",
    },
]

function FAQItem({
    faq,
    index,
    isOpen,
    toggleOpen
}: {
    faq: typeof faqs[0];
    index: number;
    isOpen: boolean;
    toggleOpen: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
        >
            <button
                onClick={toggleOpen}
                className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
            >
                <span className={`font-semibold text-base md:text-lg ${isOpen ? "text-primary" : ""}`}>
                    {faq.question}
                </span>
                <ChevronDown
                    className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                </div>
            </motion.div>
        </motion.div>
    )
}

export function FAQSection() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    // State to track which item is open (none or index)
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Preguntas{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            Frecuentes
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Todo lo que necesitas saber sobre LoyaltyPro
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            toggleOpen={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
