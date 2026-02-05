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

            // For demo purposes, using a mock user_id
            // In production, get this from auth context
            const mockUserId = "demo-user-123"

            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('user_id', mockUserId)
                .single()

            if (error) {
                // If no business exists, create a default one
                if (error.code === 'PGRST116') {
                    const defaultBusiness = {
                        user_id: mockUserId,
                        name: "Mi Negocio",
                        primary_color: "#8B5CF6",
                        secondary_color: "#3B82F6",
                        stamps_required: 10,
                        reward_description: "¡Premio gratis!"
                    }

                    const { data: newBusiness, error: createError } = await supabase
                        .from('businesses')
                        .insert([defaultBusiness])
                        .select()
                        .single()

                    if (createError) {
                        console.error('Error creating business:', createError)
                        toast.error('Error al crear configuración del negocio')
                        return
                    }

                    setBusiness(newBusiness)
                    toast.success('Configuración inicial creada')
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
