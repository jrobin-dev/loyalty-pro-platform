"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketingSlider() {
    const [emblaRef] = useEmblaCarousel({ loop: true })

    const slides = [
        {
            id: 1,
            title: "Plan Pro: WhatsApp Automático",
            description: "Envía mensajes de cumpleaños y recordatorios sin mover un dedo.",
            bg: "bg-gradient-to-r from-[#00FF94]/20 to-[#00C2FF]/20",
            cta: "Activar Demo",
        },
        {
            id: 2,
            title: "Nuevas Plantillas de Tarjetas",
            description: "Personaliza aún más tu marca con los nuevos diseños Neon.",
            bg: "bg-gradient-to-r from-[#FF00E5]/20 to-[#7000FF]/20",
            cta: "Ver Diseños",
        },
    ]

    return (
        <div className="w-full relative overflow-hidden rounded-2xl glass-card">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
                            <div className={`p-8 md:p-12 ${slide.bg} relative overflow-hidden`}>
                                {/* Decorators */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                <div className="relative z-10 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5 backdrop-blur-md text-xs font-medium text-white mb-4">
                                        <Sparkles size={12} className="text-[#00FF94]" />
                                        <span>Novedad</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight text-white">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg text-white/80 mb-8 max-w-xl">
                                        {slide.description}
                                    </p>
                                    <Button className="font-bold gap-2 group bg-white text-black hover:bg-white/90 border-0">
                                        {slide.cta}
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
