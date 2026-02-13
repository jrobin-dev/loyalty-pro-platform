
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";

export default function FinalCTA() {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <section className="py-24 px-6 bg-white dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto bg-[#19E28C] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight"
                    >
                        Activa tu programa hoy
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-10 text-lg md:text-xl text-black/70 max-w-2xl mx-auto font-medium"
                    >
                        Configura tu sistema en minutos y comienza a fidelizar desde el primer día.
                        Sin contratos de permanencia.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link href="/onboarding" className="px-8 py-5 rounded-2xl bg-black text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl">
                            Empieza gratis <ArrowRight size={20} />
                        </Link>
                        <button
                            onClick={() => setShowVideo(true)}
                            className="px-8 py-5 rounded-2xl border-2 border-black/20 text-black font-bold hover:bg-black/5 transition-colors"
                        >
                            Ver Demo
                        </button>
                    </motion.div>
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
