'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { syncUserTenants } from "@/lib/limits"

export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                tenants: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, data: users }
    } catch (error) {
        console.error("Error fetching admin users:", error)
        return { success: false, error: "Error al obtener la lista de usuarios" }
    }
}

export async function updateUserAdmin(userId: string, data: { plan?: string, role?: string }) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data
        })

        // If plan changed, sync business status (LIFO)
        if (data.plan) {
            await syncUserTenants(userId)
        }

        revalidatePath("/admin/users")
        revalidatePath("/admin")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Error updating user:", error)
        return { success: false, error: "Error al actualizar el usuario" }
    }
}

export async function deleteUserAdmin(userId: string) {
    try {
        // Warning: This is destructive. In a real SaaS we might want soft delete.
        // Also need to handle relations or cascading deletes.
        await prisma.$transaction(async (tx) => {
            // Delete related tenants and their data (cascading manually if needed)
            const tenants = await tx.tenant.findMany({ where: { ownerId: userId } })
            for (const tenant of tenants) {
                await tx.stampTransaction.deleteMany({ where: { tenantId: tenant.id } })
                await tx.customer.deleteMany({ where: { tenantId: tenant.id } })
                await tx.loyaltyProgram.deleteMany({ where: { tenantId: tenant.id } })
                await tx.branding.deleteMany({ where: { tenantId: tenant.id } })
                await tx.tenant.delete({ where: { id: tenant.id } })
            }
            await tx.user.delete({ where: { id: userId } })
        })

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Error al eliminar el usuario" }
    }
}

export async function sendBulkInvitations(emails: string[], role: string, plan: string) {
    try {
        console.log(`🚀 Sending invitations to: ${emails.join(", ")} as ${role} / ${plan}`);

        // In a real implementation, we would:
        // 1. Create a "UserInvitation" record with a token
        // 2. Send emails via Resend/SendGrid
        // 3. For now, we simulate.

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work

        return { success: true, count: emails.length }
    } catch (error) {
        console.error("Error sending bulk invitations:", error)
        return { success: false, error: "Error al enviar las invitaciones" }
    }
}

export async function getAdminUserDetails(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenants: {
                    include: {
                        _count: {
                            select: { customers: true }
                        },
                        loyalty: true,
                        branding: true
                    }
                }
            }
        })

        if (!user) return { success: false, error: "Usuario no encontrado" }

        return { success: true, data: user }
    } catch (error) {
        console.error("Error fetching user details:", error)
        return { success: false, error: "Error al obtener los detalles del usuario" }
    }
}
