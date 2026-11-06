import { useEffect, useState } from 'react';
import { GALERIE_ORIGINE } from '../lib/photos';

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  label: string;
  section: string;
  sort_order: number;
  created_at: string;
};


export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>(
    GALERIE_ORIGINE.map((img) => ({ ...img, section: 'gallery', created_at: '' })),
  );

  useEffect(() => {
    import('../lib/supabase')
      .then(({ supabase }) =>
        supabase
          .from('gallery_images')
          .select('*')
          .eq('section', 'gallery')
          .order('sort_order')
          .order('created_at'),
      )
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setImages(data as GalleryImage[]);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return (
    <section id="realisations" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="eyebrow-bar" />
            <span className="eyebrow">Galerie photos</span>
            <div className="eyebrow-bar" />
          </div>
          <h2 className="section-title mb-4">Découvrez certains de nos projets et réalisations</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Chaque projet est unique. Voici quelques réalisations représentatives de notre savoir-faire
            en menuiseries sur mesure dans les Vosges, l'Alsace et la Moselle.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover brightness-105 group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl border-4 border-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/75 via-brand-blue-dark/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-bold text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
