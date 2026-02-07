'use server'

import prisma from "@/lib/prisma"

export async function getTenants() {
    try {
        const tenants = await prisma.tenant.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return {
            success: true,
            data: tenants
        }
    } catch (error: any) {
        console.error("Error fetching tenants:", error)
        return { success: false, error: "Error al cargar negocios" }
    }
}
