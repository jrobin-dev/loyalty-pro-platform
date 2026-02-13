"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, Pipette } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
    label?: string
    className?: string
}

const PRESETS = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080",
    "#800000", "#808000", "#008000", "#800080", "#008080",
    "#000080", "#FF4500", "#DA70D6", "#FA8072", "#20B2AA"
]

export function ColorPicker({ color, onChange, label, className }: ColorPickerProps) {
    const [localColor, setLocalColor] = useState(color)

    useEffect(() => {
        setLocalColor(color)
    }, [color])

    const handleChange = (newColor: string) => {
        setLocalColor(newColor)
        onChange(newColor)
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label>{label}</Label>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal px-2 bg-background border-input hover:bg-accent/50 h-12"
                    >
                        <div
                            className="w-8 h-8 rounded-md mr-2 border border-muted shadow-sm"
                            style={{ backgroundColor: localColor }}
                        />
                        <div className="flex-1 flex flex-col items-start justify-center">
                            <span className="text-xs text-muted-foreground uppercase">{localColor}</span>
                        </div>
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                    <div className="space-y-3">
                        {/* Hex Input */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">#</span>
                                <Input
                                    value={localColor.replace('#', '')}
                                    onChange={(e) => {
                                        const val = '#' + e.target.value
                                        setLocalColor(val)
                                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                                            onChange(val)
                                        }
                                    }}
                                    className="pl-5 h-9 font-mono text-sm uppercase"
                                    maxLength={7}
                                />
                            </div>
                            <div
                                className="w-9 h-9 rounded-md border border-border shadow-sm shrink-0 relative overflow-hidden"
                                style={{ backgroundColor: localColor }}
                            >
                                <input
                                    type="color"
                                    value={localColor}
                                    onChange={(e) => handleChange(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Predefinidos</Label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        className={cn(
                                            "w-8 h-8 rounded-md border border-transparent hover:border-border transition-all relative",
                                            localColor.toLowerCase() === preset.toLowerCase() && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                        )}
                                        style={{ backgroundColor: preset }}
                                        onClick={() => handleChange(preset)}
                                    >
                                        {localColor.toLowerCase() === preset.toLowerCase() && (
                                            <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
