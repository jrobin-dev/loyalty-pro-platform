import { NextResponse } from 'next/server'
// import paypal from '@paypal/checkout-server-sdk' // Implicitly using fetch for leaner implementation or official SDK

// Helper to get Access Token
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
        const { plan, tenantId } = body

        // Price in USD
        const value = plan === 'Pro' ? '15.00' : '0.00'

        if (value === '0.00') return NextResponse.json({ error: 'Free plan' }, { status: 400 })

        const accessToken = await getAccessToken()

        const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: value,
                        },
                        reference_id: tenantId,
                        description: `LoyaltyPro ${plan} Subscription`
                    },
                ],
            }),
        })

        const order = await response.json()
        return NextResponse.json(order)

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Error creating PayPal Order' }, { status: 500 })
    }
}
