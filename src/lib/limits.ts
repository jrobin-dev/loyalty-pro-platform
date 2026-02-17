import prisma from './prisma'

export const PLAN_LIMITS: Record<string, number> = {
    'FREE': 1,
    'STARTER': 1,
    'PRO': 3,
    'AGENCY': 10
}

/**
 * Synchronizes a user's businesses (tenants) according to their current plan.
 * Suspends businesses if they exceed the allowed limit (LIFO policy).
 * Reactivates suspended businesses if the plan allows it (FIFO activation).
 */
export async function syncUserTenants(userId: string) {
    console.log(`[syncUserTenants] Syncing businesses for user: ${userId}`)

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tenants: {
                orderBy: { createdAt: 'asc' } // Oldest first
            }
        }
    })

    if (!user) {
        console.error(`[syncUserTenants] User ${userId} not found`)
        return { success: false, error: 'User not found' }
    }

    const limit = PLAN_LIMITS[user.plan.toUpperCase()] || 1
    const tenants = user.tenants

    console.log(`[syncUserTenants] User Plan: ${user.plan}, Limit: ${limit}, Total: ${tenants.length}`)

    const updates = []

    for (let i = 0; i < tenants.length; i++) {
        const tenant = tenants[i]
        const shouldBeActive = i < limit

        // Case 1: Exceeds limit -> SUSPENDED
        if (!shouldBeActive && tenant.status === 'ACTIVE') {
            console.log(`[syncUserTenants] Suspending tenant ${tenant.slug} (exceeds limit)`)
            updates.push(
                prisma.tenant.update({
                    where: { id: tenant.id },
                    data: { status: 'SUSPENDED' }
                })
            )
        }

        // Case 2: Within limit and was suspended -> REACTIVATE
        // Only reactivate if it was active before or we want automatic reactivation
        else if (shouldBeActive && tenant.status === 'SUSPENDED') {
            console.log(`[syncUserTenants] Reactivating tenant ${tenant.slug} (within limit)`)
            updates.push(
                prisma.tenant.update({
                    where: { id: tenant.id },
                    data: { status: 'ACTIVE' }
                })
            )
        }
    }

    if (updates.length > 0) {
        await prisma.$transaction(updates)
    }

    return {
        success: true,
        limit,
        total: tenants.length,
        updatedCount: updates.length
    }
}
