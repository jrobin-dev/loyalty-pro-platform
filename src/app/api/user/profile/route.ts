import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

// GET - Fetch user profile
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                birthday: true,
                avatarUrl: true,
                role: true,
                plan: true,
                tenants: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        status: true,
                    }
                }
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error: any) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, lastName, phone, birthday } = body

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name || null,
                lastName: lastName || null,
                phone: phone || null,
                birthday: birthday ? new Date(birthday) : null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                birthday: true,
                avatarUrl: true,
                role: true,
                plan: true,
                tenants: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        status: true,
                    }
                }
            },
        })

        return NextResponse.json({ success: true, user })
    } catch (error: any) {
        console.error("Error updating user profile:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
