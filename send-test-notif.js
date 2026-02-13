const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createTestNotification() {
    const email = process.argv[2]
    if (!email) {
        console.error('Por favor proporciona un email: node send-test-notif.js usuario@ejemplo.com')
        process.exit(1)
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.error('Usuario no encontrado')
            process.exit(1)
        }

        const notif = await prisma.notification.create({
            data: {
                userId: user.id,
                title: '¡Bienvenido al sistema!',
                message: 'Esta es una notificación de prueba en tiempo real.',
                type: 'success'
            }
        })

        console.log('Notificación creada exitosamente:', notif)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createTestNotification()
