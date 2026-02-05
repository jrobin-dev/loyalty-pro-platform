import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, name, tenantId } = body

        if (!email || !tenantId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        // 1. Find or Create User (Global identity)
        // Note: In a real app we'd use Supabase Auth here too, but for this "Fast Track" customer view we simulate quick access
        // or we create a user record if it doesn't exist.

        // For MVP: We assume the user might exist or we create a stub
        let user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    role: 'END_USER'
                }
            })
        }

        // 2. Find or Create Customer (Relation to Tenant)
        let customer = await prisma.customer.findUnique({
            where: {
                userId_tenantId: {
                    userId: user.id,
                    tenantId: tenantId
                }
            }
        })

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    userId: user.id,
                    tenantId: tenantId,
                    totalStamps: 0,
                    currentStamps: 0
                }
            })
        }

        return NextResponse.json({
            customer,
            user: { name: user.name, email: user.email }
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 })
    }
}
