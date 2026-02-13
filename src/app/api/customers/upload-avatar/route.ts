import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import prisma from "@/lib/prisma"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const customerId = formData.get("customerId") as string

        if (!customerId) {
            return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
        }

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File size must be less than 5MB" },
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

        // Verify customer exists
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { user: true }
        })

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 })
        }

        const supabase = createAdminClient()

        // Generate unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${customer.id}-${Date.now()}.${fileExt}`
        const filePath = `customer-avatars/${fileName}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage (Using 'avatars' bucket for simplicity, or creare 'customers' bucket if needed)
        // Trying 'avatars' first as it likely exists.
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            })

        if (uploadError) {
            console.error("Upload error:", uploadError)
            return NextResponse.json(
                { error: "Failed to upload file to storage" },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath)

        return NextResponse.json({ success: true, url: publicUrl })

    } catch (error: any) {
        console.error("Error uploading avatar:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
