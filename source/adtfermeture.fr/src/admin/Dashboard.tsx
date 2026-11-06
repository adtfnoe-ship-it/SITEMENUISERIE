import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Images, Newspaper, TrendingUp, Eye, ArrowRight, ImagePlus } from 'lucide-react';
import type { AdminPage } from './AdminApp';
import { EMPLACEMENTS, SECTION_EMPLACEMENT } from '../lib/photos';

type Props = { onNavigate: (page: AdminPage) => void };

export default function Dashboard({ onNavigate }: Props) {
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [photosCount, setPhotosCount] = useState<number | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('gallery_images').select('id', { count: 'exact', head: true }).eq('section', 'gallery')
      .then(({ count }) => setGalleryCount(count ?? 0));
    supabase.from('gallery_images').select('id', { count: 'exact', head: true }).eq('section', SECTION_EMPLACEMENT)
      .then(({ count }) => setPhotosCount(count ?? 0));
    supabase.from('actualites').select('id', { count: 'exact', head: true })
      .then(({ count }) => setNewsCount(count ?? 0));
    supabase.from('actualites').select('id', { count: 'exact', head: true }).eq('published', true)
      .then(({ count }) => setPublishedCount(count ?? 0));
  }, []);

  const stats = [
    {
      label: `Photos du site personnalisées (sur ${EMPLACEMENTS.length})`,
      value: photosCount,
      icon: ImagePlus,
      color: 'bg-slate-100 text-brand-blue-dark',
      action: () => onNavigate('photos'),
    },
    {
      label: 'Photos en galerie',
      value: galleryCount,
      icon: Images,
      color: 'bg-brand-blue-bg text-brand-blue',
      action: () => onNavigate('gallery'),
    },
    {
      label: 'Articles rédigés',
      value: newsCount,
      icon: Newspaper,
      color: 'bg-brand-green-bg text-brand-blue-dark',
      action: () => onNavigate('news'),
    },
    {
      label: 'Articles publiés',
      value: publishedCount,
      icon: Eye,
      color: 'bg-amber-50 text-amber-700',
      action: () => onNavigate('news'),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark font-display">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de votre site ADTF.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, action }) => (
          <button
            key={label}
            onClick={action}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-100 text-left transition-all duration-200 group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="text-3xl font-bold text-brand-blue-dark mb-1">
              {value === null ? '—' : value}
            </div>
            <div className="text-slate-500 text-sm font-medium flex items-center justify-between">
              {label}
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-bold text-brand-blue-dark mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-green" />
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('photos')}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-blue hover:bg-brand-blue-bg transition-all group"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
              <ImagePlus size={18} className="text-brand-blue-dark" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-brand-blue-dark text-sm">Changer les photos du site</div>
              <div className="text-slate-400 text-xs">Logo, accueil, produits, à propos…</div>
            </div>
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-blue hover:bg-brand-blue-bg transition-all group"
          >
            <div className="w-10 h-10 bg-brand-blue-bg rounded-xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
              <Images size={18} className="text-brand-blue" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-brand-blue-dark text-sm">Gérer la galerie</div>
              <div className="text-slate-400 text-xs">Ajouter, modifier ou supprimer des photos</div>
            </div>
          </button>
          <button
            onClick={() => onNavigate('news')}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-green hover:bg-brand-green-bg transition-all group"
          >
            <div className="w-10 h-10 bg-brand-green-bg rounded-xl flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
              <Newspaper size={18} className="text-brand-blue-dark" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-brand-blue-dark text-sm">Gérer les actualités</div>
              <div className="text-slate-400 text-xs">Publier ou modifier des articles</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
