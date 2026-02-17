import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, name, tenantId, phone } = body

        if (!email || !tenantId) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        // 0. Check Tenant Status (Security Guard)
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { status: true, ownerId: true }
        })

        if (!tenant) {
            return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
        }

        if (tenant.status === 'SUSPENDED') {
            return NextResponse.json({
                error: 'Este negocio está suspendido. Contacta al administrador para reactivarlo.'
            }, { status: 403 })
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
                    phone,
                    role: 'END_USER'
                }
            })
        } else if (phone && !user.phone) {
            // Update phone if missing
            user = await prisma.user.update({
                where: { id: user.id },
                data: { phone }
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

            // NOTIFICACIÓN: Avisar al dueño del negocio
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { ownerId: true }
            })

            if (tenant?.ownerId) {
                await createNotification(
                    tenant.ownerId,
                    "Nuevo Cliente Registrado",
                    `${name || email} se ha unido a tu lista de clientes.`,
                    "success",
                    `/dashboard/customers?id=${customer.id}`
                )
            }
        }

        return NextResponse.json({
            customer,
            user: { name: user.name, email: user.email, phone: user.phone }
        })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message || 'Error de autenticación' }, { status: 500 })
    }
}
