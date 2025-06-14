
-- Create listings table first
CREATE TABLE public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    max_guests INTEGER DEFAULT 4,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    amenities TEXT[], -- Array of amenity strings
    house_rules TEXT,
    is_available BOOLEAN DEFAULT true,
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    booking_id UUID REFERENCES public.bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payouts table
CREATE TABLE public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    payout_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create host messages table for guest communication
CREATE TABLE public.host_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for listings
CREATE POLICY "Anyone can view available listings" ON public.listings FOR SELECT USING (is_available = true);
CREATE POLICY "Hosts can view their own listings" ON public.listings FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Hosts can create listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own listings" ON public.listings FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their own listings" ON public.listings FOR DELETE USING (auth.uid() = host_id);

-- RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Hosts can view bookings for their listings" ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.host_id = auth.uid())
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Hosts can update bookings for their listings" ON public.bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.host_id = auth.uid())
);

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for payouts
CREATE POLICY "Hosts can view their own payouts" ON public.payouts FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Hosts can insert their own payouts" ON public.payouts FOR INSERT WITH CHECK (auth.uid() = host_id);

-- RLS policies for host messages
CREATE POLICY "Users can view messages for their bookings" ON public.host_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings b 
        WHERE b.id = booking_id AND (b.user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.listings l WHERE l.id = b.listing_id AND l.host_id = auth.uid()))
    )
);
CREATE POLICY "Users can send messages for their bookings" ON public.host_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (
        SELECT 1 FROM public.bookings b 
        WHERE b.id = booking_id AND (b.user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.listings l WHERE l.id = b.listing_id AND l.host_id = auth.uid()))
    )
);
