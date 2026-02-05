import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        const slug = params.slug

        const tenant = await prisma.tenant.findUnique({
            where: { slug },
            include: {
                branding: true,
                loyalty: true
            }
        })

        if (!tenant) {
            return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
        }

        // Return only public safety data
        return NextResponse.json({
            id: tenant.id,
            name: tenant.name,
            category: tenant.category,
            branding: tenant.branding,
            loyalty: tenant.loyalty
        })

    } catch (error) {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
