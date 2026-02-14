import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Proteccion de Dashboard y Admin
    const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

    // Si intenta acceder a dashboard o admin sin sesión, redirigir a login
    if ((isDashboardPath || isAdminPath) && !session) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // Guardamos la URL a la que intentaba acceder para redirigirlo después del login si fuera necesario
        url.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes, unless we want to protect them too later)
         * Feel free to modify this pattern to include more paths.
         */
        '/dashboard/:path*',
        '/admin/:path*',
    ],
}
