-- Enable RLS on Notification table
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own notifications
CREATE POLICY "Users can view their own notifications"
ON "Notification" FOR SELECT
USING (auth.uid()::text = "userId");

-- Allow users to insert their notifications (e.g. from client side if needed, or trigger)
-- Usually notifications are created by triggers/server, but Realtime might need this if using client-side broadcast?
-- Actually, strict Realtime 'postgres_changes' only needs SELECT permission for the subscriber.

-- Allow service role full access (default, but good to be explicit if needed)

-- Add table to realtime publication
-- Note: 'supabase_realtime' is the default publication
ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
