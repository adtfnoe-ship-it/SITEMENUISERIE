import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Actualite } from '../lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, Newspaper, Calendar } from 'lucide-react';

type Props = {
  onEdit: (id: string) => void;
  onCreate: () => void;
};

export default function NewsManager({ onEdit, onCreate }: Props) {
  const [articles, setArticles] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('actualites')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) { setError(err.message); } else { setArticles(data ?? []); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (article: Actualite) => {
    const published = !article.published;
    await supabase.from('actualites').update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', article.id);
    await load();
  };

  const deleteArticle = async (article: Actualite) => {
    if (!confirm(`Supprimer "${article.title}" ?`)) return;
    await supabase.from('actualites').delete().eq('id', article.id);
    await load();
  };

  const fmt = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark font-display">Actualités</h1>
          <p className="text-slate-500 mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={onCreate} className="btn-primary text-sm py-2.5 px-5 rounded-xl">
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Newspaper size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Aucun article pour l'instant</p>
          <p className="text-slate-400 text-sm mt-1">Créez votre premier article d'actualité.</p>
          <button onClick={onCreate} className="btn-primary mt-6 text-sm py-2.5 px-5 rounded-xl">
            <Plus size={16} /> Créer un article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              {/* Cover thumbnail */}
              {a.image_url ? (
                <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="w-20 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Newspaper size={20} className="text-slate-400" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <h3 className="font-bold text-brand-blue-dark text-base leading-snug">{a.title}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                    a.published
                      ? 'bg-brand-green-bg text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {a.published ? <Eye size={11} /> : <EyeOff size={11} />}
                    {a.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                {a.excerpt && <p className="text-slate-500 text-sm mt-1 line-clamp-2">{a.excerpt}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={11} /> Créé le {fmt(a.created_at)}</span>
                  {a.published_at && <span>Publié le {fmt(a.published_at)}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(a)}
                  title={a.published ? 'Dépublier' : 'Publier'}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    a.published
                      ? 'bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-400'
                      : 'bg-brand-green-bg hover:bg-brand-green hover:text-white text-brand-blue-dark'
                  }`}
                >
                  {a.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => onEdit(a.id)}
                  className="w-9 h-9 bg-brand-blue-bg hover:bg-brand-blue hover:text-white text-brand-blue rounded-xl flex items-center justify-center transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => deleteArticle(a)}
                  className="w-9 h-9 bg-slate-50 hover:bg-red-500 hover:text-white text-slate-400 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
