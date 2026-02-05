import { Metadata } from 'next'
import CustomerView from './customer-view'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface PageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug
    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: { branding: true }
    })

    if (!tenant) return { title: 'Negocio no encontrado' }

    return {
        title: `${tenant.name} | Loyalty Card`,
        description: `Únete al programa de lealtad de ${tenant.name}`,
    }
}

export default async function CustomerPage({ params }: PageProps) {
    const slug = (await params).slug
    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: {
            branding: true,
            loyalty: true
        }
    })

    if (!tenant) notFound()

    return <CustomerView tenant={tenant} />
}
