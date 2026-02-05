import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create a Business Owner User
    const ownerEmail = 'admin@demo.com'
    let owner = await prisma.user.findUnique({
        where: { email: ownerEmail }
    })

    if (!owner) {
        owner = await prisma.user.create({
            data: {
                email: ownerEmail,
                name: 'Admin Demo',
                role: "BUSINESS_OWNER"
            }
        })
        console.log(`Created Owner: ${owner.id}`)
    } else {
        console.log(`Owner already exists: ${owner.id}`)
    }

    // 2. Create the Demo Tenant
    const tenantSlug = 'demo-pizza'
    let tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug }
    })

    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'Demo Pizza Place',
                slug: tenantSlug,
                category: 'Restaurante',
                ownerId: owner.id,
                plan: "PRO",
                branding: {
                    create: {
                        primaryColor: '#00FF94', // Neon Green
                        secondaryColor: '#000000',
                        fontFamily: 'Funnel Display',
                        gradient: true
                    }
                },
                loyalty: {
                    create: {
                        stampIcon: 'pizza',
                        stampsRequired: 10,
                        rewardTitle: 'Pizza Mediana Gratis'
                    }
                }
            }
        })
        console.log(`Created Tenant: ${tenant.name} (${tenant.id})`)
    } else {
        console.log(`Tenant already exists: ${tenant.name}`)
    }

    // 3. Create a Customer (End User)
    const customerEmail = 'customer@demo.com'
    // Note: Customers might not have a linked User account initially if just visiting, 
    // but for the Wallet/Scan flow we usually associate them.
    // In our schema, Customer has optional userId.

    // We'll create a User for the customer too so they can "login" to their wallet if needed
    let customerUser = await prisma.user.findUnique({ where: { email: customerEmail } })
    if (!customerUser) {
        customerUser = await prisma.user.create({
            data: {
                email: customerEmail,
                name: 'Cliente Frecuente',
                role: "END_USER"
            }
        })
    }

    // Check if Customer profile exists for this tenant
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            userId_tenantId: {
                userId: customerUser.id,
                tenantId: tenant.id
            }
        }
    })

    if (!existingCustomer) {
        const newCustomer = await prisma.customer.create({
            data: {
                userId: customerUser.id,
                tenantId: tenant.id,
                totalStamps: 5,
                currentStamps: 5
            }
        })
        console.log(`Created Customer: ${newCustomer.id} with 5 stamps`)
    } else {
        console.log(`Customer already linked to tenant`)
    }

    console.log('✅ Seed finished successfully')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
