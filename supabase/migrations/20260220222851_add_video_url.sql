-- Add video_url support to services table
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS video_url TEXT;
