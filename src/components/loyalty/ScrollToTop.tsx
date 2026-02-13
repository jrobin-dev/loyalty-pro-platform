"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#19E28C] text-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:bg-[#19E28C]/90 transition-all transform hover:scale-110 group cursor-pointer"
                    aria-label="Volver arriba"
                >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={2.5} />
                    <span className="sr-only">Volver arriba</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
