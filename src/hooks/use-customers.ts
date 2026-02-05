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
                .from('Customer') // Matches Prisma Model Name
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
        } catch (err) {
            console.error("Fetch Error:", err)
            setCustomers(MOCK_CUSTOMERS)
        } finally {
            setLoading(false)
        }
    }

    return { customers, loading, refresh: fetchCustomers }
}

const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "1",
        name: "Juan Pérez (Demo)",
        email: "juan@example.com",
        phone: "+51 900 000 001",
        stamps: 4,
        visits: 12,
        last_visit: new Date().toISOString(),
        status: "active",
        tier: "Silver"
    },
    {
        id: "2",
        name: "Maria Garcia (Demo)",
        email: "maria@example.com",
        phone: "+51 900 000 002",
        stamps: 8,
        visits: 24,
        last_visit: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "active",
        tier: "Gold"
    },
    {
        id: "3",
        name: "Carlos Lopez (Demo)",
        email: "carlos@example.com",
        phone: "+51 900 000 003",
        stamps: 1,
        visits: 3,
        last_visit: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: "inactive",
        tier: "Bronze"
    }
]
