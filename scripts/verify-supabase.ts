
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("❌ Credentials missing in .env.local");
    process.exit(1);
}

console.log("Testing connection to:", url);

const supabase = createClient(url, key);

async function check() {
    try {
        // Try to select from customers
        const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.code === 'PGRST204' || error.message?.includes('relation "customers" does not exist') || error.code === '42P01') {
                console.log("⚠️ Connection successful, but 'customers' table does not exist.");
                console.log("ACTION REQUIRED: Run the SQL script in Supabase Dashboard.");
            } else {
                console.error("❌ Connection Error:", error.message);
            }
        } else {
            console.log("✅ Connection Successful! 'customers' table exists.");
            console.log("✅ Ready for real data integration.");
        }
    } catch (e: any) {
        console.error("❌ Unexpected error:", e.message);
    }
}

check();
