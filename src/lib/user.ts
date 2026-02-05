/**
 * Temporary user management utility
 * Generates and persists a unique user ID in localStorage
 * This will be replaced with Supabase Auth in the future
 */

export function getUserId(): string {
    if (typeof window === 'undefined') {
        return 'demo-user-123' // Server-side fallback
    }

    const STORAGE_KEY = 'loyalty_user_id'

    // Check if user already has an ID
    let userId = localStorage.getItem(STORAGE_KEY)

    if (!userId) {
        // Generate a new unique ID
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        localStorage.setItem(STORAGE_KEY, userId)
    }

    return userId
}

export function clearUserId(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('loyalty_user_id')
    }
}

export function setUserId(userId: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('loyalty_user_id', userId)
    }
}
