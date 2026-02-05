import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const customerId = params.id

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                user: { select: { name: true, email: true } },
                tenant: { select: { id: true, name: true, loyalty: true } }
            }
        })

        if (!customer) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        return NextResponse.json(customer)

    } catch (error) {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
