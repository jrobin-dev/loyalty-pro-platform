"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useRef } from "react"
import Image from "next/image"

export default function Step6LogoUpload() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("El archivo es demasiado grande (Máx 2MB)")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                updateData({ logoUrl: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveLogo = () => {
        updateData({ logoUrl: undefined })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-funnel-display)]">
                    Sube tu Logo
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Lo mostraremos en la cabecera de la tarjeta.
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 py-6">
                <div
                    className={`
                relative w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group
                ${data.logoUrl ? 'border-primary' : 'border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 hover:bg-gray-50 dark:hover:bg-white/5'}
            `}
                >
                    {data.logoUrl ? (
                        <>
                            <Image
                                src={data.logoUrl}
                                alt="Logo Preview"
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={handleRemoveLogo}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="text-white" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center gap-2 text-gray-400 dark:text-white/50 group-hover:text-primary transition-colors"
                        >
                            <Upload size={32} />
                            <span className="text-xs font-medium">Subir Imagen</span>
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <p className="text-xs text-gray-500 dark:text-white/40 text-center max-w-[200px]">
                    Recomendado: 500x500px <br /> PNG transparente o JPG
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                {/* Allow skipping logo? Maybe yes */}
                <Button variant="ghost" className="flex-1" onClick={prevStep}>
                    Atrás
                </Button>
                <Button
                    className="flex-1 text-lg font-bold"
                    size="lg"
                    onClick={nextStep}
                >
                    {data.logoUrl ? 'Continuar' : 'Saltar por ahora'}
                </Button>
            </div>
        </div>
    )
}
