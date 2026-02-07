
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateRole() {
    const email = 'softdemo24@gmail.com'
    console.log(`Updating role for ${email}...`)

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'SUPER_ADMIN' },
        select: { id: true, email: true, role: true }
    })

    console.log('User updated:', user)
}

updateRole()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
