import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Actualite } from '../lib/supabase';
import { envoyerImage } from '../lib/images';
import { ArrowLeft, Upload, Eye, EyeOff, AlertCircle, Save, Image as ImageIcon } from 'lucide-react';

type Props = {
  editingId: string | null;
  onBack: () => void;
  onSaved: () => void;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function NewsEditor({ editingId, onBack, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return;
    supabase.from('actualites').select('*').eq('id', editingId).maybeSingle().then(({ data }) => {
      if (!data) return;
      const a = data as Actualite;
      setTitle(a.title);
      setSlug(a.slug);
      setExcerpt(a.excerpt);
      setContent(a.content);
      setImageUrl(a.image_url ?? '');
      setPublished(a.published);
      setSlugManuallyEdited(true);
    });
  }, [editingId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) setSlug(slugify(val));
  };

  const uploadCover = async (file: File) => {
    setUploadingImg(true);
    setError(null);
    try {
      setImageUrl(await envoyerImage(file, 'actualites'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur upload image');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { setError('Le titre est requis.'); return; }
    if (!slug.trim()) { setError('Le slug est requis.'); return; }
    setSaving(true);
    setError(null);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    try {
      if (editingId) {
        const { error: err } = await supabase.from('actualites').update(payload).eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('actualites').insert(payload);
        if (err) throw err;
      }
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-blue transition-colors">
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-brand-blue-dark font-display">
              {editingId ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {editingId ? 'Modifiez et sauvegardez.' : 'Rédigez puis publiez.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPublished(!published)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              published
                ? 'border-brand-green bg-brand-green-bg text-green-700'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {published ? <Eye size={15} /> : <EyeOff size={15} />}
            {published ? 'Publié' : 'Brouillon'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm py-2.5 px-5 rounded-xl disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <label className="form-label">Titre de l'article <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="form-input text-lg font-semibold"
            placeholder="Nouveauté : double vitrage performant…"
          />

          <div className="mt-4">
            <label className="form-label">Slug (URL)</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm shrink-0">/actualites/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true); }}
                className="form-input flex-1 font-mono text-sm"
                placeholder="double-vitrage-performant"
              />
            </div>
          </div>
        </div>

        {/* Image cover */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <label className="form-label">Image de couverture</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="form-input"
                placeholder="https://images.pexels.com/…  ou uploadez ci-contre"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-blue text-slate-500 hover:text-brand-blue text-sm font-semibold transition-all disabled:opacity-60"
              >
                <Upload size={15} /> {uploadingImg ? 'Upload…' : 'Uploader une image'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) uploadCover(e.target.files[0]); }} />
            </div>
            {imageUrl ? (
              <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <ImageIcon size={22} className="text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <label className="form-label">Résumé (extrait affiché en aperçu)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="form-input resize-none"
            placeholder="Une courte description de l'article (2–3 phrases)."
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <label className="form-label">Contenu de l'article</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="form-input resize-y font-mono text-sm leading-relaxed"
            placeholder={"Rédigez votre article ici.\n\nVous pouvez utiliser plusieurs paragraphes séparés par une ligne vide."}
          />
          <p className="text-slate-400 text-xs mt-2">Séparez les paragraphes avec une ligne vide.</p>
        </div>
      </div>
    </div>
  );
}
