-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#8B5CF6',
    secondary_color TEXT NOT NULL DEFAULT '#3B82F6',
    stamps_required INTEGER NOT NULL DEFAULT 10,
    reward_description TEXT NOT NULL DEFAULT '¡Premio gratis!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own business
CREATE POLICY "Users can view their own business"
    ON businesses FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own business
CREATE POLICY "Users can insert their own business"
    ON businesses FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own business
CREATE POLICY "Users can update their own business"
    ON businesses FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
