import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function setupIconsBucket() {
    if (!supabaseKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY. Cannot create buckets.")
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Checking for bucket 'icons'...")
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error("Error listing buckets:", error)
        return
    }

    const bucketName = 'icons'
    const existingBucket = buckets.find(b => b.name === bucketName)

    if (existingBucket) {
        console.log(`Bucket '${bucketName}' already exists. Updating configuration...`)
        // Update to ensure SVG is allowed
        const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: true,
            fileSizeLimit: 2097152, // 2MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        })

        if (updateError) {
            console.error("Error updating bucket:", updateError)
        } else {
            console.log("Bucket updated successfully.")
        }
    } else {
        console.log(`Bucket '${bucketName}' does not exist. Creating...`)
        const { data: bucket, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 2097152, // 2MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        })

        if (createError) {
            console.error("Error creating bucket:", createError)
        } else {
            console.log("Bucket created successfully:", bucket)
        }
    }
}

setupIconsBucket()
