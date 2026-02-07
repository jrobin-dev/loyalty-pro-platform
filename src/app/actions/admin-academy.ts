"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createVideo(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const provider = formData.get("provider") as string // YOUTUBE, BUNNY
        const url = formData.get("url") as string

        if (!title || !provider || !url) {
            return { success: false, error: "Faltan campos requeridos" }
        }

        await prisma.academyVideo.create({
            data: {
                title,
                description,
                provider,
                url,
            }
        })

        revalidatePath("/admin/academy")
        revalidatePath("/dashboard/academy")
        return { success: true }
    } catch (error) {
        console.error("Error creating video:", error)
        return { success: false, error: "Error al crear el video" }
    }
}

export async function deleteVideo(id: string) {
    try {
        await prisma.academyVideo.delete({
            where: { id }
        })

        revalidatePath("/admin/academy")
        revalidatePath("/dashboard/academy")
        return { success: true }
    } catch (error) {
        console.error("Error deleting video:", error)
        return { success: false, error: "Error al eliminar el video" }
    }
}

export async function getAdminVideos() {
    try {
        const videos = await prisma.academyVideo.findMany({
            orderBy: { createdAt: "desc" }
        })
        return { success: true, data: videos }
    } catch (error) {
        console.error("Error fetching videos:", error)
        return { success: false, error: "Error al obtener videos" }
    }
}
