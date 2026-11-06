/*
# Admin Backend Schema

## Short title
Site admin database setup — gallery images, news articles, and storage bucket.

## Changes
1. Creates `gallery_images` table for managing gallery photos.
2. Creates `actualites` table for news/announcements.
3. Sets up `site-images` Supabase Storage public bucket for image uploads.
4. Configures RLS policies: public read + authenticated full CRUD on both tables.

## New Tables

### gallery_images
- `id` uuid PK
- `src` text — image URL (Pexels link OR Supabase storage URL)
- `alt` text — accessibility description
- `label` text — display label shown on hover
- `section` text — e.g. 'gallery' (future: 'hero')
- `sort_order` int — display order
- `created_at` timestamptz

### actualites
- `id` uuid PK
- `title` text — article title
- `slug` text UNIQUE — URL-friendly identifier (auto-generated)
- `excerpt` text — short preview text
- `content` text — full body
- `image_url` text — cover image URL
- `published` boolean — draft vs published
- `published_at` timestamptz — date shown on frontend
- `created_at` / `updated_at` timestamptz

## Security
- gallery_images: anon + authenticated SELECT; authenticated INSERT/UPDATE/DELETE.
- actualites: anon SELECT for published=true only; authenticated full CRUD.
- storage.objects: public read for bucket 'site-images'; authenticated upload + delete.

## Notes
1. Idempotent — safe to re-run (IF NOT EXISTS, DROP POLICY IF EXISTS before CREATE).
2. No user_id column — single-tenant admin, no multi-user isolation needed.
3. The storage bucket file size limit is 10 MB; accepted MIME types are common image formats.
*/

-- ─────────────────────────────────────────────────────────
-- gallery_images
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  src        text        NOT NULL,
  alt        text        NOT NULL DEFAULT '',
  label      text        NOT NULL DEFAULT '',
  section    text        NOT NULL DEFAULT 'gallery',
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz          DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_images"   ON gallery_images;
DROP POLICY IF EXISTS "auth_insert_gallery_images"   ON gallery_images;
DROP POLICY IF EXISTS "auth_update_gallery_images"   ON gallery_images;
DROP POLICY IF EXISTS "auth_delete_gallery_images"   ON gallery_images;

CREATE POLICY "anon_select_gallery_images" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "auth_insert_gallery_images" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_gallery_images" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_gallery_images" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────
-- actualites
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actualites (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  excerpt      text        NOT NULL DEFAULT '',
  content      text        NOT NULL DEFAULT '',
  image_url    text,
  published    boolean     NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz          DEFAULT now(),
  updated_at   timestamptz          DEFAULT now()
);

ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_actualites"  ON actualites;
DROP POLICY IF EXISTS "auth_select_actualites"  ON actualites;
DROP POLICY IF EXISTS "auth_insert_actualites"  ON actualites;
DROP POLICY IF EXISTS "auth_update_actualites"  ON actualites;
DROP POLICY IF EXISTS "auth_delete_actualites"  ON actualites;

CREATE POLICY "anon_select_actualites" ON actualites FOR SELECT
  TO anon USING (published = true);
CREATE POLICY "auth_select_actualites" ON actualites FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "auth_insert_actualites" ON actualites FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_actualites" ON actualites FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_actualites" ON actualites FOR DELETE
  TO authenticated USING (true);

-- ─────────────────────────────────────────────────────────
-- Storage bucket: site-images (public)
-- ─────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_site_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_insert_site_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_update_site_images"  ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_site_images"  ON storage.objects;

CREATE POLICY "public_read_site_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'site-images');
CREATE POLICY "auth_insert_site_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "auth_update_site_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'site-images');
CREATE POLICY "auth_delete_site_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'site-images');
