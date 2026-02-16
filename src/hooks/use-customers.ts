"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTenant } from "@/contexts/tenant-context"

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
    const { activeTenantId } = useTenant()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [tenantSlug, setTenantSlug] = useState<string>("")

    const router = useRouter()

    // Load cache on mount securely
    useEffect(() => {
        if (typeof window !== 'undefined' && activeTenantId) {
            const cached = localStorage.getItem(`customers_cache_${activeTenantId}`)
            if (cached) {
                setCustomers(JSON.parse(cached))
                setLoading(false)
            }
        }
    }, [activeTenantId])

    useEffect(() => {
        if (activeTenantId) {
            fetchCustomers()
        }
    }, [activeTenantId])

    const fetchCustomers = async () => {
        try {
            if (!activeTenantId) {
                setLoading(false)
                return
            }

            // Only show loading if we don't have cached data to show
            if (!localStorage.getItem(`customers_cache_${activeTenantId}`)) {
                setLoading(true)
            }

            const supabase = createClient()

            // Fetch customers for this tenant with user data and transactions
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
                    ),
                    transactions:StampTransaction (
                        createdAt
                    )
                `)
                .eq('tenantId', activeTenantId)
                .order('joinedAt', { ascending: false })

            if (error) {
                console.error("Supabase Error:", error)
                if (!localStorage.getItem(`customers_cache_${activeTenantId}`)) {
                    setCustomers([])
                }
                toast.error("Error cargando clientes actualizados.")
            } else {
                // Transform data to match expected format
                const transformedData = (data || []).map((customer: any) => {
                    let lastVisitDate = customer.joinedAt

                    if (customer.transactions && customer.transactions.length > 0) {
                        const latestTransaction = customer.transactions.reduce((latest: string, current: any) => {
                            return new Date(current.createdAt) > new Date(latest)
                                ? current.createdAt
                                : latest
                        }, customer.joinedAt)
                        lastVisitDate = latestTransaction
                    }

                    return {
                        id: customer.id,
                        userId: customer.userId,
                        tenantId: customer.tenantId,
                        totalStamps: customer.totalStamps,
                        currentStamps: customer.currentStamps,
                        joinedAt: customer.joinedAt,
                        name: customer.user?.name || 'Cliente',
                        lastName: customer.user?.lastName || '',
                        email: customer.user?.email || '',
                        phone: customer.user?.phone || '',
                        birthday: customer.user?.birthday ? new Date(customer.user.birthday) : null,
                        avatarUrl: customer.user?.avatarUrl,
                        stamps: customer.currentStamps,
                        visits: customer.totalStamps,
                        last_visit: lastVisitDate,
                        status: 'active'
                    }
                })

                transformedData.sort((a: Customer, b: Customer) => {
                    return new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime()
                })

                setCustomers(transformedData)

                // Update cache per tenant
                if (typeof window !== 'undefined') {
                    localStorage.setItem(`customers_cache_${activeTenantId}`, JSON.stringify(transformedData))
                }
            }
        } catch (err) {
            console.error("Fetch Error:", err)
            if (!localStorage.getItem(`customers_cache_${activeTenantId}`)) {
                setCustomers([])
            }
        } finally {
            setLoading(false)
        }
    }

    const refresh = async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
        await fetchCustomers()
        router.refresh()
    }

    return {
        customers,
        loading,
        refresh,
        tenantSlug // Note: tenantSlug might need separate fetch if needed, but usually we have it in activeTenant object
    }
}
