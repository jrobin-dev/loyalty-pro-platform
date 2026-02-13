import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { customerId, name, lastName, phone, birthday, avatarUrl } = body

        if (!customerId) {
            return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
        }

        // Find customer to get userId
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { user: true }
        })

        if (!customer || !customer.userId) {
            return NextResponse.json({ error: "Customer or User not found" }, { status: 404 })
        }

        // Update User
        // Note: In a real app we might want to validate unique phone/email if they were being changed, 
        // but here we are mainly updating profile details.
        const updatedUser = await prisma.user.update({
            where: { id: customer.userId },
            data: {
                name,
                lastName,
                phone,
                birthday: birthday ? new Date(birthday) : null,
                avatarUrl
            }
        })

        // Return updated customer data structure matching the frontend expectation
        return NextResponse.json({
            customer: {
                ...customer,
                user: updatedUser,
                name: updatedUser.name,
                lastName: updatedUser.lastName,
                phone: updatedUser.phone,
                birthday: updatedUser.birthday,
                avatarUrl: updatedUser.avatarUrl
            }
        })

    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
