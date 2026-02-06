import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get Supabase session tokens (not next-auth!)
    const supabaseAuthToken = request.cookies.get("sb-access-token")?.value ||
        request.cookies.get("sb-refresh-token")?.value

    // Alternative: check for any supabase cookie
    const hasSupabaseSession = Array.from(request.cookies.getAll()).some(
        cookie => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")
    )

    const isAuthenticated = supabaseAuthToken || hasSupabaseSession

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith("/dashboard")

    // Auth routes that should redirect to dashboard if logged in
    const isAuthRoute = pathname === "/login" || pathname === "/onboarding" || pathname === "/forgot-password" || pathname.startsWith("/reset-password")

    // If trying to access protected route without session
    if (isProtectedRoute && !isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }

    // If logged in and trying to access auth routes, redirect to dashboard
    if (isAuthRoute && isAuthenticated) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    // If logged in and trying to access landing page, let them in!
    // Removed redirect for root path based on user request "me tiene que dejar sin problema"

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
