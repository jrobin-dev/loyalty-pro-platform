import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server"

// Use Service Role to allow uploading before user is authenticated (Onboarding flow)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        const bucket = formData.get("bucket") as string || "avatars"

        console.log(`📂 Uploading to bucket: '${bucket}'`)

        if (!file) {
            return new NextResponse("No file provided", { status: 400 })
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        console.log(`📄 Initial Upload - File: ${file.name}, Type: ${file.type}, Extension: ${fileExt}`)

        // Convert File to ArrayBuffer to send raw binary
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Attempt 1: Try with original types
        const { data, error } = await supabaseAdmin
            .storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
            })

        if (error) {
            console.error('❌ Supabase Upload Error:', JSON.stringify(error, null, 2))

            // If it's an SVG and failed (likely due to mime type restrictions in 'avatars' bucket)
            // WE MUST return it as Base64. Spoofing as PNG causes broken images in browsers.
            if (fileExt?.toLowerCase() === 'svg') {
                console.log('🚀 SVG detected and blocked by bucket - Converting to reliable Data URL Base64...')
                const base64 = buffer.toString('base64')
                const dataUrl = `data:image/svg+xml;base64,${base64}`
                return NextResponse.json({ url: dataUrl })
            }

            // For other errors or non-SVG files, return the error message
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from(bucket)
            .getPublicUrl(filePath)

        return NextResponse.json({ url: publicUrl })

    } catch (error) {
        console.error('❌ Internal Upload Error:', error)
        return NextResponse.json({ error: 'Error processing upload' }, { status: 500 })
    }
}

