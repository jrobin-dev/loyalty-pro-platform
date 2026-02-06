"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export type Customer = {
    id: string
    userId?: string
    tenantId: string
    totalStamps: number
    currentStamps: number
    joinedAt: string
    // Extended fields from User relation (if needed)
    name?: string
    email?: string
}

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const supabase = createClient()

            // Get authenticated user's session
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                console.error('No authenticated user')
                setCustomers([])
                setLoading(false)
                return
            }

            // Get user's tenant first
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select('id')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                console.error("Tenant Error:", tenantError)
                setCustomers([])
                setLoading(false)
                return
            }

            // Fetch customers for this tenant
            const { data, error } = await supabase
                .from('Customer')
                .select('*')
                .eq('tenantId', tenantData.id)
                .order('joinedAt', { ascending: false })

            if (error) {
                console.error("Supabase Error:", error)
                setCustomers([])
                toast.error("Error cargando clientes.")
            } else {
                setCustomers(data || [])
            }
        } catch (err) {
            console.error("Fetch Error:", err)
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    return {
        customers,
        loading,
        refresh: fetchCustomers
    }
}
