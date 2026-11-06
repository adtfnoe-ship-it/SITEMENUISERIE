-- ════════════════════════════════════════════════════════════════════════
-- Administration du site vitrine adtfermeture.fr
-- À exécuter une fois dans Supabase → SQL Editor (projet partagé avec ADTF Pilot).
-- Sans risque pour ADTF Pilot : ne crée que des éléments propres au site vitrine,
-- et peut être relancé sans dommage.
--
-- Droits :
--   • tout le monde peut LIRE la galerie, les photos du site et les actualités publiées ;
--   • seuls les comptes listés dans est_admin_vitrine() peuvent MODIFIER.
-- Pour ajouter un administrateur : ajouter son e-mail dans la liste ci-dessous et relancer.
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.est_admin_vitrine()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = ANY (ARRAY[
    'adtf68@hotmail.fr'
  ]);
$$;

-- ─── Galerie et photos du site ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  src        text        NOT NULL,
  alt        text        NOT NULL DEFAULT '',
  label      text        NOT NULL DEFAULT '',
  section    text        NOT NULL DEFAULT 'gallery',
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz          DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vitrine_lecture_gallery_images"      ON public.gallery_images;
DROP POLICY IF EXISTS "vitrine_admin_ajout_gallery_images"  ON public.gallery_images;
DROP POLICY IF EXISTS "vitrine_admin_modif_gallery_images"  ON public.gallery_images;
DROP POLICY IF EXISTS "vitrine_admin_suppr_gallery_images"  ON public.gallery_images;

CREATE POLICY "vitrine_lecture_gallery_images" ON public.gallery_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "vitrine_admin_ajout_gallery_images" ON public.gallery_images
  FOR INSERT TO authenticated WITH CHECK (public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_modif_gallery_images" ON public.gallery_images
  FOR UPDATE TO authenticated USING (public.est_admin_vitrine()) WITH CHECK (public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_suppr_gallery_images" ON public.gallery_images
  FOR DELETE TO authenticated USING (public.est_admin_vitrine());

-- ─── Actualités ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.actualites (
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

ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vitrine_lecture_actualites"      ON public.actualites;
DROP POLICY IF EXISTS "vitrine_admin_ajout_actualites"  ON public.actualites;
DROP POLICY IF EXISTS "vitrine_admin_modif_actualites"  ON public.actualites;
DROP POLICY IF EXISTS "vitrine_admin_suppr_actualites"  ON public.actualites;

-- Articles publiés visibles par tous ; brouillons visibles par les administrateurs seulement.
CREATE POLICY "vitrine_lecture_actualites" ON public.actualites
  FOR SELECT TO anon, authenticated USING (published = true OR public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_ajout_actualites" ON public.actualites
  FOR INSERT TO authenticated WITH CHECK (public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_modif_actualites" ON public.actualites
  FOR UPDATE TO authenticated USING (public.est_admin_vitrine()) WITH CHECK (public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_suppr_actualites" ON public.actualites
  FOR DELETE TO authenticated USING (public.est_admin_vitrine());

-- ─── Stockage des photos (public en lecture) ───────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "vitrine_lecture_site_images"      ON storage.objects;
DROP POLICY IF EXISTS "vitrine_admin_ajout_site_images"  ON storage.objects;
DROP POLICY IF EXISTS "vitrine_admin_modif_site_images"  ON storage.objects;
DROP POLICY IF EXISTS "vitrine_admin_suppr_site_images"  ON storage.objects;

CREATE POLICY "vitrine_lecture_site_images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-images');
CREATE POLICY "vitrine_admin_ajout_site_images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_modif_site_images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.est_admin_vitrine());
CREATE POLICY "vitrine_admin_suppr_site_images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.est_admin_vitrine());

-- Rafraîchit le cache de l'API pour que les nouvelles tables soient visibles immédiatement.
NOTIFY pgrst, 'reload schema';
