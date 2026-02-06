import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Se requiere contraseña actual y nueva" },
                { status: 400 }
            )
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "La nueva contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            )
        }

        // Verify current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: session.user.email!,
            password: currentPassword,
        })

        if (signInError) {
            return NextResponse.json(
                { error: "Contraseña actual incorrecta" },
                { status: 401 }
            )
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        })

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error changing password:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
