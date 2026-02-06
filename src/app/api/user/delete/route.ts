import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { confirmationText } = body

        if (confirmationText !== "ELIMINAR") {
            return NextResponse.json(
                { error: "Confirmation text does not match" },
                { status: 400 }
            )
        }

        const userId = session.user.id

        // Get user's tenant
        const tenant = await prisma.tenant.findFirst({
            where: { ownerId: userId },
        })

        if (tenant) {
            // Delete in cascade (order matters!)
            // 1. Delete stamp transactions
            await prisma.stampTransaction.deleteMany({
                where: { tenantId: tenant.id },
            })

            // 2. Delete customers
            await prisma.customer.deleteMany({
                where: { tenantId: tenant.id },
            })

            // 3. Delete loyalty program
            await prisma.loyaltyProgram.deleteMany({
                where: { tenantId: tenant.id },
            })

            // 4. Delete branding
            await prisma.branding.deleteMany({
                where: { tenantId: tenant.id },
            })

            // 5. Delete tenant
            await prisma.tenant.delete({
                where: { id: tenant.id },
            })
        }

        // 6. Delete user from database
        await prisma.user.delete({
            where: { id: userId },
        })

        // 7. Delete user from Supabase Auth (requires admin client)
        const { createAdminClient } = await import("@/lib/supabase/admin")
        const adminClient = createAdminClient()
        const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId)

        if (deleteAuthError) {
            console.error("Error deleting user from Supabase Auth:", deleteAuthError)
            // Continue anyway since database is already deleted
        }

        // 8. Sign out
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error deleting account:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
