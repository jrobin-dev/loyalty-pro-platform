-- SAFE FIX FOR REALTIME NOTIFICATIONS
-- Run this entire block in Supabase SQL Editor

-- 1. Enable RLS (Ensure it is on)
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- 2. Drop the policy if it already exists (Fixes Error 42710)
DROP POLICY IF EXISTS "Users can view their own notifications" ON "Notification";

-- 3. Re-create the policy correctly
CREATE POLICY "Users can view their own notifications"
ON "Notification" FOR SELECT
USING (auth.uid()::text = "userId");

-- 4. Add table to Realtime Publication (This triggers the 'CHANNEL_ERROR' fix)
-- Uses a DO block to check if table is already in publication to avoid errors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'Notification'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
  END IF;
END
$$;
