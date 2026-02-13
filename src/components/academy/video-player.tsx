"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoPlayerProps {
    provider: string
    url: string
    title?: string
    autoPlay?: boolean
}

export function VideoPlayer({ provider, url, title, autoPlay = false }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay)

    // Normalize provider: trim whitespace and uppercase
    const prov = provider?.trim().toUpperCase()

    console.log("VideoPlayer Debug:", { prov, url, title })

    return (
        <div className="w-full aspect-video bg-black relative flex items-center justify-center rounded-lg overflow-hidden shadow-2xl border border-white/5">
            {!url && (
                <div className="text-muted-foreground animate-pulse">Sin video configurado</div>
            )}

            {prov === "YOUTUBE" ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${url}${autoPlay || isPlaying ? '?autoplay=1' : ''}`}
                    title={title || "YouTube video player"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            ) : prov === "BUNNY" ? (
                <iframe
                    src={url}
                    title={title || "Bunny.net video player"}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    referrerPolicy="origin-when-cross-origin"
                />
            ) : (
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground font-medium">Video no disponible</p>
                    <p className="text-[10px] opacity-60 uppercase mt-2 px-2 py-1 bg-black/40 rounded">Proveedor: {provider || "N/A"}</p>
                </div>
            )}
        </div>
    )
}
