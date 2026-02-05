"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export type Customer = {
    id: string
    name: string
    email: string
    phone: string
    stamps: number
    visits: number
    last_visit: string
    status: string
    tier: string
    rewards?: number // Optional field for rewards earned
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

            // Check if connection works (fails if keys are missing)
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.log("Using Mock Data (No Supabase URL)")
                setCustomers([])
                return
            }

            // First, get the current user's business
            const { getUserId } = await import("@/lib/user")
            const userId = getUserId()

            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('id')
                .eq('user_id', userId)
                .single()

            if (businessError || !businessData) {
                console.error("Business not found:", businessError)
                setCustomers([])
                return
            }

            // Now fetch customers for this business
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

    return { customers, loading, refresh: fetchCustomers }
}
