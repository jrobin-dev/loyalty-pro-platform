import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("avatar") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File size must be less than 2MB" },
                { status: 400 }
            )
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPG, PNG, and WebP are allowed" },
                { status: 400 }
            )
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
        const filePath = `${session.user.id}/${fileName}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            })

        if (uploadError) {
            console.error("Upload error:", uploadError)
            return NextResponse.json(
                { error: "Failed to upload file" },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath)

        // Update user's avatarUrl in database
        await prisma.user.update({
            where: { id: session.user.id },
            data: { avatarUrl: publicUrl },
        })

        return NextResponse.json({ success: true, avatarUrl: publicUrl })
    } catch (error: any) {
        console.error("Error uploading avatar:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
