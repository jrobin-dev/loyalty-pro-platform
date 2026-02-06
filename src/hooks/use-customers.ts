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
    // Compatibility fields for existing components
    name: string
    email: string
    phone: string
    stamps: number
    visits: number
    last_visit: string
    status: string
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

            // Fetch customers for this tenant with user data
            const { data, error } = await supabase
                .from('Customer')
                .select(`
                    *,
                    user:User (
                        name,
                        email
                    )
                `)
                .eq('tenantId', tenantData.id)
                .order('joinedAt', { ascending: false })

            if (error) {
                console.error("Supabase Error:", error)
                setCustomers([])
                toast.error("Error cargando clientes.")
            } else {
                // Transform data to match expected format
                const transformedData = (data || []).map((customer: any) => ({
                    id: customer.id,
                    userId: customer.userId,
                    tenantId: customer.tenantId,
                    totalStamps: customer.totalStamps,
                    currentStamps: customer.currentStamps,
                    joinedAt: customer.joinedAt,
                    // Compatibility fields
                    name: customer.user?.name || 'Cliente',
                    email: customer.user?.email || '',
                    phone: '', // Not in current schema
                    stamps: customer.currentStamps,
                    visits: customer.totalStamps, // Approximate
                    last_visit: customer.joinedAt,
                    status: 'active'
                }))
                setCustomers(transformedData)
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
