"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useOnboardingStore } from "@/store/onboarding-store"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import Step0AccountInfo from "./steps/step-0-account-info"
import Step1BusinessInfo from "./steps/step-1-business-info"
import Step2StampType from "./steps/step-2-stamp-type"
import Step3StampsRequired from "./steps/step-3-stamps-required"
import Step4RewardDescription from "./steps/step-4-reward-description"
import Step4Branding from "./steps/step-4-branding"
import Step5OwnerInfo from "./steps/step-5-owner-info"
import Step6LogoUpload from "./steps/step-6-logo-upload"
import Step7Final from "./steps/step-7-final"
import { OnboardingPreview } from "./onboarding-preview"
import { ThemeToggle } from "@/components/theme-toggle"

export default function WizardLayout() {
    const { currentStep, totalSteps, setStep, updateData, data: onboardingData } = useOnboardingStore()
    const isLastStep = currentStep === totalSteps
    const searchParams = useSearchParams()
    const { profile, loading } = useUserProfile()
    const isNewMode = searchParams.get('mode') === 'new'

    // Handle initial state for mode=new
    useEffect(() => {
        if (isNewMode && profile) {
            console.log("🛠️ Mode 'new' detected. Pre-filling data from profile.")

            // Pre-fill email and owner info
            updateData({
                email: profile.email,
                ownerName: `${profile.name || ''} ${profile.lastName || ''}`.trim(),
                whatsapp: profile.phone?.split(' ').slice(1).join(' ') || onboardingData.whatsapp,
                country: profile.phone?.split(' ')[0] || onboardingData.country,
                // We use a dummy password or flag to indicate it's an existing user
                password: 'ALREADY_AUTHENTICATED'
            })

            // If we are at the beginning, skip account creation
            if (currentStep === 1) {
                setStep(2)
            }
        }
    }, [isNewMode, profile])

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step0AccountInfo />
            case 2: return <Step1BusinessInfo />
            case 3: return <Step2StampType />
            case 4: return <Step3StampsRequired />
            case 5: return <Step4RewardDescription />
            case 6: return <Step4Branding />
            case 7: {
                // If in new mode, we can skip OwnerInfo if we already have it
                // or just let them confirm it. Let's let them confirm it.
                return <Step5OwnerInfo />
            }
            case 8: return <Step6LogoUpload />
            case 9: return <Step7Final />
            default: return <Step0AccountInfo />
        }
    }

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col lg:flex-row">
            {/* Left Column: Forms */}
            <div className="flex-1 flex flex-col h-full min-h-screen overflow-y-auto">
                <main className={`flex-1 w-full mx-auto px-6 py-12 lg:py-20 flex flex-col ${isLastStep ? 'max-w-[800px] items-center justify-center' : 'max-w-[600px]'}`}>
                    {!isLastStep && (
                        <div className="mb-12 w-full">
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                        <span className="text-black font-black text-xl">L</span>
                                    </div>
                                    <span className="text-xl font-black tracking-tighter">
                                        Loyalty<span className="text-primary">Pro</span>
                                    </span>
                                </Link>
                                <ThemeToggle />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h1 className="text-sm font-black text-zinc-500 uppercase tracking-widest">
                                        Configuración del Sistema
                                    </h1>
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                                        Paso {currentStep} de {totalSteps}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "circOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/50 dark:bg-transparent lg:border-0 lg:p-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer / Powered By */}
                    {!isLastStep && (
                        <div className="mt-auto pt-12 text-center lg:text-left border-t border-gray-100 dark:border-white/5 mt-12 pt-8">
                            <p className="text-xs text-muted-foreground">
                                Impulsado por <span className="text-emerald-500 font-bold">LoyaltyPro</span> &bull; 2026
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Right Column: Premium Preview (Desktop Only) */}
            {!isLastStep && (
                <div className="hidden lg:flex flex-1 bg-zinc-50 dark:bg-zinc-950 items-center justify-center relative overflow-hidden">
                    {/* Decorative Background for Preview */}
                    <div className="absolute inset-0 opacity-20 dark:opacity-40">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
                        className="z-10 w-full h-full flex items-center justify-center"
                    >
                        <OnboardingPreview />
                    </motion.div>
                </div>
            )}
        </div>
    )
}
