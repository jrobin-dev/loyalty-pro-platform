"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2, User } from "lucide-react"
import { toast } from "sonner"

interface AvatarUploaderProps {
    currentAvatarUrl?: string | null
    userName?: string | null
    onUploadComplete: (avatarUrl: string) => void
}

interface CropArea {
    x: number
    y: number
    width: number
    height: number
}

export function AvatarUploader({ currentAvatarUrl, userName, onUploadComplete }: AvatarUploaderProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)
    const [uploading, setUploading] = useState(false)
    const [showCropModal, setShowCropModal] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen debe ser menor a 2MB")
            return
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Solo se permiten imágenes")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setImageSrc(reader.result as string)
            setShowCropModal(true)
        }
        reader.readAsDataURL(file)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"]
        },
        maxFiles: 1,
        multiple: false,
    })

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createCroppedImage = async (): Promise<Blob> => {
        if (!imageSrc || !croppedAreaPixels) {
            throw new Error("No image to crop")
        }

        const image = new Image()
        image.src = imageSrc

        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")

                if (!ctx) {
                    reject(new Error("Failed to get canvas context"))
                    return
                }

                canvas.width = croppedAreaPixels.width
                canvas.height = croppedAreaPixels.height

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                )

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error("Failed to create blob"))
                    }
                }, "image/jpeg", 0.9)
            }

            image.onerror = () => reject(new Error("Failed to load image"))
        })
    }

    const handleSaveCrop = async () => {
        try {
            setUploading(true)

            const croppedBlob = await createCroppedImage()
            const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" })

            const formData = new FormData()
            formData.append("avatar", file)

            const response = await fetch("/api/user/avatar", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to upload avatar")
            }

            const data = await response.json()
            onUploadComplete(data.avatarUrl)
            toast.success("Avatar actualizado correctamente")
            setShowCropModal(false)
            setImageSrc(null)
        } catch (error: any) {
            toast.error(error.message || "Error al subir avatar")
        } finally {
            setUploading(false)
        }
    }

    const getInitials = () => {
        if (!userName) return "U"
        return userName.charAt(0).toUpperCase()
    }

    return (
        <>
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-white/10">
                    <AvatarImage src={currentAvatarUrl || undefined} alt={userName || "User"} />
                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex items-center gap-3 text-white/60">
                            <Upload size={20} />
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {isDragActive ? "Suelta la imagen aquí" : "Cambiar perfil"}
                                </p>
                                <p className="text-xs text-white/40">
                                    Imagen cuadrada, mínimo 300x300px. Máx. 2 MB (JPG, PNG, WebP)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crop Modal */}
            <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recortar Foto de Perfil</DialogTitle>
                    </DialogHeader>

                    <div className="relative h-[400px] bg-black/50 rounded-lg overflow-hidden">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/60">Zoom</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCropModal(false)
                                setImageSrc(null)
                            }}
                            disabled={uploading}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveCrop} disabled={uploading}>
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                "Guardar Foto"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
