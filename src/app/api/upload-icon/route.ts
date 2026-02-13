import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Initialize Admin Client to bypass RLS
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const fileExt = file.name.split('.').pop()
        const fileName = `icon-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `icons/${fileName}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to 'loyalty-icons' bucket which is confirmed to allow SVGs
        // We set content-type explicitly to ensure SVG is handled correctly
        const { data, error } = await supabaseAdmin
            .storage
            .from('loyalty-icons')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) {
            console.error('Supabase storage error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('loyalty-icons')
            .getPublicUrl(filePath)

        return NextResponse.json({ url: publicUrl })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
