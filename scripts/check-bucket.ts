import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role to create buckets
// Fallback to anon key if service role is not available, but creation might fail
const supabaseKeyAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey || supabaseKeyAnon)

async function checkBucket() {
    console.log("Checking for bucket 'course-covers'...")
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error("Error listing buckets:", error)
        return
    }

    const bucketParams = {
        name: 'course-covers',
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    }

    const exists = data.find(b => b.name === 'course-covers')

    if (exists) {
        console.log("Bucket 'course-covers' already exists.")
    } else {
        console.log("Bucket 'course-covers' NOT found.")
        // Try to create if we have service key (implied by context of running this script)
        if (supabaseKey) {
            console.log("Attempting to create bucket...")
            const { data: bucket, error: createError } = await supabase.storage.createBucket('course-covers', {
                public: true,
                fileSizeLimit: 5242880,
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
            })
            if (createError) {
                console.error("Error creating bucket:", createError)
            } else {
                console.log("Bucket created successfully:", bucket)
            }
        } else {
            console.log("Cannot create bucket without SUPABASE_SERVICE_ROLE_KEY. Please create it manually in dashboard.")
        }
    }
}

checkBucket()
