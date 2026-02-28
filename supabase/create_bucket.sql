-- Run this in your Supabase SQL Editor to create the missing bucket

-- 1. Create the 'pro-banners' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pro-banners', 'pro-banners', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view banners
CREATE POLICY "Banners Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pro-banners' );

-- 3. Allow authenticated users to upload banners
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pro-banners' AND
  auth.role() = 'authenticated'
);

-- 4. Allow users to update their own banners
CREATE POLICY "Users can update own banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);

-- 5. Allow users to delete their own banners
CREATE POLICY "Users can delete own banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);
