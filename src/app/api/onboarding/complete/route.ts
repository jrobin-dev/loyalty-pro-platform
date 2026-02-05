import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Get user ID from request (generated client-side for now)
        // TODO: Replace with Supabase Auth user ID when authentication is implemented
        const userId = body.userId || `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

        // Map wizard data to business table structure
        const businessData = {
            user_id: userId,
            name: body.businessName,
            logo_url: body.logoUrl || null,
            primary_color: body.primaryColor,
            secondary_color: body.secondaryColor,
            stamps_required: body.stampsRequired,
            reward_description: body.rewardDescription,
        }

        // Check if business already exists for this user
        const { data: existing } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', businessData.user_id)
            .single()

        let result

        if (existing) {
            // Update existing business
            const { data, error } = await supabase
                .from('businesses')
                .update(businessData)
                .eq('user_id', businessData.user_id)
                .select()
                .single()

            if (error) throw error
            result = data
        } else {
            // Create new business
            const { data, error } = await supabase
                .from('businesses')
                .insert([businessData])
                .select()
                .single()

            if (error) throw error
            result = data
        }

        return NextResponse.json({
            success: true,
            business: result
        })
    } catch (error: any) {
        console.error('Error saving business:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to save business configuration'
            },
            { status: 500 }
        )
    }
}
