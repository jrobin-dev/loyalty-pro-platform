"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"

export default function Step6LogoUpload() {
    const { data, updateData, nextStep, prevStep } = useOnboardingStore()

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
                <Button variant="ghost" className="flex-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors" onClick={prevStep}>
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
