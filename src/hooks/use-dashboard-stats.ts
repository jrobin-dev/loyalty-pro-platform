"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

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
            // Build query with optional date filtering
            let query = supabase.from('customers').select('*')

            if (dateRange) {
                query = query
                    .gte('last_visit', dateRange.start)
                    .lte('last_visit', dateRange.end)
            }

            const { data: customers, error } = await query

            if (error) throw error

            if (customers) {
                // Calculate stats from customer data
                const totalStamps = customers.reduce((sum, c) => sum + (c.stamps || 0), 0)
                const totalVisits = customers.reduce((sum, c) => sum + (c.visits || 0), 0)
                const totalRewards = Math.floor(totalStamps / 10)
                const estimatedRevenue = totalVisits * 35 // Assuming average S/. 35 per visit

                setStats({
                    totalRevenue: estimatedRevenue,
                    totalCustomers: customers.length,
                    totalRewards,
                    totalStamps,
                    revenueChange: 0,
                    customersChange: 0,
                    rewardsChange: 0,
                    stampsChange: 0,
                })
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
        } finally {
            setLoading(false)
        }
    }

    return { stats, loading, refresh: fetchStats }
}
