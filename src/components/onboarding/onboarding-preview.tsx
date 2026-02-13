"use client"

import React from 'react'
import { useOnboardingStore } from '@/store/onboarding-store'
import { IphoneFrame } from '@/components/ui/iphone-frame'
import { WalletCard } from '@/components/wallet/wallet-card'
import { LogOut } from 'lucide-react'

export const OnboardingPreview = () => {
    const { data } = useOnboardingStore()

    // Mock tenant data for the preview
    const previewTenant = {
        name: data.businessName || 'Tu Negocio',
        branding: {
            primaryColor: data.primaryColor || '#00FF94',
            secondaryColor: data.secondaryColor || '#000000',
            logoUrl: data.logoUrl,
            currency: data.currency || '$',
        },
        loyalty: {
            stampsRequired: data.stampsRequired || 6,
            rewardTitle: data.rewardDescription || '¡Escribe tu premio!',
            stampIcon: data.stampType || 'coffee',
            customIconUrl: data.customIconUrl,
            rewardImage: undefined, // Default is usually fine
        }
    }

    // Mock customer data
    const previewCustomer = {
        name: data.ownerName || 'User',
        avatarUrl: undefined,
        id: 'DEMO-PREVIEW'
    }

    return (
        <div className="flex items-center justify-center h-full w-full pointer-events-none select-none p-4">
            <IphoneFrame>
                <div className="p-4 h-full flex flex-col bg-[#f0f9f4] dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300">
                    {/* Top Business Logo - Image 2 style */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="h-8 w-32 flex items-center">
                            {data.logoUrl ? (
                                <img src={data.logoUrl} alt="Logo" className="h-full w-auto object-contain object-left" />
                            ) : (
                                <div className="h-full items-center flex gap-2">
                                    <div className="w-8 h-8 bg-emerald-500/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span className="text-emerald-600 dark:text-primary font-bold text-xs">{data.businessName?.charAt(0) || 'B'}</span>
                                    </div>
                                    <span className="text-zinc-900 dark:text-white font-bold text-sm tracking-tight">{data.businessName || 'Negocio'}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                            <LogOut size={14} className="text-zinc-400 dark:text-white/40" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                        <div className="w-full scale-[0.95] origin-center">
                            <WalletCard
                                tenant={previewTenant}
                                customer={previewCustomer}
                                stamps={1} // Static for preview
                                maxStamps={data.stampsRequired || 6}
                                primaryColor={data.primaryColor || '#00FF94'}
                            />
                        </div>

                        {/* Bottom Stats Mockup */}
                        <div className="w-full grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col items-center">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{(data.stampsRequired || 6) - 1}</span>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-white/40 font-bold">Para Premio</span>
                            </div>
                            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-zinc-900 dark:text-white mb-1">Próximo Nivel</span>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-white/40 font-bold">En Breve</span>
                            </div>
                        </div>

                        {/* Recent Activity Mockup */}
                        <div className="w-full space-y-2">
                            <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-white/60 font-bold px-1">Actividad Reciente</h4>
                            <div className="bg-white dark:bg-white/5 rounded-2xl p-3 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-4 h-4 text-emerald-600 dark:text-emerald-500">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-zinc-900 dark:text-white">Consumo</p>
                                    <p className="text-[8px] text-zinc-400 dark:text-white/40">Hoy a las 08:45</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">+1 sello</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IphoneFrame>
        </div>
    )
}
