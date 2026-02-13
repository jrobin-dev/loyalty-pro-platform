"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowDown, ArrowDownRight, ArrowUpRight, Circle } from "lucide-react"

interface GradientDirectionPickerProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

const DIRECTIONS = [
    { value: "to right", label: "Horizontal", icon: ArrowRight },
    { value: "to bottom", label: "Vertical", icon: ArrowDown },
    { value: "to bottom right", label: "Diagonal", icon: ArrowDownRight },
    { value: "to top right", label: "Diagonal Alt", icon: ArrowUpRight },
    { value: "radial", label: "Radial", icon: Circle },
]

export function GradientDirectionPicker({ value, onChange, disabled }: GradientDirectionPickerProps) {
    return (
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Dirección del degradado</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIRECTIONS.map((dir) => {
                    const Icon = dir.icon
                    const isSelected = value === dir.value
                    return (
                        <button
                            type="button"
                            key={dir.value}
                            onClick={() => onChange(dir.value)}
                            disabled={disabled}
                            className={cn(
                                "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                isSelected
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-card border-border hover:bg-muted text-muted-foreground",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Icon size={14} />
                            {dir.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
