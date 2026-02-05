import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token, email, plan, tenantId } = body

        // Amount in Centimos (S/ 50.00 -> 5000)
        const amount = plan === 'Pro' ? 5000 : 0

        if (amount === 0) {
            return NextResponse.json({ error: 'Plan gratuito no requiere pago' }, { status: 400 })
        }

        // Call Culqi API
        const response = await fetch('https://api.culqi.com/v2/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CULQI_PRIVATE_KEY}`
            },
            body: JSON.stringify({
                amount,
                currency_code: 'PEN',
                email,
                source_id: token,
                description: `Suscripción Pro - ${email}`,
                authentication_3DS: {
                    email
                }
            })
        })

        const charge = await response.json()

        if (charge.object === 'error') {
            return NextResponse.json({ error: charge.user_message }, { status: 400 })
        }

        // If successful, upgrade tenant locally
        // Note: Ideally we wait for webhook, but for instant feedback we can optimize optimistic UI
        if (charge.capture) {
            await prisma.tenant.update({
                where: { id: tenantId },
                data: { plan: 'PRO' }
            })
        }

        return NextResponse.json({ success: true, charge })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error procesando pago' }, { status: 500 })
    }
}
