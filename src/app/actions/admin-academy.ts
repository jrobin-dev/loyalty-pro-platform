"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils" // We might need to implement this or use a simple regex

// --- COURSES ---

export async function getAdminCourses() {
    try {
        const courses = await prisma.academyCourse.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        })
        return { success: true, data: courses }
    } catch (error) {
        console.error("Error fetching courses:", error)
        return { success: false, error: "Error al obtener cursos" }
    }
}

export async function createCourse(formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const imageUrl = formData.get("imageUrl") as string

        if (!title) return { success: false, error: "Título requerido" }

        // Simple slug generation
        let slug = title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')

        // Ensure slug uniqueness (simple implementation)
        const existing = await prisma.academyCourse.findUnique({ where: { slug } })
        if (existing) {
            slug = `${slug}-${Date.now()}`
        }

        await prisma.academyCourse.create({
            data: {
                title,
                description,
                imageUrl,
                slug,
                published: true // Default to published for now
            }
        })

        revalidatePath("/admin/academy")
        revalidatePath("/dashboard/academy")
        return { success: true }
    } catch (error) {
        console.error("Error creating course:", error)
        return { success: false, error: "Error al crear curso" }
    }
}

export async function deleteCourse(id: string) {
    try {
        await prisma.academyCourse.delete({ where: { id } })
        revalidatePath("/admin/academy")
        revalidatePath("/dashboard/academy")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar curso" }
    }
}

// --- LESSONS ---

export async function getCourseLessons(courseId: string) {
    try {
        const lessons = await prisma.academyLesson.findMany({
            where: { courseId },
            orderBy: { order: "asc" }
        })
        return { success: true, data: lessons }
    } catch (error) {
        return { success: false, error: "Error al obtener lecciones" }
    }
}

export async function createLesson(formData: FormData) {
    try {
        const courseId = formData.get("courseId") as string
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const provider = formData.get("provider") as string
        const videoId = formData.get("videoId") as string
        const order = parseInt(formData.get("order") as string || "0")

        if (!courseId || !title || !videoId) {
            return { success: false, error: "Faltan datos requeridos" }
        }

        await prisma.academyLesson.create({
            data: {
                courseId,
                title,
                description,
                provider,
                videoId,
                order
            }
        })

        revalidatePath(`/admin/academy/${courseId}`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Error al crear lección" }
    }
}

export async function deleteLesson(id: string, courseId: string) {
    try {
        await prisma.academyLesson.delete({ where: { id } })
        revalidatePath(`/admin/academy/${courseId}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar lección" }
    }
}
