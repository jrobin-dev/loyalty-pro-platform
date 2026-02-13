import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// GET /api/notifications - Obtener notificaciones del usuario actual
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const manualUserId = searchParams.get('userId')

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const targetUserId = user?.id || manualUserId

        if (!targetUserId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: targetUserId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })

        return NextResponse.json({ notifications })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

// PATCH /api/notifications - Marcar notificación como leída
export async function PATCH(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id, readAll } = await req.json()

        if (readAll) {
            await prisma.notification.updateMany({
                where: {
                    userId: user.id,
                    read: false
                },
                data: {
                    read: true
                }
            })
            return NextResponse.json({ success: true })
        }

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        }

        // Verificar propiedad antes de actualizar
        const notification = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notification || notification.userId !== user.id) {
            return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { read: true }
        })

        return NextResponse.json({ notification: updated })
    } catch (error) {
        console.error('Error updating notification:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
