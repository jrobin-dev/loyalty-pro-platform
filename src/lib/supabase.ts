
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Debug logging (remove in production)
if (typeof window !== 'undefined') {
    console.log('🔍 Supabase Config:', {
        url: supabaseUrl,
        keyLength: supabaseAnonKey.length,
        keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
    })
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
