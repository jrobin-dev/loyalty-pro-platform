'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTenants(limit?: number) {
    try {
        const tenants = await prisma.tenant.findMany({
            take: limit, // Optimization: Limit rows if requested
            include: {
                owner: {
                    select: {
                        name: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                        plan: true
                    }
                },
                branding: {
                    select: {
                        logoUrl: true
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
        // Note: we might still receive a plan if the user is being created for the first time
        // but if the owner exists, we use their plan.
        const requestedPlan = formData.get("plan") as string || "FREE"

        if (!name || !slug || !ownerEmail) {
            return { success: false, error: "Faltan campos requeridos" }
        }

        const owner = await prisma.user.findFirst({
            where: { email: ownerEmail }
        })

        if (!owner) {
            return { success: false, error: "No existe usuario con ese email. Crea el usuario primero o regístralo." }
        }

        // Create Tenant with initial Branding and LoyaltyProgram
        const newTenant = await prisma.tenant.create({
            data: {
                name,
                slug,
                ownerId: owner.id,
                status: 'ACTIVE',
                branding: {
                    create: {
                        primaryColor: "#00FF94",
                        secondaryColor: "#000000",
                        fontFamily: "Funnel Display",
                    }
                },
                loyalty: {
                    create: {
                        stampIcon: "star",
                        stampsRequired: 6,
                        rewardTitle: "¡Premio gratis!"
                    }
                }
            },
            include: {
                branding: true,
                loyalty: true
            }
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
        // Since plan is now on User, we find the owner of this tenant
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { ownerId: true }
        })

        if (!tenant) return { success: false, error: "Negocio no encontrado" }

        await prisma.user.update({
            where: { id: tenant.ownerId },
            data: { plan }
        })

        revalidatePath("/admin/tenants")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Error updating plan:", error)
        return { success: false, error: "Error al actualizar el plan" }
    }
}

export async function updateTenant(tenantId: string, inputData: { name?: string, slug?: string, plan?: string, status?: string }) {
    try {
        const { plan, ...tenantData } = inputData

        // Update tenant fields
        await prisma.tenant.update({
            where: { id: tenantId },
            data: tenantData
        })

        // If plan is provided, update owner's plan
        if (plan) {
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { ownerId: true }
            })
            if (tenant) {
                await prisma.user.update({
                    where: { id: tenant.ownerId },
                    data: { plan }
                })
            }
        }

        revalidatePath("/admin/tenants")
        revalidatePath("/admin")
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
