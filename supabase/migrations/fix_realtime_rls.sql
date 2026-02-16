-- Fix RLS for Notifications (Realtime)

-- 1. Ensure Table is Published to Realtime
-- Use separate statements to avoid transaction block errors if publication doesn't exist (though standard Supabase setup has it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'Notification'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
  END IF;
END
$$;

-- 2. Drop existing policy to avoid conflicts (if any exist with different names)
DROP POLICY IF EXISTS "Users can view their own notifications" ON "Notification";
DROP POLICY IF EXISTS "Individual view" ON "Notification";

-- 3. Re-create the SELECT policy securely
-- This allows a user to "listen" to changes where userId matches their own ID
CREATE POLICY "Individual view"
ON "Notification"
FOR SELECT
USING (auth.uid()::text = "userId");

-- 4. Ensure RLS is enabled
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
