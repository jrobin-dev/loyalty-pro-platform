import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get the session token from cookies
    const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
        request.cookies.get("__Secure-next-auth.session-token")?.value

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith("/dashboard")

    // Public routes that should redirect to dashboard if logged in
    const isPublicRoute = pathname === "/" || pathname === "/onboarding"

    // If trying to access protected route without session
    if (isProtectedRoute && !sessionToken) {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
    }

    // If logged in and trying to access landing page, redirect to dashboard
    if (isPublicRoute && sessionToken && pathname === "/") {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

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
