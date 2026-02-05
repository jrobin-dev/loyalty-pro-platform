-- Add phone column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add email column for authentication (will be synced with auth.users.email)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(email);
