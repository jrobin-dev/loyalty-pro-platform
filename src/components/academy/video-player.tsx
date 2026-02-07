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

    if (provider === "YOUTUBE") {
        return (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
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
            </div>
        )
    }

    if (provider === "BUNNY") {
        // Bunny.net iframes are usually full URLs
        // We ensure it has the correct attributes
        return (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                    src={url}
                    loading="lazy"
                    title={title || "Bunny.net video player"}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                />
            </div>
        )
    }

    return (
        <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg">
            <p className="text-muted-foreground">Video no disponible</p>
        </div>
    )
}
