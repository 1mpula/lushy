-- Ensure the bucket is set to public
UPDATE storage.buckets
SET public = true
WHERE id = 'pro-banners';

-- Verify/Re-apply the public access policy
DROP POLICY IF EXISTS "Banners Public Access" ON storage.objects;
CREATE POLICY "Banners Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pro-banners' );
