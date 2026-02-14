import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

import { createAdminClient } from "@/lib/supabase/admin"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const customerId = (await params).id
        const supabase = await createClient()
        const supabaseAdmin = createAdminClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // 1. Fetch the customer to find their linked User ID and Tenant
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { tenant: { select: { ownerId: true } } }
        })

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        const targetUserId = customer.userId

        // 2. Security Check: Actor must be the linked User OR the Tenant Owner
        const isSelf = targetUserId === session.user.id
        const isOwner = customer.tenant.ownerId === session.user.id

        if (!isSelf && !isOwner) {
            return NextResponse.json({ error: "No tienes permisos para subir este avatar" }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get("avatar") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file size and type
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${targetUserId}-${Date.now()}.${fileExt}`
        const filePath = `${targetUserId}/${fileName}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage using ADMIN client to bypass RLS
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from("avatars")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            })

        if (uploadError) {
            console.error("DEBUG - Upload error details:", {
                message: uploadError.message,
                name: uploadError.name,
                cause: (uploadError as any).cause,
                path: filePath
            })
            return NextResponse.json({
                error: `Upload failed: ${uploadError.message}`,
                details: uploadError
            }, { status: 500 })
        }

        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath)

        if (!targetUserId) {
            return NextResponse.json({ error: "Customer has no linked user" }, { status: 400 })
        }

        // Update target user's avatarUrl
        await prisma.user.update({
            where: { id: targetUserId },
            data: { avatarUrl: publicUrl },
        })

        return NextResponse.json({ success: true, avatarUrl: publicUrl })

    } catch (error: any) {
        console.error("Error uploading customer avatar:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
