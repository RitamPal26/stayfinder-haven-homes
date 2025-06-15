
-- Add a column to track if a booking was made instantly
ALTER TABLE public.bookings
ADD COLUMN is_instant BOOLEAN NOT NULL DEFAULT FALSE;

-- Enable real-time updates on the bookings table
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
