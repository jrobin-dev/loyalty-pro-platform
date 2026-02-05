"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export interface Business {
    id: string
    user_id: string
    name: string
    logo_url?: string
    primary_color: string
    secondary_color: string
    stamps_required: number
    reward_description: string
    created_at: string
    updated_at: string
}

export function useBusiness() {
    const [business, setBusiness] = useState<Business | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchBusiness = async () => {
        try {
            setLoading(true)

            // Get authenticated user from Supabase Auth
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                console.error('No authenticated user found')
                setLoading(false)
                return
            }

            const userId = session.user.id

            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                // If no business exists, this shouldn't happen after onboarding
                // but we handle it gracefully
                if (error.code === 'PGRST116') {
                    console.error('No business found for user:', userId)
                    toast.error('No se encontró configuración del negocio')
                } else {
                    console.error('Error fetching business:', error)
                    toast.error('Error al cargar configuración del negocio')
                }
            } else {
                setBusiness(data)
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al cargar datos del negocio')
        } finally {
            setLoading(false)
        }
    }

    const updateBusiness = async (updates: Partial<Business>) => {
        if (!business) return

        try {
            const { data, error } = await supabase
                .from('businesses')
                .update(updates)
                .eq('id', business.id)
                .select()
                .single()

            if (error) {
                console.error('Error updating business:', error)
                toast.error('Error al actualizar configuración')
                return false
            }

            setBusiness(data)
            toast.success('Configuración actualizada correctamente')
            return true
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al guardar cambios')
            return false
        }
    }

    useEffect(() => {
        fetchBusiness()
    }, [])

    return {
        business,
        loading,
        updateBusiness,
        refresh: fetchBusiness
    }
}
