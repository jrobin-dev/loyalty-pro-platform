import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BusinessData {
    // Authentication
    email: string
    password: string

    businessName: string
    category: string
    customCategory?: string

    // Contact
    ownerName: string
    whatsapp: string
    country: string

    // Branding
    stampType: string // e.g., 'coffee', 'pizza', 'star'
    stampsRequired: number
    rewardDescription: string
    primaryColor: string
    secondaryColor: string
    gradientEnabled: boolean
    gradientDirection?: string
    currency?: string

    // Assets
    logoUrl?: string
    customIconUrl?: string
}

interface OnboardingState {
    currentStep: number
    totalSteps: number
    data: BusinessData

    setStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void
    updateData: (data: Partial<BusinessData>) => void
    reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            currentStep: 1,
            totalSteps: 9,
            data: {
                email: '',
                password: '',
                businessName: '',
                category: '',
                ownerName: '',
                whatsapp: '',
                country: '+51', // Default Peru based on user context
                stampType: 'coffee',
                stampsRequired: 6,
                rewardDescription: '¡Premio gratis!',
                primaryColor: '#00FF94', // Neon Green
                secondaryColor: '#000000',
                gradientEnabled: true,
                gradientDirection: 'to right',
                currency: '$',
                customIconUrl: '',
            },

            setStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
            updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
            reset: () => set({ currentStep: 1 }),
        }),
        {
            name: 'loyalty-onboarding-storage',
        }
    )
)
