import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Step 1: Create user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: body.email,
            password: body.password,
        })

        if (authError) {
            console.error('Auth error:', authError)
            return NextResponse.json(
                {
                    success: false,
                    error: authError.message || 'Failed to create account'
                },
                { status: 400 }
            )
        }

        if (!authData.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to create user'
                },
                { status: 500 }
            )
        }

        // Step 2: Create business record with authenticated user ID
        const businessData = {
            user_id: authData.user.id, // Real Supabase Auth UUID
            email: body.email,
            phone: body.whatsapp,
            name: body.businessName,
            logo_url: body.logoUrl || null,
            primary_color: body.primaryColor,
            secondary_color: body.secondaryColor,
            stamps_required: body.stampsRequired,
            reward_description: body.rewardDescription,
        }

        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .insert([businessData])
            .select()
            .single()

        if (businessError) {
            console.error('Business creation error:', businessError)
            // If business creation fails, we should ideally delete the auth user
            // For now, just return error
            return NextResponse.json(
                {
                    success: false,
                    error: businessError.message || 'Failed to create business'
                },
                { status: 500 }
            )
        }

        // Step 3: Auto-login the user
        const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password,
        })

        if (sessionError) {
            console.error('Session error:', sessionError)
        }

        return NextResponse.json({
            success: true,
            business,
            user: authData.user,
            session: sessionData?.session
        })
    } catch (error: any) {
        console.error('Error in onboarding:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to complete onboarding'
            },
            { status: 500 }
        )
    }
}
