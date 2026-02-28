-- Run this in Supabase SQL Editor to add the missing column

ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS banner_url TEXT;
