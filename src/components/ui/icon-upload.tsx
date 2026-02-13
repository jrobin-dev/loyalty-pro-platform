"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface IconUploadProps {
    value?: string
    onChange: (url: string) => void
    onRemove: () => void
    disabled?: boolean
    className?: string
}

export function IconUpload({ value, onChange, onRemove, disabled, className }: IconUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type (SVG preference, but allow PNG/WebP/GIF for icons too)
        if (!file.type.includes('svg') && !file.type.includes('image/')) {
            toast.error("Por favor sube un archivo de imagen válido (SVG recomendado)")
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB max for icons/GIFs
            toast.error("El archivo es demasiado grande (Máx 5MB)")
            return
        }

        try {
            setIsUploading(true)

            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload-icon", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Error al subir el icono")
            }

            const data = await response.json()
            onChange(data.url)
            toast.success("Icono subido correctamente")
        } catch (error) {
            console.error('Error uploading icon:', error)
            toast.error("Error al subir el icono")
        } finally {
            setIsUploading(false)
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className={className}>
            {value ? (
                <div className="relative w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group overflow-hidden">
                    <div className="p-4 w-full h-full flex items-center justify-center">
                        <img
                            src={value}
                            alt="Custom Icon"
                            className="w-full h-full object-contain text-white"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        />
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onRemove()
                        }}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`
                        w-20 h-20 border-2 border-dashed border-white/20 rounded-xl 
                        flex flex-col items-center justify-center gap-2 
                        cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                    ) : (
                        <>
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground text-center px-1">Subir SVG</span>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.gif,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleUpload}
                disabled={disabled || isUploading}
            />
        </div>
    )
}
