"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            // Public routes that don't require authentication
            const publicRoutes = ["/login", "/onboarding", "/", "/forgot-password"]
            const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

            if (!session && !isPublicRoute) {
                // Not authenticated and trying to access protected route
                router.push("/login")
            } else if (session && pathname === "/login") {
                // Already authenticated and on login page, redirect to dashboard
                router.push("/dashboard")
            }

            setLoading(false)
        }

        checkAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const publicRoutes = ["/login", "/onboarding", "/", "/forgot-password"]
            const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

            if (!session && !isPublicRoute) {
                router.push("/login")
            } else if (session && pathname === "/login") {
                router.push("/dashboard")
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [pathname, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Cargando...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
