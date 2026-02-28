-- Storage Policies for "services" bucket
-- Run this in Supabase SQL Editor

-- 1. Enable public access to view images (select)
-- This allows anyone (including the app) to view the images via public URL
create policy "Public Access to Services Bucket"
on storage.objects for select
using ( bucket_id = 'services' );

-- 2. Allow authenticated users to upload images (insert)
-- This allows logged-in pros to upload their service images
create policy "Authenticated Users Can Upload to Services Bucket"
on storage.objects for insert
with check (
  bucket_id = 'services' 
  and auth.role() = 'authenticated'
);

-- 3. Allow users to update their own images (optional but good)
create policy "Users Can Update Own Images"
on storage.objects for update
using (
  bucket_id = 'services' 
  and auth.uid() = owner
);

-- 4. Allow users to delete their own images (optional)
create policy "Users Can Delete Own Images"
on storage.objects for delete
using (
  bucket_id = 'services' 
  and auth.uid() = owner
);
