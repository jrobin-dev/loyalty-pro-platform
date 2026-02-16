import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// Server-side Supabase client with service role for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log('🚀 Starting onboarding for:', body.email)


        // Step 1: Check if user exists or create new
        let userId = ''
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true, // Auto-confirm email
        })

        if (authError) {
            // If user already exists, try to get their ID
            // Supabase returns 400 for already registered users
            if (authError.message.toLowerCase().includes("already") || authError.status === 400) {
                console.log("⚠️ User might already exist, attempting to retrieve ID by email...")

                // Fetch users to find the existing one
                // Note: listUsers is paginated, but for onboarding failures, they are likely recent
                const { data: userData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

                if (listError) {
                    console.error('❌ Failed to list users:', listError)
                    return NextResponse.json({ success: false, error: 'Error al verificar usuario existente' }, { status: 500 })
                }

                const existingUser = userData.users.find(u => u.email?.toLowerCase() === body.email.toLowerCase())

                if (existingUser) {
                    console.log('✅ Found existing user ID:', existingUser.id)
                    userId = existingUser.id
                } else {
                    // If not in first batch, try a more targeted search or return the original error
                    console.error('❌ User registered but not found in first batch of listUsers')
                    return NextResponse.json({
                        success: false,
                        error: "El usuario ya existe pero no se pudo recuperar su información. Por favor, intenta iniciar sesión o usa otro email."
                    }, { status: 400 })
                }
            } else {
                console.error('❌ Auth error:', authError)
                return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
            }
        } else {
            userId = authData.user!.id
        }

        if (!userId) {
            return NextResponse.json({ success: false, error: 'No se pudo obtener el ID del usuario' }, { status: 500 })
        }

        console.log('✅ User identified:', userId)

        // Step 2: Create or Update User in Prisma (Upsert)
        const prismaUser = await prisma.user.upsert({
            where: { email: body.email },
            update: {
                id: userId, // Ensure ID sync if needed (though email is unique)
                role: 'BUSINESS_OWNER',
                plan: 'FREE' // New users/onboarding default to FREE
            },
            create: {
                id: userId,
                email: body.email,
                name: body.ownerName || body.businessName,
                role: 'BUSINESS_OWNER',
                plan: 'FREE',
                phone: `${body.country || ''} ${body.whatsapp || ''}`.trim() || null,
            }
        })

        console.log('✅ Prisma user upserted:', prismaUser.id)

        // Step 3: Create Tenant (Business)
        const slug = body.businessName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        const tenant = await prisma.tenant.create({
            data: {
                slug: `${slug}-${Date.now()}`, // Ensure uniqueness
                name: body.businessName,
                category: body.category,
                ownerId: userId,
                currency: body.currency || '$',
                phone: `${body.country || ''}${body.whatsapp || ''}`.trim() || null,
            }
        })

        console.log('✅ Tenant created:', tenant.id)

        // Step 4: Create Branding
        const branding = await prisma.branding.create({
            data: {
                tenantId: tenant.id,
                primaryColor: body.primaryColor || '#00FF94',
                secondaryColor: body.secondaryColor || '#000000',
                logoUrl: body.logoUrl || null,
                fontFamily: 'Funnel Display',
                gradient: body.gradientEnabled || false,
                gradientDirection: body.gradientDirection || 'to right',
            }
        })

        console.log('✅ Branding created:', branding.id)

        // Step 5: Create Loyalty Program
        const loyaltyProgram = await prisma.loyaltyProgram.create({
            data: {
                tenantId: tenant.id,
                stampIcon: body.stampType || 'star',
                customIconUrl: body.customIconUrl || null,
                stampsRequired: body.stampsRequired || 6,
                rewardTitle: body.rewardDescription || '¡Premio gratis!',
            }
        })

        console.log('✅ Loyalty program created:', loyaltyProgram.id)

        // Step 6: Generate session token for auto-login
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
            email: body.email,
            password: body.password,
        })

        if (sessionError) {
            console.error('⚠️ Session error (non-critical):', sessionError)
        }

        console.log('🎉 Onboarding completed successfully!')

        // Step 7: Create Notifications (Real-time)
        try {
            // 1. Notify the new user
            await createNotification(
                userId,
                "¡Bienvenido a LoyaltyPro!",
                "Tu cuenta ha sido creada exitosamente. Completa tu configuración para empezar.",
                "success"
            )

            // 2. Notify all Super Admins
            const superAdmins = await prisma.user.findMany({
                where: { role: 'SUPER_ADMIN' }
            })

            for (const admin of superAdmins) {
                await createNotification(
                    admin.id,
                    "Nuevo Registro de Negocio",
                    `El negocio "${body.businessName}" ha completado el onboarding.`,
                    "info"
                )
            }
        } catch (notifError) {
            console.error('⚠️ Notification error (non-critical):', notifError)
        }

        return NextResponse.json({
            success: true,
            user: prismaUser,
            tenant,
            loyalty: loyaltyProgram,
            branding,
            session: sessionData?.session,
            redirectUrl: '/dashboard'
        })

    } catch (error: any) {
        console.error('❌ Error in onboarding:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al completar el registro'
            },
            { status: 500 }
        )
    }
}
