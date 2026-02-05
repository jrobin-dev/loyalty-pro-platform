-- Temporary fix: Allow access to demo user without authentication
-- This should be replaced with proper authentication in production

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own business" ON businesses;
DROP POLICY IF EXISTS "Users can insert their own business" ON businesses;
DROP POLICY IF EXISTS "Users can update their own business" ON businesses;

-- Create permissive policy for demo user
CREATE POLICY "Allow demo user access"
    ON businesses FOR ALL
    USING (user_id = 'demo-user-123')
    WITH CHECK (user_id = 'demo-user-123');

-- Optional: Create policy for authenticated users (for future use)
CREATE POLICY "Authenticated users can manage their business"
    ON businesses FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);
