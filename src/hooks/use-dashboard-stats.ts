"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
    totalRevenue: number
    totalCustomers: number
    totalRewards: number
    totalStamps: number
    revenueChange: string
    customersChange: string
    rewardsChange: string
    stampsChange: string
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalCustomers: 0,
        totalRewards: 0,
        totalStamps: 0,
        revenueChange: "+0%",
        customersChange: "+0%",
        rewardsChange: "+0%",
        stampsChange: "+0%"
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Fetch total customers
            const { count: customersCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })

            // Fetch total stamps
            const { data: customersData } = await supabase
                .from('customers')
                .select('stamps, visits')

            const totalStamps = customersData?.reduce((sum, c) => sum + (c.stamps || 0), 0) || 0
            const totalVisits = customersData?.reduce((sum, c) => sum + (c.visits || 0), 0) || 0

            // Mock revenue calculation (you can replace with actual revenue table)
            const estimatedRevenue = totalVisits * 25 // Assuming S/. 25 per visit

            setStats({
                totalRevenue: estimatedRevenue,
                totalCustomers: customersCount || 0,
                totalRewards: Math.floor(totalStamps / 10), // Assuming 10 stamps = 1 reward
                totalStamps: totalStamps,
                revenueChange: "+12.5%", // TODO: Calculate from historical data
                customersChange: "+3.2%",
                rewardsChange: "+18%",
                stampsChange: "+5.4%"
            })
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
        } finally {
            setLoading(false)
        }
    }

    return { stats, loading, refresh: fetchStats }
}
