"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- HELPERS ---

function extractVideoId(provider: string, input: string): string {
    if (!input) return ""

    // If it's already an ID (no slashes, common for YouTube)
    if (!input.includes('/') && !input.includes('?')) return input

    const prov = provider.toUpperCase()

    if (prov === 'YOUTUBE') {
        // Handle various YouTube formats:
        // https://www.youtube.com/watch?v=dQw4w9WgXcQ
        // https://youtu.be/dQw4w9WgXcQ
        // https://www.youtube.com/embed/dQw4w9WgXcQ
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const match = input.match(regExp)
        return (match && match[7].length === 11) ? match[7] : input
    }

    if (prov === 'BUNNY') {
        // Bunny.net iframe URLs usually look like:
        // https://iframe.mediadelivery.net/embed/12345/abcdef-ghijk
        // We want to keep the full embed URL or extract the last part if they only want the ID?
        // Looking at VideoPlayer.tsx, it uses 'url' directly for Bunny.
        // So for Bunny, we should ensure it starts with https://iframe.mediadelivery.net/embed/
        // if they paste the iframe code, we extract the src.
        if (input.includes('<iframe')) {
            const srcMatch = input.match(/src="([^"]+)"/)
            return srcMatch ? srcMatch[1] : input
        }
        return input
    }

    return input
}

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
        const published = formData.get("published") === "true"
        const instructorName = formData.get("instructorName") as string
        const instructorBio = formData.get("instructorBio") as string

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
                published,
                instructorName,
                instructorBio
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

export async function updateCourse(id: string, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const imageUrl = formData.get("imageUrl") as string
        const published = formData.get("published") === "true"
        const instructorName = formData.get("instructorName") as string
        const instructorBio = formData.get("instructorBio") as string

        if (!id || !title) return { success: false, error: "ID y Título requeridos" }

        await prisma.academyCourse.update({
            where: { id },
            data: {
                title,
                description,
                imageUrl,
                published,
                instructorName,
                instructorBio
            }
        })

        revalidatePath("/admin/academy")
        revalidatePath("/dashboard/academy")
        return { success: true }
    } catch (error: any) {
        console.error("DEBUG: Error updating course:", {
            id,
            error: error.message,
            code: error.code,
            meta: error.meta
        })
        return { success: false, error: `Error al actualizar curso: ${error.message || "Error desconocido"}` }
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
        const rawVideoId = formData.get("videoId") as string
        const order = parseInt(formData.get("order") as string || "0")
        const resourcesStr = formData.get("resources") as string
        const resources = resourcesStr ? JSON.parse(resourcesStr) : []

        if (!courseId || !title || !rawVideoId) {
            return { success: false, error: "Faltan datos requeridos" }
        }

        const videoId = extractVideoId(provider, rawVideoId)

        await prisma.academyLesson.create({
            data: {
                courseId,
                title,
                description,
                provider,
                videoId,
                order,
                resources: resources || []
            }
        })

        revalidatePath(`/admin/academy/${courseId}`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Error al crear lección" }
    }
}

export async function updateLesson(id: string, formData: FormData) {
    try {
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const provider = formData.get("provider") as string
        const rawVideoId = formData.get("videoId") as string
        const order = parseInt(formData.get("order") as string || "0")
        const courseId = formData.get("courseId") as string // For revalidation
        const resourcesStr = formData.get("resources") as string
        const resources = resourcesStr ? JSON.parse(resourcesStr) : []

        if (!id || !title || !rawVideoId) {
            return { success: false, error: "Datos incompletos" }
        }

        const videoId = extractVideoId(provider, rawVideoId)

        await prisma.academyLesson.update({
            where: { id },
            data: {
                title,
                description,
                provider,
                videoId,
                order,
                resources: resources || []
            }
        })

        if (courseId) {
            revalidatePath(`/admin/academy/${courseId}`)
        }

        return { success: true }
    } catch (error: any) {
        console.error("DEBUG: Error updating lesson:", {
            id,
            error: error.message,
            code: error.code,
            meta: error.meta
        })
        return { success: false, error: `Error al actualizar lección: ${error.message || "Error desconocido"}` }
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
