import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Newspaper, ChevronDown } from 'lucide-react';

type Actualite = {
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

export default function Actualites() {
  const [articles, setArticles] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    import('../lib/supabase')
      .then(({ supabase }) =>
        supabase
          .from('actualites')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(6),
      )
      .then(({ data }) => { setArticles((data ?? []) as Actualite[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  const fmt = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const [featured, ...rest] = articles;

  return (
    <section id="actualites" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="eyebrow-bar" />
              <span className="eyebrow">Actualités</span>
            </div>
            <h2 className="section-title">Les dernières nouvelles d'ADTF</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Conseils, nouveautés et promotions de votre spécialiste en menuiseries.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Featured article */}
            {featured && (
              <article
                className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setExpanded(expanded === featured.id ? null : featured.id)}
              >
                {featured.image_url ? (
                  <div className="h-64 sm:h-72 overflow-hidden">
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-brand-blue-dark to-brand-blue flex items-center justify-center">
                    <Newspaper size={48} className="text-white/20" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-widest mb-3">
                    <span className="w-4 h-px bg-brand-green" />
                    À la une
                    {featured.published_at && (
                      <span className="ml-auto flex items-center gap-1.5 text-slate-400 normal-case font-semibold tracking-normal">
                        <Calendar size={11} />
                        {fmt(featured.published_at)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-brand-blue-dark text-xl leading-snug mb-3 group-hover:text-brand-blue transition-colors">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                  )}
                  {expanded === featured.id && featured.content && (
                    <div className="mt-2 pt-4 border-t border-slate-100 space-y-3">
                      {featured.content.split(/\n\n+/).map((para, i) => (
                        <p key={i} className="text-slate-600 text-sm leading-relaxed">{para}</p>
                      ))}
                    </div>
                  )}
                  <button className="mt-4 flex items-center gap-2 text-brand-blue text-sm font-bold hover:gap-3 transition-all">
                    {expanded === featured.id ? 'Réduire' : "Lire l'article"}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${expanded === featured.id ? '-rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </article>
            )}

            {/* Secondary articles */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-6">
                {rest.slice(0, 2).map((a) => (
                  <article
                    key={a.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col flex-1"
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  >
                    {a.image_url && (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={a.image_url}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {a.published_at && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
                          <Calendar size={11} className="text-brand-green" />
                          {fmt(a.published_at)}
                        </div>
                      )}
                      <h3 className="font-bold text-brand-blue-dark text-base leading-snug mb-2 group-hover:text-brand-blue transition-colors flex-1">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{a.excerpt}</p>
                      )}
                      {expanded === a.id && a.content && (
                        <div className="mt-2 pt-3 border-t border-slate-100 space-y-2.5">
                          {a.content.split(/\n\n+/).map((para, i) => (
                            <p key={i} className="text-slate-600 text-xs leading-relaxed">{para}</p>
                          ))}
                        </div>
                      )}
                      <button className="flex items-center gap-1.5 text-brand-blue text-xs font-bold hover:gap-2.5 transition-all">
                        {expanded === a.id ? 'Réduire' : 'Lire la suite'}
                        <ArrowRight size={12} className={expanded === a.id ? 'rotate-90' : ''} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
