"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
    onRemove?: () => void
    bucket?: string
}

export function ImageUpload({ value, onChange, disabled, onRemove, bucket = "course-covers" }: ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        try {
            const file = acceptedFiles[0]
            if (!file) return

            setIsLoading(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("bucket", bucket)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || "Error al subir imagen")
            }

            const data = await response.json()
            onChange(data.url)
            toast.success("Imagen subida correctamente")
        } catch (error: any) {
            toast.error(error.message || "Error al subir la imagen")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [onChange, bucket])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/svg+xml': ['.svg']
        },
        maxFiles: 1,
        disabled: disabled || isLoading
    })

    if (value) {
        return (
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-black/20">
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        onClick={() => {
                            if (onRemove) onRemove()
                            onChange("")
                        }}
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
                <img
                    src={value}
                    alt="Cover"
                    className="w-full h-full object-contain p-2"
                />
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors
                flex flex-col items-center justify-center gap-2 text-center h-48
                ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            <input {...getInputProps()} />
            {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-background rounded-full border border-border shadow-sm">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Click o arrastra imagen</p>
                        <p className="text-xs text-muted-foreground mt-1">Máx 4MB (JPG, PNG, WebP, SVG)</p>
                    </div>
                </div>
            )}
        </div>
    )
}
