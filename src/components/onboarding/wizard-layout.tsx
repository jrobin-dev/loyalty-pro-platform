"use client"

import { useOnboardingStore } from "@/store/onboarding-store"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

import Step1BusinessInfo from "./steps/step-1-business-info"
import Step2StampType from "./steps/step-2-stamp-type"
import Step3StampsRequired from "./steps/step-3-stamps-required"
import Step4RewardDescription from "./steps/step-4-reward-description"
import Step5Branding from "./steps/step-4-branding"
import Step6OwnerInfo from "./steps/step-5-owner-info"
import Step7LogoUpload from "./steps/step-6-logo-upload"
import Step8Final from "./steps/step-7-final"

export default function WizardLayout() {
    const { currentStep, totalSteps } = useOnboardingStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients - Deep Space Vibe */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-xl z-10">
                {/* Header */}
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold font-sans tracking-tight">
                        Configura tu Sistema de Lealtad
                    </h1>
                    <p className="text-muted-foreground">
                        Paso {currentStep} de {totalSteps}
                    </p>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                        <motion.div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Card Container - Glassmorphism No Border */}
                <div className="glass-card rounded-3xl p-8 shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && <Step1BusinessInfo />}
                            {currentStep === 2 && <Step2StampType />}
                            {currentStep === 3 && <Step3StampsRequired />}
                            {currentStep === 4 && <Step4RewardDescription />}
                            {currentStep === 5 && <Step5Branding />}
                            {currentStep === 6 && <Step6OwnerInfo />}
                            {currentStep === 7 && <Step7LogoUpload />}
                            {currentStep === 8 && <Step8Final />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
