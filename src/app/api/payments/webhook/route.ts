import { NextResponse } from 'next/server'

// Simple Webhook Logger for MVP
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const type = body.type // 'charge.succeeded'

        if (type === 'charge.succeeded') {
            console.log("Pago exitoso recibido (Webhook):", body.data.id)
            // Here we would verify signature and update DB if not already done
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
    }
}
