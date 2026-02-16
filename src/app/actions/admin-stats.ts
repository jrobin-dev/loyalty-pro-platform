'use server'

import prisma from "@/lib/prisma"

export async function getAdminStats() {
    try {
        // Run in parallel for performance
        const [
            totalTenants,
            totalUsers,
            activeTenants,
        ] = await Promise.all([
            prisma.tenant.count(),
            prisma.user.count(),
            prisma.tenant.count({ where: { status: 'ACTIVE' } }),
        ])

        // Calculate 6-month revenue history
        const revenueHistory = []
        const now = new Date()

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthLabel = date.toLocaleString('default', { month: 'short' })

            // End of this month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

            const [proCount, plusCount] = await Promise.all([
                prisma.user.count({
                    where: {
                        plan: 'PRO',
                        createdAt: { lte: endOfMonth }
                    }
                }),
                prisma.user.count({
                    where: {
                        plan: 'PLUS',
                        createdAt: { lte: endOfMonth }
                    }
                })
            ])

            revenueHistory.push({
                month: monthLabel,
                mrr: (proCount * 29) + (plusCount * 49)
            })
        }

        // Get current counts for the final MRR total
        const [currentProUsers, currentPlusUsers] = await Promise.all([
            prisma.user.count({ where: { plan: 'PRO' } }),
            prisma.user.count({ where: { plan: 'PLUS' } })
        ])

        return {
            success: true,
            data: {
                totalTenants,
                totalUsers,
                activeRate: totalTenants > 0 ? Math.round((activeTenants / totalTenants) * 100) : 0,
                mrr: (currentProUsers * 29) + (currentPlusUsers * 49),
                revenueHistory
            }
        }
    } catch (error: any) {
        console.error("Error fetching admin stats:", error)
        return { success: false, error: "Error al cargar estadísticas" }
    }
}
