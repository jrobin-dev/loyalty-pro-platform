"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export type Customer = {
    id: string
    business_id: string
    name: string
    email: string
    phone: string
    stamps: number
    visits: number
    last_visit: string
    status: string
    tier: string
    rewards?: number
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

            // Get authenticated user's session
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                console.error('No authenticated user')
                setCustomers([])
                setLoading(false)
                return
            }

            // Get user's business first
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('id')
                .eq('user_id', session.user.id)
                .single()

            if (businessError || !businessData) {
                console.error("Business Error:", businessError)
                setCustomers([])
                setLoading(false)
                return
            }

            // Fetch customers for this business
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('business_id', businessData.id)
                .order('last_visit', { ascending: false })

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
