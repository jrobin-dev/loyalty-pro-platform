import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatNumber(value: number | string): string {
    if (value === undefined || value === null) return "0"
    const num = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(num)) return "0"

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num)
}
