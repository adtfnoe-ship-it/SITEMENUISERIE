import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Login from './Login';
import Dashboard from './Dashboard';
import PhotosManager from './PhotosManager';
import GalleryManager from './GalleryManager';
import NewsManager from './NewsManager';
import NewsEditor from './NewsEditor';
import { usePhoto } from '../lib/photos';
import { LayoutDashboard, ImagePlus, Images, Newspaper, LogOut, ExternalLink, ChevronRight, Menu, X } from 'lucide-react';

export type AdminPage = 'dashboard' | 'photos' | 'gallery' | 'news' | 'news-editor';

const navItems = [
  { id: 'dashboard' as AdminPage, label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'photos'    as AdminPage, label: 'Photos du site',  icon: ImagePlus },
  { id: 'gallery'   as AdminPage, label: 'Galerie photos',  icon: Images },
  { id: 'news'      as AdminPage, label: 'Actualités',      icon: Newspaper },
];

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const logo = usePhoto('logo');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Login />;

  const navigateTo = (p: AdminPage, newsId: string | null = null) => {
    setPage(p);
    setEditingNewsId(newsId);
    setMenuOuvert(false);
    window.scrollTo(0, 0);
  };

  const estActif = (id: AdminPage) => page === id || (page === 'news-editor' && id === 'news');

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* Barre du haut (téléphone et tablette) */}
      <header className="lg:hidden sticky top-0 z-30 bg-brand-blue-dark flex items-center justify-between px-4 h-14">
        <img src={logo.src} alt={logo.alt} className="h-9 w-auto object-contain" />
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="text-white p-2 -mr-2"
          aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOuvert ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOuvert && (
        <div className="lg:hidden fixed inset-0 top-14 z-20 bg-black/40" onClick={() => setMenuOuvert(false)} />
      )}

      {/* Menu latéral (fixe sur ordinateur, tiroir sur téléphone) */}
      <aside
        className={`w-64 bg-brand-blue-dark flex flex-col shrink-0 fixed left-0 z-20 top-14 bottom-0 lg:top-0 lg:h-full transition-transform duration-200 ${
          menuOuvert ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="hidden lg:block px-5 py-5 border-b border-white/10">
          <img src={logo.src} alt={logo.alt} className="h-16 w-auto object-contain" />
          <p className="text-white/50 text-xs mt-2 font-semibold uppercase tracking-widest">Administration</p>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-3 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                estActif(id)
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={17} />
              {label}
              {estActif(id) && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ExternalLink size={17} />
            Voir le site
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 flex-1 min-h-screen min-w-0">
        {page === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
        {page === 'photos'    && <PhotosManager />}
        {page === 'gallery'   && <GalleryManager />}
        {page === 'news'      && <NewsManager onEdit={(id) => navigateTo('news-editor', id)} onCreate={() => navigateTo('news-editor', null)} />}
        {page === 'news-editor' && (
          <NewsEditor
            editingId={editingNewsId}
            onBack={() => navigateTo('news')}
            onSaved={() => navigateTo('news')}
          />
        )}
      </main>
    </div>
  );
}
