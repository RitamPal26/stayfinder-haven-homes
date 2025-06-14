
-- Add property type and enhanced search fields to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'apartment' CHECK (property_type IN ('apartment', 'house', 'villa', 'condo', 'townhouse', 'studio'));
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS instant_book BOOLEAN DEFAULT false;

-- Create favorites/wishlist table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Create recently viewed table for user experience
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Create property comparison table
CREATE TABLE IF NOT EXISTS public.property_comparisons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    listing_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add coordinates for map functionality
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING GIN (to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_listings_title_description ON public.listings USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings (price_per_night);
CREATE INDEX IF NOT EXISTS idx_listings_guests ON public.listings (max_guests);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON public.listings (property_type);
CREATE INDEX IF NOT EXISTS idx_listings_amenities ON public.listings USING GIN (amenities);
CREATE INDEX IF NOT EXISTS idx_listings_available ON public.listings (is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_listings_coordinates ON public.listings (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create indexes for bookings date range queries
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings (listing_id, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

-- Enable RLS on new tables
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for recently viewed
CREATE POLICY "Users can view their recently viewed" ON public.recently_viewed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to recently viewed" ON public.recently_viewed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update recently viewed" ON public.recently_viewed FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for property comparisons
CREATE POLICY "Users can view their comparisons" ON public.property_comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create comparisons" ON public.property_comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their comparisons" ON public.property_comparisons FOR DELETE USING (auth.uid() = user_id);

-- Update listings policies to include new search functionality
DROP POLICY IF EXISTS "Anyone can view available listings" ON public.listings;
CREATE POLICY "Anyone can view available listings" ON public.listings FOR SELECT TO authenticated, anon USING (is_available = true);
