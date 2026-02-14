import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from "@/lib/supabase/server"

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
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        birthday: true,
                        avatarUrl: true
                    }
                },
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

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id: customerId } = await props.params
        const body = await request.json()
        const { name, lastName, phone, birthday } = body

        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        // 1. Get the customer and its linked user
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                tenant: { select: { ownerId: true } }
            }
        })

        if (!customer) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
        }

        // 2. Security Check: Actor must be the linked User OR the Tenant Owner
        const isSelf = customer.userId === session.user.id
        const isOwner = customer.tenant.ownerId === session.user.id

        if (!isSelf && !isOwner) {
            return NextResponse.json({ error: "No tienes permisos para editar este perfil" }, { status: 403 })
        }

        if (!customer.userId) {
            return NextResponse.json({ error: "Este cliente no tiene un usuario vinculado" }, { status: 400 })
        }

        // 3. Update the linked User instead of the session user
        const updatedUser = await prisma.user.update({
            where: { id: customer.userId },
            data: {
                name: name !== undefined ? (name || null) : undefined,
                lastName: lastName !== undefined ? (lastName || null) : undefined,
                phone: phone !== undefined ? (phone || null) : undefined,
                birthday: birthday !== undefined ? (birthday ? new Date(birthday) : null) : undefined,
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                birthday: true,
                avatarUrl: true
            }
        })

        return NextResponse.json({ success: true, user: updatedUser })

    } catch (error: any) {
        console.error("Error updating customer profile:", error)
        return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
    }
}
