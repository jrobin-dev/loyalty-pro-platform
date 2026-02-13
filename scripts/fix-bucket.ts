import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function fixIconsBucket() {
    if (!supabaseKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY.")
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Forcing update on bucket 'icons'...")

    // Explicitly update the bucket with a wide range of types
    const { data, error } = await supabase.storage.updateBucket('icons', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/svg+xml',
            'image/x-icon'
        ]
    })

    if (error) {
        console.error("Error updating bucket:", error)
    } else {
        console.log("Bucket updated successfully:", data)
    }

    // Verify
    const { data: bucketData, error: getError } = await supabase.storage.getBucket('icons')
    if (bucketData) {
        console.log("Current Bucket Config:", bucketData)
    }
}

fixIconsBucket()
