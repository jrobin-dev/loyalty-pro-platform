import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

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

        // Update customer stamps and get user details
        const customer = await prisma.customer.update({
            where: { id: customerId },
            data: {
                totalStamps: { increment: 1 },
                currentStamps: { increment: 1 }
            },
            include: {
                user: true
            }
        })


        // Fetch Tenant Owner for notification
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { ownerId: true, name: true }
        })

        if (tenant?.ownerId) {
            const customerName = customer.user?.name
                ? `${customer.user.name} ${customer.user.lastName || ''}`.trim()
                : "Un cliente"

            await createNotification(
                tenant.ownerId,
                "Nuevo Stamp Registrado",
                `Se ha añadido 1 stamp a ${customerName}.`,
                "success",
                `/dashboard/customers?id=${customerId}`
            )
        }

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
