import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Photos « fixes » du site (logo, accueil, produits…), remplaçables depuis l'admin.
 *
 * Une photo remplacée est enregistrée dans la table `gallery_images` avec
 * section = 'emplacement' et label = clé de l'emplacement (pas de table supplémentaire).
 * Sans remplacement, la photo d'origine (`defaut`) est affichée.
 */

export type Emplacement = {
  cle: string;
  nom: string;
  groupe: string;
  defaut: string;
  alt: string;
  format: string;
};

export const SECTION_EMPLACEMENT = 'emplacement';

export const EMPLACEMENTS: Emplacement[] = [
  // Identité
  { cle: 'logo', nom: 'Logo', groupe: 'Identité', format: 'Logo (fond transparent conseillé)',
    defaut: '/ChatGPT_Image_15_juin_2026,_12_07_44.png', alt: 'ADTF – Alliance Diffusion Toutes Fermetures' },

  // Accueil
  { cle: 'accueil.principale', nom: 'Grande photo', groupe: "Haut de page (accueil)", format: 'Paysage 4:3',
    defaut: '/ChatGPT_Image_22_juin_2026,_08_55_06.png', alt: 'Baie vitrée aluminium ADTF' },
  { cle: 'accueil.gauche', nom: 'Petite photo de gauche', groupe: "Haut de page (accueil)", format: 'Paysage 4:3',
    defaut: '/ChatGPT_Image_22_juin_2026,_10_43_01.png', alt: "Porte d'entrée" },
  { cle: 'accueil.droite', nom: 'Petite photo de droite', groupe: "Haut de page (accueil)", format: 'Paysage 4:3',
    defaut: '/files_4349414-2026-06-22T07-22-25-429Z-ChatGPT_Image_22_juin_2026,_08_58_54.webp', alt: 'Portail aluminium' },

  // Menuiseries intérieures
  { cle: 'interieur.fenetres', nom: 'Fenêtres', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_10_46_50.png', alt: 'Fenêtres' },
  { cle: 'interieur.baies', nom: 'Portes-fenêtres & Baies vitrées', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_08_55_06.png', alt: 'Portes-fenêtres & Baies vitrées' },
  { cle: 'interieur.velux', nom: 'Fenêtres de toit (Velux)', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_09_03_24.png', alt: 'Fenêtres de toit (Velux)' },
  { cle: 'interieur.verrieres', nom: 'Verrières', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_11_02_39.png', alt: 'Verrières' },
  { cle: 'interieur.portes', nom: 'Portes intérieures', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_12_30_10.png', alt: 'Portes intérieures' },
  { cle: 'interieur.stores', nom: 'Stores intérieurs', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/menuiseries intérieurs/ChatGPT_Image_25_juin_2026,_09_54_31.png', alt: 'Stores intérieurs' },
  { cle: 'vitrage.double', nom: 'Vitrage : double vitrage', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_12_03_32.png', alt: 'Double vitrage (standard)' },
  { cle: 'vitrage.triple', nom: 'Vitrage : triple vitrage', groupe: 'Menuiseries intérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_10_57_39.png', alt: 'Triple vitrage' },

  // Menuiseries extérieures
  { cle: 'exterieur.portails', nom: 'Portails & Clôtures', groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/files_4349414-2026-06-22T07-22-25-429Z-ChatGPT_Image_22_juin_2026,_08_58_54.webp', alt: 'Portails & Clôtures' },
  { cle: 'exterieur.portes-entree', nom: "Portes d'entrée", groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_22_juin_2026,_10_43_01.png', alt: "Portes d'entrée" },
  { cle: 'exterieur.volets', nom: 'Volets roulants & Battants', groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_25_juin_2026,_10_57_58.png', alt: 'Volets roulants & Battants' },
  { cle: 'exterieur.pergolas', nom: 'Pergolas & Carports', groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_25_juin_2026,_10_54_06.png', alt: 'Pergolas & Carports' },
  { cle: 'exterieur.garage', nom: 'Portes de garage', groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/532a0c32-9d95-4051-a76d-26e50906917c.png', alt: 'Portes de garage' },
  { cle: 'exterieur.garde-corps', nom: 'Garde-corps & Marquises', groupe: 'Menuiseries extérieures', format: 'Paysage',
    defaut: '/ChatGPT_Image_25_juin_2026,_10_30_46.png', alt: 'Garde-corps & Marquises' },

  // À propos
  { cle: 'apropos.photo', nom: 'Photo « Qui sommes-nous »', groupe: 'À propos', format: 'Paysage 4:3',
    defaut: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    alt: 'Équipe ADTF en train de poser des menuiseries' },
];

/** Galerie affichée tant qu'aucune photo n'a été ajoutée depuis l'admin. */
export const GALERIE_ORIGINE = [
  { id: 's1', src: '/ChatGPT_Image_22_juin_2026,_08_55_06.png', alt: 'Baie vitrée aluminium', label: 'Baie vitrée aluminium', sort_order: 0 },
  { id: 's2', src: '/ChatGPT_Image_22_juin_2026,_10_46_50.png', alt: 'Fenêtre PVC', label: 'Fenêtre PVC', sort_order: 1 },
  { id: 's3', src: '/ChatGPT_Image_22_juin_2026,_10_43_01.png', alt: "Porte d'entrée", label: "Porte d'entrée", sort_order: 2 },
  { id: 's4', src: '/files_4349414-2026-06-22T07-22-25-429Z-ChatGPT_Image_22_juin_2026,_08_58_54.webp', alt: 'Portail aluminium', label: 'Portail aluminium', sort_order: 3 },
  { id: 's5', src: '/ChatGPT_Image_25_juin_2026,_10_54_06.png', alt: 'Pergola bioclimatique', label: 'Pergola bioclimatique', sort_order: 4 },
  { id: 's6', src: '/ChatGPT_Image_25_juin_2026,_10_57_58.png', alt: 'Volets roulants', label: 'Volets roulants', sort_order: 5 },
  { id: 's7', src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', alt: 'Verrière intérieure', label: 'Verrière', sort_order: 6 },
  { id: 's8', src: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', alt: 'Porte de garage sectionnelle', label: 'Porte de garage', sort_order: 7 },
];

export const GROUPES = [...new Set(EMPLACEMENTS.map((e) => e.groupe))];

export type Remplacement = { src: string; alt: string };
type Remplacements = Record<string, Remplacement>;

const CACHE = 'adtf-photos-v1';

function lireCache(): Remplacements {
  try {
    return JSON.parse(localStorage.getItem(CACHE) || '{}') as Remplacements;
  } catch {
    return {};
  }
}

function ecrireCache(r: Remplacements) {
  try {
    localStorage.setItem(CACHE, JSON.stringify(r));
  } catch {
    /* stockage indisponible (navigation privée) : sans conséquence */
  }
}

const PhotosContext = createContext<Remplacements>({});

/** Charge les photos remplacées. Le dernier état connu est mémorisé pour éviter un clignotement. */
export function PhotosProvider({ children }: { children: ReactNode }) {
  const [remplacements, setRemplacements] = useState<Remplacements>(lireCache);

  useEffect(() => {
    import('./supabase')
      .then(({ supabase }) =>
        supabase.from('gallery_images').select('label, src, alt').eq('section', SECTION_EMPLACEMENT),
      )
      .then(({ data, error }) => {
        if (error || !data) return;
        const r: Remplacements = {};
        for (const ligne of data) r[ligne.label] = { src: ligne.src, alt: ligne.alt };
        setRemplacements(r);
        ecrireCache(r);
      })
      .catch(() => {/* hors ligne : photos d'origine */});
  }, []);

  return <PhotosContext.Provider value={remplacements}>{children}</PhotosContext.Provider>;
}

const parCle = new Map(EMPLACEMENTS.map((e) => [e.cle, e]));

/** Photo à afficher pour un emplacement : la photo remplacée si elle existe, sinon l'originale. */
export function usePhoto(cle: string): Remplacement {
  const remplacements = useContext(PhotosContext);
  const e = parCle.get(cle);
  const r = remplacements[cle];
  return {
    src: r?.src || e?.defaut || '',
    alt: r?.alt || e?.alt || '',
  };
}
