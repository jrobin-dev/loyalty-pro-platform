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
    }
    // Branding data
    branding: {
        id: string
        primaryColor: string
        secondaryColor: string
        logoUrl?: string
        fontFamily: string
        gradient: boolean
    }
    // Loyalty Program data
    loyaltyProgram: {
        id: string
        stampIcon: string
        stampsRequired: number
        rewardTitle: string
    }
}

export function useTenantSettings() {
    const [settings, setSettings] = useState<TenantSettings | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const supabase = createClient()

            // Get authenticated user
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                console.error('No authenticated user')
                setLoading(false)
                return
            }

            // Get Tenant
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select('*')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                console.error('Tenant error:', tenantError)
                toast.error('No se encontró configuración del negocio')
                setLoading(false)
                return
            }

            // Get Branding
            const { data: brandingData, error: brandingError } = await supabase
                .from('Branding')
                .select('*')
                .eq('tenantId', tenantData.id)
                .single()

            if (brandingError) {
                console.error('Branding error:', brandingError)
            }

            // Get Loyalty Program
            const { data: loyaltyData, error: loyaltyError } = await supabase
                .from('LoyaltyProgram')
                .select('*')
                .eq('tenantId', tenantData.id)
                .single()

            if (loyaltyError) {
                console.error('Loyalty error:', loyaltyError)
            }

            // Combine all data
            setSettings({
                tenant: {
                    id: tenantData.id,
                    slug: tenantData.slug,
                    name: tenantData.name,
                    category: tenantData.category,
                    plan: tenantData.plan
                },
                branding: brandingData || {
                    id: '',
                    primaryColor: '#00FF94',
                    secondaryColor: '#000000',
                    logoUrl: null,
                    fontFamily: 'Funnel Display',
                    gradient: false
                },
                loyaltyProgram: loyaltyData || {
                    id: '',
                    stampIcon: 'star',
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
            const supabase = createClient()
            const { error } = await supabase
                .from('Tenant')
                .update(updates)
                .eq('id', settings.tenant.id)

            if (error) {
                console.error('Error updating tenant:', error)
                toast.error('Error al actualizar negocio')
                return false
            }

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
            const supabase = createClient()
            const { error } = await supabase
                .from('Branding')
                .update(updates)
                .eq('id', settings.branding.id)

            if (error) {
                console.error('Error updating branding:', error)
                toast.error('Error al actualizar colores')
                return false
            }

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
            const { error } = await supabase
                .from('LoyaltyProgram')
                .update(updates)
                .eq('id', settings.loyaltyProgram.id)

            if (error) {
                console.error('Error updating loyalty program:', error)
                toast.error('Error al actualizar programa de lealtad')
                return false
            }

            await fetchSettings()
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
