
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing env vars")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log("🔍 Testing connection to:", supabaseUrl)
    console.log("🔑 Using Anon Key (Simulating Frontend)")

    // Test 1: Try querying 'Customer' (Correct name)
    console.log("\n--- Attempt 1: Table 'Customer' ---")
    const { data: data1, error: error1 } = await supabase
        .from('Customer')
        .select('*')
        .limit(1)

    if (error1) {
        console.error("❌ Error:", error1.message, "| Code:", error1.code)
    } else {
        console.log("✅ Success! Found:", data1?.length, "records")
    }

    // Test 2: Try querying 'customers' (Old name)
    console.log("\n--- Attempt 2: Table 'customers' ---")
    const { data: data2, error: error2 } = await supabase
        .from('customers')
        .select('*')
        .limit(1)

    if (error2) {
        console.error("❌ Error:", error2.message, "| Code:", error2.code)
    } else {
        console.log("✅ Success! Found:", data2?.length, "records")
    }
}

testConnection()
