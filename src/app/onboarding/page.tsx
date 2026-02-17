import { Suspense } from "react"
import WizardLayout from "@/components/onboarding/wizard-layout"

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>}>
            <WizardLayout />
        </Suspense>
    )
}
