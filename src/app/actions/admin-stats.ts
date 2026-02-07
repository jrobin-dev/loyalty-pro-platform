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

        // Mock revenue calculation based on plans
        // In a real app, this would query a Payments/Invoices table
        const proTenants = await prisma.tenant.count({ where: { plan: 'PRO' } })
        const plusTenants = await prisma.tenant.count({ where: { plan: 'PLUS' } })
        const estimatedMRR = (proTenants * 29) + (plusTenants * 49)

        return {
            success: true,
            data: {
                totalTenants,
                totalUsers,
                activeRate: totalTenants > 0 ? Math.round((activeTenants / totalTenants) * 100) : 0,
                mrr: estimatedMRR
            }
        }
    } catch (error: any) {
        console.error("Error fetching admin stats:", error)
        return { success: false, error: "Error al cargar estadísticas" }
    }
}
