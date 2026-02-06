import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'

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

        // Step 1: Create user with Supabase Auth (using admin client)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: true, // Auto-confirm email
        })

        if (authError) {
            console.error('❌ Auth error:', authError)
            return NextResponse.json(
                {
                    success: false,
                    error: authError.message || 'No se pudo crear la cuenta'
                },
                { status: 400 }
            )
        }

        if (!authData.user) {
            console.error('❌ No user returned from Supabase')
            return NextResponse.json(
                {
                    success: false,
                    error: 'No se pudo crear el usuario'
                },
                { status: 500 }
            )
        }

        console.log('✅ User created:', authData.user.id)

        // Step 2: Create User in Prisma
        const prismaUser = await prisma.user.create({
            data: {
                id: authData.user.id,
                email: body.email,
                name: body.ownerName || body.businessName,
                role: 'BUSINESS_OWNER',
            }
        })

        console.log('✅ Prisma user created:', prismaUser.id)

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
                ownerId: authData.user.id,
                plan: 'FREE',
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
            }
        })

        console.log('✅ Branding created:', branding.id)

        // Step 5: Create Loyalty Program
        const loyaltyProgram = await prisma.loyaltyProgram.create({
            data: {
                tenantId: tenant.id,
                stampIcon: body.stampType || 'star',
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

        return NextResponse.json({
            success: true,
            user: prismaUser,
            tenant,
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
