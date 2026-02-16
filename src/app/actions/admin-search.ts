"use server"

import prisma from "@/lib/prisma"

export interface AdminSearchResult {
    id: string
    type: "tenant" | "user" | "course" | "lesson"
    title: string
    subtitle: string
    url: string
    icon?: string
    avatarUrl?: string | null
}

export async function globalAdminSearch(query: string): Promise<AdminSearchResult[]> {
    if (!query || query.length < 2) return []

    const lowerQuery = query.toLowerCase()
    const results: AdminSearchResult[] = []

    try {
        // 1. Search Tenants (Name, Slug, Owner Email)
        const tenants = await prisma.tenant.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { slug: { contains: query, mode: "insensitive" } },
                    { owner: { email: { contains: query, mode: "insensitive" } } }
                ]
            },
            take: 5,
            include: {
                owner: true,
                branding: {
                    select: {
                        logoUrl: true
                    }
                }
            }
        })

        tenants.forEach(t => {
            results.push({
                id: t.id,
                type: "tenant",
                title: t.name,
                subtitle: `Negocio • Dueño: ${t.owner?.email}`,
                url: `/admin/tenants?search=${t.slug}`,
                avatarUrl: t.branding?.logoUrl
            })
        })

        // 2. Search Users (Name, Email)
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 5
        })

        users.forEach(u => {
            results.push({
                id: u.id,
                type: "user",
                title: `${u.name || ""} ${u.lastName || ""}`.trim() || "Usuario sin nombre",
                subtitle: `Usuario • ${u.email}`,
                url: `/admin/users?search=${u.email}`
            })
        })

        // 3. Search Courses
        const courses = await prisma.academyCourse.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 3
        })

        courses.forEach(c => {
            results.push({
                id: c.id,
                type: "course",
                title: c.title,
                subtitle: "Curso",
                url: `/admin/academy` // Or edit modal if possible
            })
        })

        // 4. Search Lessons
        const lessons = await prisma.academyLesson.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 3,
            include: { course: true }
        })

        lessons.forEach(l => {
            results.push({
                id: l.id,
                type: "lesson",
                title: l.title,
                subtitle: `Lección • Curso: ${l.course.title}`,
                url: `/admin/academy`
            })
        })

    } catch (error) {
        console.error("Global Admin Search Error:", error)
        return []
    }

    return results
}
