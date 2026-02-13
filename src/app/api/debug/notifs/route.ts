
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const lastNotifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                user: {
                    select: { email: true, role: true }
                }
            }
        })

        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true },
            take: 10
        })

        return NextResponse.json({
            lastNotifications,
            users
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
