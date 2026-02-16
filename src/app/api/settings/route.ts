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

        // Get tenantId from query params
        const { searchParams } = new URL(request.url)
        const tenantId = searchParams.get('tenantId')

        // Fetch Tenant with relations and owner (for plan)
        const tenant = await prisma.tenant.findFirst({
            where: tenantId
                ? { id: tenantId, ownerId: userId }
                : { ownerId: userId },
            include: {
                branding: true,
                loyalty: true,
                owner: {
                    select: {
                        plan: true
                    }
                }
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
                plan: (tenant.owner as any).plan,
                currency: (tenant as any).currency,
                timezone: (tenant as any).timezone || 'UTC',
                timeFormat: (tenant as any).timeFormat || '12h',
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

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        const body = await request.json()
        const tenantId = body.tenantId || body.tenant?.id

        console.log("API Settings PATCH received for tenant:", tenantId)

        // Verify ownership
        const existingTenant = await prisma.tenant.findFirst({
            where: {
                id: tenantId,
                ownerId: userId
            }
        })

        if (!existingTenant) {
            return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
        }

        // Update Tenant (Name, Currency)
        // Note: Currency is on Tenant model, not Branding
        const updatedTenant = await prisma.tenant.update({
            where: { id: existingTenant.id },
            data: {
                name: body.tenant?.name,
                currency: body.tenant?.currency,
                timezone: body.tenant?.timezone,
                timeFormat: body.tenant?.timeFormat,
            } as any
        })

        // Upsert Branding
        // We use upsert because it might not exist if created manually or old data
        if (body.branding) {
            await prisma.branding.upsert({
                where: { tenantId: existingTenant.id },
                update: {
                    primaryColor: body.branding.primaryColor,
                    secondaryColor: body.branding.secondaryColor,
                    logoUrl: body.branding.logoUrl,
                    gradient: body.branding.gradient,
                    gradientDirection: body.branding.gradientDirection,
                    fontFamily: 'Funnel Display', // Enforce default for now or allow update if added to form
                },
                create: {
                    tenantId: existingTenant.id,
                    primaryColor: body.branding.primaryColor || '#00FF94',
                    secondaryColor: body.branding.secondaryColor || '#000000',
                    logoUrl: body.branding.logoUrl,
                    gradient: body.branding.gradient || false,
                    gradientDirection: body.branding.gradientDirection || 'to right',
                    fontFamily: 'Funnel Display',
                }
            })
        }

        return NextResponse.json({ success: true, tenant: updatedTenant })

    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
            { error: 'Error al actualizar la configuración' },
            { status: 500 }
        )
    }
}
