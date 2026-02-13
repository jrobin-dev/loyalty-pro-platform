import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createNewBucket() {
    if (!supabaseKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY.")
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const BUCKET_NAME = 'loyalty-icons'

    console.log(`Creating/Updating bucket '${BUCKET_NAME}'...`)

    // 1. Try to get bucket
    const { data: existingBucket, error: getError } = await supabase.storage.getBucket(BUCKET_NAME)

    if (existingBucket) {
        console.log(`Bucket '${BUCKET_NAME}' exists. Updating...`)
        const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon']
        })
        if (updateError) console.error("Update Error:", updateError)
        else console.log("Bucket updated.")
    } else {
        console.log(`Bucket '${BUCKET_NAME}' does not exist. Creating...`)
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon']
        })
        if (error) console.error("Create Error:", error)
        else console.log("Bucket created:", data)
    }
}

createNewBucket()
