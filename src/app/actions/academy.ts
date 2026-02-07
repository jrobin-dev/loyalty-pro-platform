"use server"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// --- PUBLIC/TENANT GETTERS ---

export async function getPublishedCourses() {
    try {
        const courses = await prisma.academyCourse.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { lessons: true } }
            }
        })
        return { success: true, data: courses }
    } catch (error) {
        return { success: false, error: "Error al cargar cursos" }
    }
}

export async function getCourseBySlug(slug: string) {
    try {
        const course = await prisma.academyCourse.findUnique({
            where: { slug },
            include: {
                lessons: {
                    orderBy: { order: "asc" }
                }
            }
        })
        return { success: true, data: course }
    } catch (error) {
        return { success: false, error: "Curso no encontrado" }
    }
}

// --- COMMENTS ---

export async function getLessonComments(lessonId: string) {
    try {
        const comments = await prisma.academyComment.findMany({
            where: { lessonId, parentId: null }, // Fetch top-level comments
            include: {
                replies: {
                    orderBy: { createdAt: "asc" }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return { success: true, data: comments }
    } catch (error) {
        return { success: false, error: "Error al cargar comentarios" }
    }
}

export async function postComment(lessonId: string, content: string, parentId?: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: "No autenticado" }

        // Get user profile for display name/avatar
        // In a real app we might join with a Profile table or store snapshot
        // For now we'll use metadata or fallback
        const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
        const userAvatar = user.user_metadata?.avatar_url || ""

        await prisma.academyComment.create({
            data: {
                content,
                lessonId,
                userId: user.id,
                userName,
                userAvatar,
                parentId
            }
        })

        revalidatePath("/dashboard/academy/[slug]")
        return { success: true }
    } catch (error) {
        console.error("Error posting comment:", error)
        return { success: false, error: "Error al publicar comentario" }
    }
}
