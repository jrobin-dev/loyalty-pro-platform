
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        console.log("🛠️ Starting Realtime Setup...")

        // 1. Enable Realtime for Notification table
        // We use catch to ignore "already exists" errors or similar
        try {
            await prisma.$executeRawUnsafe(`alter publication supabase_realtime add table "Notification";`)
            console.log("✅ Added Notification to supabase_realtime")
        } catch (e: any) {
            console.log("⚠️ Realtime setup note:", e.message)
        }

        // 2. Enable RLS
        try {
            await prisma.$executeRawUnsafe(`alter table "Notification" enable row level security;`)
            console.log("✅ Enabled RLS on Notification")
        } catch (e: any) {
            console.log("⚠️ RLS enable note:", e.message)
        }

        // 3. Create Policy for SELECT (Required for Realtime)
        try {
            // Drop existing to ensure update
            await prisma.$executeRawUnsafe(`drop policy if exists "Users can view their own notifications" on "Notification";`)

            // Create new
            await prisma.$executeRawUnsafe(`
                create policy "Users can view their own notifications"
                on "Notification" for select
                using ( "userId" = auth.uid()::text );
            `)
            console.log("✅ Created SELECT policy for Notification")
        } catch (e: any) {
            console.log("❌ Policy creation failed:", e.message)
            return NextResponse.json({ error: "Policy failed: " + e.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: "Realtime configured for Notification table" })

    } catch (error: any) {
        console.error("🔥 Fatal Setup Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
