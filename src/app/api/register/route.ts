import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            email,
            password,
            businessData
        } = body

        // 1. Create Auth User in Supabase
        const supabase = await createClient()
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: businessData.ownerName,
                    role: 'BUSINESS_OWNER',
                },
            },
        })

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
        }

        const userId = authData.user.id

        // 2. Transaction: Create User, Tenant, Branding, LoyaltyProgram in DB
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    id: userId,
                    email: email,
                    name: businessData.ownerName,
                    role: 'BUSINESS_OWNER',
                    plan: 'FREE',
                }
            })

            // Generate a slug from business name
            const cleanSlug = businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)

            // Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: businessData.businessName,
                    slug: cleanSlug,
                    category: businessData.category,
                    ownerId: user.id,
                    branding: {
                        create: {
                            primaryColor: businessData.primaryColor,
                            secondaryColor: businessData.secondaryColor,
                            gradient: businessData.gradientEnabled,
                            logoUrl: businessData.logoUrl, // Note: Expecting a handled URL, but for base64 MVP allows it (though not ideal for large storage)
                            fontFamily: 'Funnel Display',
                        }
                    },
                    loyalty: {
                        create: {
                            stampIcon: businessData.stampType,
                            stampsRequired: businessData.stampsRequired,
                        }
                    }
                }
            })

            // 3. Create Notification for Admin
            // Find all Super Admins to notify
            const superAdmins = await tx.user.findMany({
                where: { role: 'SUPER_ADMIN' }
            })

            for (const admin of superAdmins) {
                await createNotification(
                    admin.id,
                    "Nuevo Registro de Negocio",
                    `El negocio "${businessData.businessName}" ha completado el onboarding.`,
                    "info"
                )
            }

            // Also notify the user
            await createNotification(
                user.id,
                "¡Bienvenido a LoyaltyPro!",
                "Tu cuenta ha sido creada exitosamente. Completa tu configuración para empezar.",
                "success"
            )

            return tenant
        })

        return NextResponse.json({ success: true, tenantId: result.id })

    } catch (error) {
        console.error('Registration Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
