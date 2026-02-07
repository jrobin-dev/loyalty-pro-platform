
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkRole() {
    const email = 'softdemo24@gmail.com'
    console.log(`Checking role for ${email}...`)

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true }
    })

    console.log('User found:', user)
}

checkRole()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
