-- Lushy Database Schema v2
-- Designed for the "final lushy booking workflow" n8n integration
-- Run this in Supabase SQL Editor (Database > SQL Editor)

-- ============================================
-- DROP EXISTING TABLES (if starting fresh)
-- ============================================
-- Uncomment if you need to reset:
-- DROP TABLE IF EXISTS public.bookings CASCADE;
-- DROP TABLE IF EXISTS public.services CASCADE;
-- DROP TABLE IF EXISTS public.professionals CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- For both clients and providers
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('client', 'provider')) NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    push_token TEXT,  -- For push notifications
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFESSIONALS TABLE (extends profiles for providers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT,
    expertise TEXT[],  -- Array: ['Hair', 'Nails', 'Makeup']
    location TEXT,
    bio TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'trial', 'past_due', 'suspended')) DEFAULT 'trial',
    subscription_due_date TIMESTAMPTZ DEFAULT (NOW() + interval '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    image_url TEXT, -- Deprecated in favor of image_urls
    image_urls TEXT[], -- Array of image URLs
    image_width INTEGER, -- Width of the primary image (first in image_urls)
    image_height INTEGER, -- Height of the primary image (first in image_urls)
    video_url TEXT, -- Optional video URL for the service
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- Matches n8n workflow expected fields
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    
    -- Denormalized fields (for n8n workflow - it expects these directly)
    client_name TEXT NOT NULL,
    client_phone TEXT,
    professional_name TEXT NOT NULL,
    professional_phone TEXT,
    service_name TEXT NOT NULL,
    
    -- Booking details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    
    -- Location
    location_type TEXT CHECK (location_type IN ('house_call', 'salon_visit')) DEFAULT 'salon_visit',
    address TEXT,
    
    -- Status (matches n8n workflow)
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Professionals policies
DROP POLICY IF EXISTS "Professionals are viewable by everyone" ON public.professionals;
CREATE POLICY "Professionals are viewable by everyone"
    ON public.professionals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Providers can insert own professional profile" ON public.professionals;
CREATE POLICY "Providers can insert own professional profile"
    ON public.professionals FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Providers can update own professional profile" ON public.professionals;
CREATE POLICY "Providers can update own professional profile"
    ON public.professionals FOR UPDATE USING (user_id = auth.uid());

-- Services policies
DROP POLICY IF EXISTS "Active services are viewable by everyone" ON public.services;
CREATE POLICY "Active services are viewable by everyone"
    ON public.services FOR SELECT USING (
        is_active = true AND 
        professional_id IN (
            SELECT id FROM public.professionals WHERE subscription_status != 'suspended'
        )
    );

DROP POLICY IF EXISTS "Professionals can manage own services" ON public.services;
CREATE POLICY "Professionals can manage own services"
    ON public.services FOR ALL USING (
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Bookings policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT USING (
        client_id = auth.uid() OR
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Clients can create bookings" ON public.bookings;
CREATE POLICY "Clients can create bookings"
    ON public.bookings FOR INSERT WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Participants can update bookings" ON public.bookings;
CREATE POLICY "Participants can update bookings"
    ON public.bookings FOR UPDATE USING (
        client_id = auth.uid() OR
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Allow service role (n8n) full access
DROP POLICY IF EXISTS "Service role has full access to bookings" ON public.bookings;
CREATE POLICY "Service role has full access to bookings"
    ON public.bookings FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_professionals_user ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_professionals_updated_at ON public.professionals;
CREATE TRIGGER update_professionals_updated_at 
    BEFORE UPDATE ON public.professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- ============================================
-- STORAGE (for Services)
-- ============================================
-- NOTE: You may need to enable the Storage extension or run this in the SQL editor if connection fails via migration tool.

-- Create 'services' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to view images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'services' );

-- Policy: Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
);

-- Policy: Users can update/delete their own files
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'services' AND
  auth.uid() = owner
);

DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'services' AND
  auth.uid() = owner
);


-- ============================================
-- MIGRATION: Add banner_url to professionals
-- ============================================
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- ============================================
-- MIGRATION: Add blocked_dates to professionals
-- ============================================
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS blocked_dates TEXT[] DEFAULT '{}';

-- ============================================
-- STORAGE (for Professional Banners)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('pro-banners', 'pro-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public access to banners
DROP POLICY IF EXISTS "Banners Public Access" ON storage.objects;
CREATE POLICY "Banners Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pro-banners' );

-- Policy: Authenticated users can upload banners
DROP POLICY IF EXISTS "Authenticated users can upload banners" ON storage.objects;
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pro-banners' AND
  auth.role() = 'authenticated'
);

-- Policy: Users can update their own banners
DROP POLICY IF EXISTS "Users can update own banners" ON storage.objects;
CREATE POLICY "Users can update own banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);

-- Policy: Users can delete their own banners
DROP POLICY IF EXISTS "Users can delete own banners" ON storage.objects;
CREATE POLICY "Users can delete own banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);


-- ============================================
-- RATINGS TABLE
-- Allows clients to rate completed bookings
-- ============================================
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.ratings;
CREATE POLICY "Ratings are viewable by everyone"
    ON public.ratings FOR SELECT USING (true);

-- Clients can insert their own ratings
DROP POLICY IF EXISTS "Clients can create ratings" ON public.ratings;
CREATE POLICY "Clients can create ratings"
    ON public.ratings FOR INSERT WITH CHECK (client_id = auth.uid());

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ratings_booking ON public.ratings(booking_id);
CREATE INDEX IF NOT EXISTS idx_ratings_professional ON public.ratings(professional_id);

-- Trigger: Auto-update professional's rating and total_reviews after a new rating
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.professionals
    SET 
        rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.ratings WHERE professional_id = NEW.professional_id),
        total_reviews = (SELECT COUNT(*) FROM public.ratings WHERE professional_id = NEW.professional_id)
    WHERE id = NEW.professional_id;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_rating_on_insert ON public.ratings;
CREATE TRIGGER update_rating_on_insert
    AFTER INSERT ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION update_professional_rating();
