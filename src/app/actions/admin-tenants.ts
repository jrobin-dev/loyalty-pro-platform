'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTenants() {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                owner: {
                    select: {
                        name: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        console.log(`[getTenants] Found ${tenants.length} tenants`) // Debug log
        return { success: true, data: tenants }
    } catch (error) {
        console.error("Error fetching tenants:", error)
        return { success: false, error: "Error al obtener clientes" }
    }
}

export async function createTenant(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const slug = formData.get("slug") as string
        const ownerEmail = formData.get("ownerEmail") as string
        const plan = formData.get("plan") as string || "FREE"

        if (!name || !slug || !ownerEmail) {
            return { success: false, error: "Faltan campos requeridos" }
        }

        const owner = await prisma.user.findUnique({
            where: { email: ownerEmail }
        })

        if (!owner) {
            return { success: false, error: "No existe usuario con ese email" }
        }

        const newTenant = await prisma.tenant.create({
            data: {
                name,
                slug,
                ownerId: owner.id,
                plan,
                status: 'ACTIVE'
            } as any
        })

        revalidatePath("/admin/tenants")
        return { success: true, data: newTenant }
    } catch (error) {
        console.error("Error creating tenant:", error)
        return { success: false, error: "Error al crear cliente" }
    }
}

export async function updateTenantStatus(tenantId: string, status: string) {
    try {
        await prisma.tenant.update({
            where: { id: tenantId },
            data: { status } as any
        })
        revalidatePath("/admin/tenants")
        return { success: true }
    } catch (error) {
        console.error("Error updating tenant status:", error)
        return { success: false, error: "Error al actualizar estado" }
    }
}

export async function updateTenantPlan(tenantId: string, plan: string) {
    try {
        await prisma.tenant.update({
            where: { id: tenantId },
            data: { plan }
        })
        revalidatePath("/admin/tenants")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error updating plan" }
    }
}

export async function updateTenant(tenantId: string, data: { name?: string, slug?: string, plan?: string, status?: string }) {
    try {
        await prisma.tenant.update({
            where: { id: tenantId },
            data
        })
        revalidatePath("/admin/tenants")
        return { success: true }
    } catch (error) {
        console.error("Error updating tenant:", error)
        return { success: false, error: "Error actualizando negocio" }
    }
}

export async function deleteTenant(tenantId: string) {
    try {
        // Optional: Check if tenant has critical data before deleting?
        // For now, hard delete. Cascading deletes might be needed if schema doesn't handle it.
        // Prisma usually needs explicit cascade or manual delete of related records.
        // Assuming schema has some cascades or we delete related first.
        // Let's delete related records manually to be safe if not cascaded.

        // Transaction to delete everything
        await prisma.$transaction(async (tx) => {
            await tx.stampTransaction.deleteMany({ where: { tenantId } })
            await tx.customer.deleteMany({ where: { tenantId } })
            await tx.loyaltyProgram.deleteMany({ where: { tenantId } })
            await tx.branding.deleteMany({ where: { tenantId } })
            await tx.tenant.delete({ where: { id: tenantId } })
        })

        revalidatePath("/admin/tenants")
        return { success: true }
    } catch (error) {
        console.error("Error deleting tenant:", error)
        return { success: false, error: "Error eliminando negocio" }
    }
}
