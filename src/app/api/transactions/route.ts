import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customerId, type, amount, description } = body

        // 1. Validate info
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { tenant: { include: { loyalty: true } } }
        })

        if (!customer) {
            return NextResponse.json({ error: 'Cliente no válido' }, { status: 404 })
        }

        // 2. Calculate logic
        let newCurrentStamps = customer.currentStamps
        let newTotalStamps = customer.totalStamps

        if (type === 'EARN') {
            newCurrentStamps += amount
            newTotalStamps += amount
        } else if (type === 'REDEEM') {
            if (customer.currentStamps < amount) {
                return NextResponse.json({ error: 'Stamps insuficientes' }, { status: 400 })
            }
            newCurrentStamps -= amount
        }

        // 3. Transaction
        const result = await prisma.$transaction([
            prisma.stampTransaction.create({
                data: {
                    customerId,
                    type, // 'EARN' or 'REDEEM'
                    amount,
                    description
                }
            }),
            prisma.customer.update({
                where: { id: customerId },
                data: {
                    currentStamps: newCurrentStamps,
                    totalStamps: newTotalStamps
                }
            })
        ])

        const ownerId = customer.tenant?.ownerId
        if (ownerId) {
            const title = type === 'EARN' ? 'Puntos/Stamps Ganados' : 'Canje Realizado'
            const msg = type === 'EARN'
                ? `El cliente ha recibido ${amount} puntos/stamps.`
                : `El cliente ha canjeado ${amount} puntos/stamps.`

            await createNotification(
                ownerId,
                title,
                msg,
                "info",
                `/dashboard/customers?id=${customerId}`
            )
        }

        return NextResponse.json({
            success: true,
            newBalance: result[1].currentStamps,
            transactionId: result[0].id
        })

    } catch (error) {
        console.error('Transaction Error:', error)
        return NextResponse.json({ error: 'Error procesando transacción' }, { status: 500 })
    }
}
