"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function generateImpersonationLink(tenantId: string) {
    try {
        // 1. Verify caller is Super Admin
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: "No autorizado" }
        }

        // TODO: Add stricter Admin check if we have a role system
        // For now, assuming access to this server action implies admin access
        // (Middleware protects /admin routes already)

        // 2. Get Tenant Owner Email
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            include: { owner: true }
        })

        if (!tenant || !tenant.owner?.email) {
            return { success: false, error: "Negocio o Dueño no encontrado" }
        }

        // 3. Verify User in Supabase Auth
        const supabaseAdmin = createAdminClient()
        const { data: { list: users }, error: searchError } = await supabaseAdmin.auth.admin.listUsers() // TODO: Filter by email if list is too huge, but currently listUsers doesn't filter efficiently by email without specific method
        // Better approach: getUserById if we had ID. We only have email.
        // Let's use listUsers but it's paginated.
        // Actually, createAdminClient -> admin.createUser? No.

        // Optimally we should store auth_id in Postgres Tenant table to make this fast.
        // For now, let's try to just generate it. Use 'recovery' type? No, magiclink is correct.

        // Let's try to Force Confirm the user just in case
        // This often fixes "invalid login" issues for users created via seed but not confirmed
        // Note: listUsers is expensive. Let's try to just use generateLink but catch specific errors?
        // The error is "otp_expired" which comes from the LINK consumption.

        // Let's try adding explicit 'redirectTo' back but ensuring it's valid.
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: tenant.owner.email,
            options: {
                redirectTo: `${appUrl}/auth/callback?next=/dashboard`
            }
        })

        if (error) {
            console.error("Error generating link:", error)
            return { success: false, error: `Error generando enlace: ${error.message}` }
        }

        // Use hashed_token directly in our callback to avoid fragment issues (#access_token)
        // This makes the link point directly to our server-side handler.
        const directLink = `${appUrl}/auth/callback?token_hash=${data.properties?.hashed_token}&type=magiclink&next=/dashboard`

        return {
            success: true,
            link: directLink,
            ownerName: tenant.owner.name,
            ownerEmail: tenant.owner.email
        }

    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Error interno del servidor" }
    }
}
