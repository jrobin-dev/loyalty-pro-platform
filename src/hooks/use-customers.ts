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
                // Use fallback mock data if no env vars
                setCustomers(MOCK_CUSTOMERS)
                return
            }

            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('last_visit', { ascending: false })

            if (error) {
                console.error("Supabase Error:", error)
                // Fallback to mock on error (e.g. table doesn't exist yet)
                setCustomers(MOCK_CUSTOMERS)
                toast.error("Error cargando clientes. Usando datos demo.")
            } else {
                if (data && data.length > 0) {
                    setCustomers(data)
                } else {
                    // Empty table, use empty array
                    setCustomers([])
                }
            }
            // For now, return empty array if no customers exist
            // In production, this will be populated as customers are added
            setCustomers([])
        } catch (err) {
            console.error("Fetch Error:", err)
            setCustomers([]) // Return empty on fetch error
        } finally {
            setLoading(false)
        }
    }

    return { customers, loading, refresh: fetchCustomers }
}
