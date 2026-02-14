"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"

export default function Step6LogoUpload() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">
                    Sube tu Logo
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                    Lo mostraremos en la cabecera de la tarjeta.
                </p>
            </div>

            <div className="flex flex-col items-center gap-6 py-6">
                <div className="max-w-xs w-full">
                    <ImageUpload
                        value={data.logoUrl || ""}
                        onChange={(url) => updateData({ logoUrl: url })}
                        onRemove={() => updateData({ logoUrl: undefined })}
                        bucket="avatars"
                    />
                </div>

                <p className="text-xs text-gray-500 dark:text-white/40 text-center max-w-[200px]">
                    Recomendado: 500x500px <br /> PNG transparente o JPG
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    variant="ghost"
                    className="flex-1 h-15 rounded-2xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all font-bold"
                    onClick={prevStep}
                >
                    Atrás
                </Button>
                <button
                    onClick={nextStep}
                    className="flex-1 h-15 rounded-2xl bg-emerald-500 text-black font-black text-xl transition-all hover:bg-emerald-400 active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center py-4"
                >
                    {data.logoUrl ? 'Continuar' : 'Saltar por ahora'}
                </button>
            </div>
        </div>
    )
}
