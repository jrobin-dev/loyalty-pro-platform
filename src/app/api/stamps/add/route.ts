import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customerId, amount, tenantId } = body

        if (!customerId || !amount || !tenantId) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        // Create stamp transaction
        const transaction = await prisma.stampTransaction.create({
            data: {
                customerId,
                tenantId,
                amount: parseFloat(amount),
                stampsEarned: 1,
                type: 'EARNED'
            }
        })

        // Update customer stamps
        const customer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                totalStamps: { increment: 1 },
                currentStamps: { increment: 1 }
            }
        })

        console.log('✅ Stamp transaction created:', transaction.id)
        console.log('✅ Customer updated:', customer.id, 'Total stamps:', customer.totalStamps)

        return NextResponse.json({
            success: true,
            transaction,
            customer
        })

    } catch (error: any) {
        console.error('❌ Error creating stamp transaction:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al registrar consumo'
            },
            { status: 500 }
        )
    }
}
