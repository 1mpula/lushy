-- 1. (Skip ALTER TABLE to avoid permission error 'must be owner')
-- RLS is enabled by default on storage.objects in Supabase.

-- 2. Drop existing policies to avoid conflicts

DROP POLICY IF EXISTS "Banners Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own banners" ON storage.objects;

-- 3. Re-create policies for 'pro-banners'

-- Allow public viewing
CREATE POLICY "Banners Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pro-banners' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pro-banners' AND
  auth.role() = 'authenticated'
);

-- Allow updates (overwrite)
CREATE POLICY "Users can update own banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);

-- Allow deletion
CREATE POLICY "Users can delete own banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pro-banners' AND
  auth.uid() = owner
);

-- 4. Verify Professionals Table RLS (Just in case)
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can insert own professional profile" ON public.professionals;
CREATE POLICY "Providers can insert own professional profile"
    ON public.professionals FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Providers can update own professional profile" ON public.professionals;
CREATE POLICY "Providers can update own professional profile"
    ON public.professionals FOR UPDATE USING (user_id = auth.uid());
