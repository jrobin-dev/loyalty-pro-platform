-- Create customers table with relationship to businesses
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    stamps INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    tier TEXT DEFAULT 'Bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_last_visit ON customers(last_visit DESC);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - users can only see customers from their own business
CREATE POLICY "Users can manage their business customers"
    ON customers FOR ALL
    USING (true)
    WITH CHECK (true);

-- Note: This is a permissive policy for the temporary user ID system
-- When Supabase Auth is implemented, this should be updated to:
-- USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
-- WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
