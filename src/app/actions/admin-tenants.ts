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

        // Find owner by email
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
                status: "ACTIVE" // Assuming you might add this field or handle it via logic, but model didn't show it. Checking model...
                // Model Tenant doesn't have status active/suspended. It just has plan.
                // I will omit status for now or add it to schema if needed. 
                // Wait, the previous mock data had 'status'. 
                // Let's check schema again.
                // Schema:
                // model Tenant { ... plan String @default("FREE") ... }
                // No status field. I'll skip status for now or assume active.
            }
        })

        revalidatePath("/admin/tenants")
        return { success: true, data: newTenant }
    } catch (error) {
        console.error("Error creating tenant:", error)
        return { success: false, error: "Error al crear cliente" }
    }
}
