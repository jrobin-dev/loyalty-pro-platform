import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

async function getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64")

    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })
    const data = await response.json()
    return data.access_token
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { orderId, tenantId } = body

        const accessToken = await getAccessToken()

        const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const data = await response.json()

        if (data.status === 'COMPLETED') {
            // Upgrade Tenant
            await prisma.tenant.update({
                where: { id: tenantId },
                data: { plan: 'PRO' }
            })
            return NextResponse.json({ success: true, data })
        }

        return NextResponse.json({ error: 'Payment not completed', details: data }, { status: 400 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Error capturing PayPal Order' }, { status: 500 })
    }
}
