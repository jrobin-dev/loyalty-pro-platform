"use client"

import { useState, useEffect } from "react"
import { getAdminVideos } from "@/app/actions/admin-academy"
import { VideoPlayer } from "@/components/academy/video-player"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Play } from "lucide-react"

export default function AcademyPage() {
    const [videos, setVideos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const result = await getAdminVideos()
                if (result.success && result.data) {
                    setVideos(result.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVideos()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-[family-name:var(--font-funnel-display)] tracking-tight">Academia LoyaltyPro</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Aprende a sacar el máximo provecho a tu programa de lealtad con nuestros tutoriales paso a paso.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">Pronto subiremos nuevos tutoriales.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
                            onClick={() => setSelectedVideo(video)}
                        >
                            {/* Thumbnail / Preview Area */}
                            <div className="aspect-video bg-black/5 relative group-hover:bg-black/10 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Play size={20} className="ml-1" />
                                    </div>
                                </div>
                                {video.provider === 'YOUTUBE' && (
                                    <img
                                        src={`https://img.youtube.com/vi/${video.url}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                )}
                                {video.provider === 'BUNNY' && (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                                        <Play size={40} />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{video.title}</h3>
                                {video.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {video.provider}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Player Modal */}
            <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                <DialogContent className="bg-card border-border sm:max-w-4xl p-0 overflow-hidden">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle>{selectedVideo?.title}</DialogTitle>
                        <DialogDescription className="hidden">Reproduciendo video</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 pt-2">
                        {selectedVideo && (
                            <VideoPlayer
                                provider={selectedVideo.provider}
                                url={selectedVideo.url}
                                title={selectedVideo.title}
                                autoPlay={true}
                            />
                        )}
                        {selectedVideo?.description && (
                            <p className="text-sm text-muted-foreground mt-4">
                                {selectedVideo.description}
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
