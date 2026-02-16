import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    // Capture upstream errors
    const error = searchParams.get('error')
    const error_code = searchParams.get('error_code')
    const error_description = searchParams.get('error_description')

    // If there's an error from Supabase, forward it to the error page
    if (error) {
        return NextResponse.redirect(new URL(`/auth/auth-code-error?error=${error}&error_description=${error_description}`, request.url))
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables")
        return NextResponse.redirect(new URL('/auth/auth-code-error?error=missing_env', request.url))
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (e) {
                        // Handle middleware/server component cookie setting limitations
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.delete({ name, ...options })
                    } catch (e) {
                    }
                },
            },
        }
    )

    try {
        // Handle PKCE Code Exchange
        if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                return NextResponse.redirect(new URL(next, request.url))
            }
            console.error("Auth Callback Error (Code Exchange):", error)
            return NextResponse.redirect(new URL(`/auth/auth-code-error?error=exchange_failed&error_description=${encodeURIComponent(error.message)}`, request.url))
        }

        // Handle Token Hash (Magic Link / OTP direct)
        if (token_hash && type) {
            const { error } = await supabase.auth.verifyOtp({
                type,
                token_hash,
            })
            if (!error) {
                return NextResponse.redirect(new URL(next, request.url))
            }
            console.error("Auth Callback Error (Verify OTP):", error)
            return NextResponse.redirect(new URL(`/auth/auth-code-error?error=otp_failed&error_description=${encodeURIComponent(error.message)}`, request.url))
        }
    } catch (err: any) {
        console.error("Unexpected Auth Callback Error:", err)
        return NextResponse.redirect(new URL(`/auth/auth-code-error?error=unexpected&error_description=${encodeURIComponent(err.message)}`, request.url))
    }

    // Fallback: No valid auth parameters found
    return NextResponse.redirect(new URL('/auth/auth-code-error?error=no_code', request.url))
}
