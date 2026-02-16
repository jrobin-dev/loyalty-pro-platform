"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTenant } from "@/contexts/tenant-context"

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
    const { activeTenantId } = useTenant()
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
        if (activeTenantId) {
            fetchStats()
        }
    }, [dateRange, activeTenantId])

    const fetchStats = async () => {
        try {
            if (!activeTenantId) {
                setLoading(false)
                return
            }

            setLoading(true)
            const supabase = createClient()

            // Fetch customers for this tenant
            const { data: customers, error: customersError } = await supabase
                .from('Customer')
                .select('*')
                .eq('tenantId', activeTenantId)

            if (customersError) {
                console.error('Customers error:', customersError)
            }

            // Fetch stamp transactions for revenue calculation
            const { data: transactions, error: transactionsError } = await supabase
                .from('StampTransaction')
                .select('amount, stampsEarned')
                .eq('tenantId', activeTenantId)
                .eq('type', 'EARNED')

            if (transactionsError) {
                console.error('Transactions error:', transactionsError)
            }

            // Fetch redeemed transactions for rewards count
            const { data: redeemedTransactions, error: redeemedError } = await supabase
                .from('StampTransaction')
                .select('id')
                .eq('tenantId', activeTenantId)
                .eq('type', 'REDEEMED')

            if (redeemedError) {
                console.error('Redeemed error:', redeemedError)
            }

            // Calculate stats
            const totalCustomers = customers?.length || 0
            const totalStamps = customers?.reduce((sum, c) => sum + (c.currentStamps || 0), 0) || 0
            const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
            const totalRewards = redeemedTransactions?.length || 0

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
