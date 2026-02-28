-- =====================================================
-- RATINGS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(booking_id) -- One rating per booking
);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view ratings"
    ON public.ratings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create ratings"
    ON public.ratings FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own ratings"
    ON public.ratings FOR UPDATE
    USING (auth.uid() = client_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ratings_professional ON public.ratings(professional_id);
CREATE INDEX IF NOT EXISTS idx_ratings_booking ON public.ratings(booking_id);

-- Function to calculate average rating for a professional
CREATE OR REPLACE FUNCTION get_professional_rating(pro_id UUID)
RETURNS TABLE(average_rating NUMERIC, total_ratings BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0) as average_rating,
        COUNT(*)::BIGINT as total_ratings
    FROM public.ratings
    WHERE professional_id = pro_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update professional rating on new rating
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    total_count BIGINT;
BEGIN
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
        COUNT(*)
    INTO avg_rating, total_count
    FROM public.ratings
    WHERE professional_id = NEW.professional_id;
    
    UPDATE public.professionals
    SET rating = avg_rating, total_reviews = total_count
    WHERE id = NEW.professional_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_professional_rating
    AFTER INSERT OR UPDATE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_professional_rating();

-- Grant access
GRANT ALL ON public.ratings TO authenticated;
GRANT SELECT ON public.ratings TO anon;
