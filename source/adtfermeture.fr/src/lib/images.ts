import { supabase } from './supabase';

const BUCKET = 'site-images';

/**
 * Réduit une photo avant envoi (photos de téléphone : plusieurs Mo → quelques centaines de Ko).
 * La plus grande dimension est ramenée à `tailleMax` pixels. Les GIF (animés) sont envoyés tels quels.
 */
export async function compresserImage(file: File, tailleMax = 2000, qualite = 0.85): Promise<Blob> {
  if (file.type === 'image/gif') return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Format que le navigateur ne sait pas décoder : on envoie l'original.
    return file;
  }

  const echelle = Math.min(1, tailleMax / Math.max(bitmap.width, bitmap.height));
  const largeur = Math.round(bitmap.width * echelle);
  const hauteur = Math.round(bitmap.height * echelle);

  const canvas = document.createElement('canvas');
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, largeur, hauteur);
  bitmap.close();

  const versBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, qualite));

  // WebP si le navigateur sait l'encoder, sinon JPEG.
  const webp = await versBlob('image/webp');
  const blob = webp && webp.type === 'image/webp' ? webp : await versBlob('image/jpeg');
  if (!blob) return file;

  // Une image déjà légère peut grossir après conversion : on garde la plus petite.
  return blob.size < file.size ? blob : file;
}

function extension(type: string, nom: string) {
  const parType: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  };
  return parType[type] ?? (nom.split('.').pop() || 'jpg').toLowerCase();
}

/** Compresse puis envoie une photo dans le stockage du site ; renvoie son adresse publique. */
export async function envoyerImage(file: File, dossier: string): Promise<string> {
  const blob = await compresserImage(file);
  const type = blob.type || file.type;
  const chemin = `${dossier}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension(type, file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(chemin, blob, { contentType: type });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(chemin).data.publicUrl;
}

/** Supprime du stockage une photo envoyée depuis l'admin (sans effet sur les photos d'origine du site). */
export async function supprimerImageStockee(url: string) {
  const chemin = url.split(`/${BUCKET}/`)[1];
  if (chemin) await supabase.storage.from(BUCKET).remove([decodeURIComponent(chemin)]);
}

/** Nom de fichier → libellé lisible (« fenetre-pvc_blanche.jpg » → « fenetre pvc blanche »). */
export function libelleDepuisNomFichier(nom: string) {
  return nom.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
}
