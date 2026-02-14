"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface TenantSettings {
    // Tenant data
    tenant: {
        id: string
        slug: string
        name: string
        category?: string
        plan: string
        currency: string
    }
    // Branding data
    branding: {
        id: string
        primaryColor: string
        secondaryColor: string
        logoUrl?: string
        fontFamily: string
        gradient: boolean
        gradientDirection: string
        currency: string
    }
    // Loyalty Program data
    // Loyalty Program data
    loyaltyProgram: {
        id: string
        stampIcon: string
        customIconUrl?: string
        rewardImage?: string
        stampsRequired: number
        rewardTitle: string
    }
}

export function useTenantSettings() {
    const [settings, setSettings] = useState<TenantSettings | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = async () => {
        try {
            if (!settings) setLoading(true)

            const response = await fetch(`/api/settings?t=${Date.now()}`)

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('No authenticated user')
                    return
                }
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error fetching settings')
            }

            const data = await response.json()

            // Combine all data
            setSettings({
                tenant: data.tenant,
                branding: data.branding || {
                    id: '', // Will be ignored in upsert
                    primaryColor: '#00FF94',
                    secondaryColor: '#000000',
                    logoUrl: null,
                    fontFamily: 'Funnel Display',
                    gradient: false,
                    gradientDirection: 'to right',
                    currency: '$'
                },
                loyaltyProgram: data.loyaltyProgram || {
                    id: '',
                    stampIcon: 'star',
                    customIconUrl: '',
                    stampsRequired: 6,
                    rewardTitle: '¡Premio gratis!'
                }
            })

        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error('Error al cargar configuración')
        } finally {
            setLoading(false)
        }
    }

    const updateTenant = async (updates: Partial<TenantSettings['tenant']>) => {
        if (!settings) return false

        try {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenant: updates })
            })

            if (!response.ok) throw new Error('Error updating tenant')

            await fetchSettings()
            toast.success('Negocio actualizado correctamente')
            return true
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al guardar cambios')
            return false
        }
    }

    const updateBranding = async (updates: Partial<TenantSettings['branding']>) => {
        if (!settings) return false

        try {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branding: updates })
            })

            if (!response.ok) throw new Error('Error updating branding')

            await fetchSettings()
            toast.success('Colores actualizados correctamente')
            return true
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al guardar cambios')
            return false
        }
    }

    const updateLoyaltyProgram = async (updates: Partial<TenantSettings['loyaltyProgram']>) => {
        if (!settings) return false

        try {
            const supabase = createClient()
            // Check if exists
            const { data: existing } = await supabase
                .from('LoyaltyProgram')
                .select('id')
                .eq('tenantId', settings.tenant.id)
                .single()

            let error;

            console.log('Updating Loyalty Program with:', updates)

            if (existing) {
                const { data: updatedData, error: updateError } = await supabase
                    .from('LoyaltyProgram')
                    .update(updates)
                    .eq('id', existing.id)
                    .select()

                console.log('Supabase Update Result:', { updatedData, updateError })

                if (updateError) console.error('Supabase Update Error:', updateError)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('LoyaltyProgram')
                    .insert({
                        tenantId: settings.tenant.id,
                        ...updates
                    })
                if (insertError) console.error('Supabase Insert Error:', insertError)
                error = insertError
            }

            if (error) {
                console.error('Error updating loyalty program:', error)
                toast.error('Error al actualizar programa de lealtad')
                return false
            }

            console.log('Update successful, fetching settings...')
            await fetchSettings()
            console.log('Settings fetched')
            toast.success('Programa de lealtad actualizado correctamente')
            return true
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al guardar cambios')
            return false
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    return {
        settings,
        loading,
        updateTenant,
        updateBranding,
        updateLoyaltyProgram,
        refresh: fetchSettings
    }
}
