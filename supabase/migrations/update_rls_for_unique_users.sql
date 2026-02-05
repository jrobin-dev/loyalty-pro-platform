-- Update RLS policies to allow any user_id (for temporary user system)
-- This allows users with localStorage-generated IDs to create and manage their businesses
-- TODO: Update these policies when implementing Supabase Auth

-- Drop existing policies
DROP POLICY IF EXISTS "Allow demo user access" ON businesses;
DROP POLICY IF EXISTS "Authenticated users can manage their business" ON businesses;

-- Create permissive policy that allows any user_id to manage their own business
-- This works with our temporary localStorage-based user ID system
CREATE POLICY "Users can manage their own business"
    ON businesses FOR ALL
    USING (true)  -- Allow read for any user_id
    WITH CHECK (true);  -- Allow write for any user_id

-- Note: This is intentionally permissive for the demo/development phase
-- When Supabase Auth is implemented, replace with:
-- USING (auth.uid()::text = user_id)
-- WITH CHECK (auth.uid()::text = user_id)
