"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export type Customer = {
    id: string
    userId?: string
    tenantId: string
    totalStamps: number
    currentStamps: number
    joinedAt: string
    // Compatibility fields for existing components
    name: string
    lastName?: string
    email: string
    phone: string
    birthday?: Date | null
    stamps: number
    visits: number
    last_visit: string
    avatarUrl?: string
    status?: string
}

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [tenantSlug, setTenantSlug] = useState<string>("")

    const router = useRouter()

    // Load cache on mount securely
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem("customers_cache")
            if (cached) {
                setCustomers(JSON.parse(cached))
                setLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            // Only show loading if we don't have cached data to show
            if (!localStorage.getItem("customers_cache")) {
                setLoading(true)
            }

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
                .select('id, slug')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                console.error("Tenant Error:", tenantError)
                setCustomers([])
                setLoading(false)
                return
            }

            setTenantSlug(tenantData.slug)

            // Fetch customers for this tenant with user data
            const { data, error } = await supabase
                .from('Customer')
                .select(`
                    *,
                    user:User (
                        name,
                        lastName,
                        email,
                        phone,
                        birthday,
                        avatarUrl
                    )
                `)
                .eq('tenantId', tenantData.id)
                .order('joinedAt', { ascending: false })

            if (error) {
                console.error("Supabase Error:", error)
                // Don't clear customers on error if we have cache, maybe show toast
                if (!localStorage.getItem("customers_cache")) {
                    setCustomers([])
                }
                toast.error("Error cargando clientes actualizados.")
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
                    lastName: customer.user?.lastName || '',
                    email: customer.user?.email || '',
                    phone: customer.user?.phone || '',
                    birthday: customer.user?.birthday ? new Date(customer.user.birthday) : null,
                    avatarUrl: customer.user?.avatarUrl,
                    stamps: customer.currentStamps,
                    visits: customer.totalStamps, // Approximate
                    last_visit: customer.joinedAt,
                    status: 'active'
                }))

                setCustomers(transformedData)

                // Update cache
                if (typeof window !== 'undefined') {
                    localStorage.setItem("customers_cache", JSON.stringify(transformedData))
                }
            }
        } catch (err) {
            console.error("Fetch Error:", err)
            // Only clear if no cache
            if (!localStorage.getItem("customers_cache")) {
                setCustomers([])
            }
        } finally {
            setLoading(false)
        }
    }

    const refresh = async () => {
        // Small delay to allow DB propagation/ triggers to run
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchCustomers()
        router.refresh()
    }

    return {
        customers,
        loading,
        refresh,
        tenantSlug
    }
}
