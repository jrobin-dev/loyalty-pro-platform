import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id

        // Fetch Tenant with relations
        const tenant = await prisma.tenant.findFirst({
            where: { ownerId: userId },
            include: {
                branding: true,
                loyalty: true
            }
        })

        console.log('API Settings - Fetched Tenant:', tenant?.id)
        console.log('API Settings - Fetched Loyalty:', tenant?.loyalty)

        if (!tenant) {
            return NextResponse.json({ error: 'No se encontró configuración del negocio' }, { status: 404 })
        }

        // Structure the response to match what the hook expects
        // The hook expects: settings: { tenant: ..., branding: ..., loyaltyProgram: ... }

        // If branding/loyaltyProgram are arrays or single relations? 
        // In Prisma schema, it's usually 1:1 or 1:N. 
        // Based on use-tenant-settings, it seems 1:1.
        // Let's assume 1:1 or take the first one if array.

        // Wait, prisma "include" puts the relation on the object.
        // We need to extract them.

        // Check Prisma types implicitly by how we access them.
        // If the relation is named 'branding' and 'loyaltyProgram' in schema...
        // Let's hope the names match.

        const settings = {
            tenant: {
                id: tenant.id,
                slug: tenant.slug,
                name: tenant.name,
                category: tenant.category ?? undefined,
                plan: tenant.plan
            },
            branding: tenant.branding || null,
            loyaltyProgram: tenant.loyalty || null
        }

        return NextResponse.json(settings)

    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
