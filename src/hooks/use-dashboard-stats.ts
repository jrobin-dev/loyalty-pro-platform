"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface DashboardStats {
    totalRevenue: number
    totalCustomers: number
    totalRewards: number
    totalStamps: number
    revenueChange: number
    customersChange: number
    rewardsChange: number
    stampsChange: number
}

interface UseDashboardStatsProps {
    dateRange?: { start: string; end: string }
}

export function useDashboardStats({ dateRange }: UseDashboardStatsProps = {}) {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalCustomers: 0,
        totalRewards: 0,
        totalStamps: 0,
        revenueChange: 0,
        customersChange: 0,
        rewardsChange: 0,
        stampsChange: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [dateRange])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const supabase = createClient()

            // Get authenticated user
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.user) {
                console.error('No authenticated user')
                setLoading(false)
                return
            }

            // Get user's tenant
            const { data: tenantData, error: tenantError } = await supabase
                .from('Tenant')
                .select('id')
                .eq('ownerId', session.user.id)
                .single()

            if (tenantError || !tenantData) {
                console.error('Tenant error:', tenantError)
                setLoading(false)
                return
            }

            // Fetch customers for this tenant
            const { data: customers, error: customersError } = await supabase
                .from('Customer')
                .select('*')
                .eq('tenantId', tenantData.id)

            if (customersError) {
                console.error('Customers error:', customersError)
            }

            // Fetch stamp transactions for revenue calculation
            const { data: transactions, error: transactionsError } = await supabase
                .from('StampTransaction')
                .select('amount, stampsEarned')
                .eq('tenantId', tenantData.id)
                .eq('type', 'EARNED')

            if (transactionsError) {
                console.error('Transactions error:', transactionsError)
            }

            // Calculate stats
            const totalCustomers = customers?.length || 0
            const totalStamps = customers?.reduce((sum, c) => sum + (c.currentStamps || 0), 0) || 0
            const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
            const totalRewards = 0 // TODO: Calculate from redeemed stamps

            setStats({
                totalRevenue,
                totalCustomers,
                totalRewards,
                totalStamps,
                revenueChange: 0,
                customersChange: 0,
                rewardsChange: 0,
                stampsChange: 0,
            })
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
        } finally {
            setLoading(false)
        }
    }

    return { stats, loading, refresh: fetchStats }
}
