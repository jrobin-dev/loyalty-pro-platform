
import prisma from "@/lib/prisma"

export type NotificationType = "info" | "success" | "warning" | "error"

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "info",
    link?: string
) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                read: false
            }
        })
        return true
    } catch (error) {
        console.error("Error creating notification:", error)
        return false
    }
}
