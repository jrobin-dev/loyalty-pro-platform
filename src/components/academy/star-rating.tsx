"use client"

import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface StarRatingProps {
    lessonId: string
    initialRating?: number
    onRate: (rating: number) => Promise<void>
}

export function StarRating({ initialRating = 0, onRate }: StarRatingProps) {
    const [rating, setRating] = useState(initialRating)
    const [hover, setHover] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRate = async (value: number) => {
        setIsSubmitting(true)
        try {
            await onRate(value)
            setRating(value)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-12 px-6 rounded-xl bg-secondary border-border hover:bg-muted transition-all group flex items-center gap-3"
                >
                    <div className="flex items-center gap-1">
                        <Star
                            size={16}
                            className={cn(
                                "transition-all duration-300",
                                rating > 0 ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                            )}
                        />
                        <span className="text-sm font-black text-foreground">
                            {rating > 0 ? `${rating}/5` : "Calificar"}
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover border-border backdrop-blur-xl p-4 shadow-2xl rounded-2xl animate-in fade-in zoom-in duration-200">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 text-center">Calificar lección</p>
                <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="p-1 outline-none group"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => handleRate(star)}
                            disabled={isSubmitting}
                        >
                            <Star
                                size={28}
                                className={cn(
                                    "transition-all duration-200 transform",
                                    (hover || rating) >= star
                                        ? "text-yellow-500 fill-yellow-500 scale-110"
                                        : "text-muted-foreground/30 fill-transparent",
                                    !isSubmitting && "hover:scale-125 active:scale-90"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
