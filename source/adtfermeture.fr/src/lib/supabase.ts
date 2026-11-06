import { createClient } from '@supabase/supabase-js';

function makeClient() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
  // Supabase throws if url/key are empty — use placeholder so module never crashes.
  // Queries will fail gracefully (caught in each component) if env vars are missing.
  return createClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-anon-key',
  );
}

export const supabase = makeClient();

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  label: string;
  section: string;
  sort_order: number;
  created_at: string;
};

export type Actualite = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
