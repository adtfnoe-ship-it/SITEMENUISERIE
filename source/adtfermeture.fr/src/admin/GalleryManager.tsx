import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryImage } from '../lib/supabase';
import { GALERIE_ORIGINE } from '../lib/photos';
import { envoyerImage, supprimerImageStockee, libelleDepuisNomFichier } from '../lib/images';
import {
  Upload, Trash2, Plus, AlertCircle, Image as ImageIcon,
  GripVertical, ChevronUp, ChevronDown, Edit2, Check, X,
} from 'lucide-react';

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlLabel, setUrlLabel] = useState('');
  const [urlAlt, setUrlAlt] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('section', 'gallery')
      .order('sort_order')
      .order('created_at');
    if (err) { setError(err.message); } else { setImages(data ?? []); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadFiles = async (files: File[]) => {
    setError(null);
    let ordre = images.length;
    try {
      for (const [i, file] of files.entries()) {
        setUploading(files.length > 1 ? `Envoi ${i + 1}/${files.length}…` : 'Envoi…');
        const publicUrl = await envoyerImage(file, 'gallery');
        const label = libelleDepuisNomFichier(file.name);
        const { error: insertErr } = await supabase.from('gallery_images').insert({
          src: publicUrl,
          alt: label,
          label,
          section: 'gallery',
          sort_order: ordre++,
        });
        if (insertErr) throw insertErr;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(null);
      if (fileRef.current) fileRef.current.value = '';
      await load();
    }
  };

  // La galerie publique affiche des photos intégrées au site tant que la base est vide :
  // on les importe pour pouvoir les réorganiser, les renommer ou les supprimer.
  const importerOrigine = async () => {
    setError(null);
    const { error: err } = await supabase.from('gallery_images').insert(
      GALERIE_ORIGINE.map(({ src, alt, label, sort_order }) => ({ src, alt, label, sort_order, section: 'gallery' })),
    );
    if (err) setError(err.message);
    await load();
  };

  const addByUrl = async () => {
    if (!urlInput.trim()) return;
    setError(null);
    const label = urlLabel.trim() || 'Image';
    const { error: err } = await supabase.from('gallery_images').insert({
      src: urlInput.trim(),
      alt: urlAlt.trim() || label,
      label,
      section: 'gallery',
      sort_order: images.length,
    });
    if (err) { setError(err.message); return; }
    setUrlInput(''); setUrlLabel(''); setUrlAlt(''); setShowUrlForm(false);
    await load();
  };

  const deleteImage = async (img: GalleryImage) => {
    if (!confirm(`Supprimer "${img.label}" ?`)) return;
    const { error: err } = await supabase.from('gallery_images').delete().eq('id', img.id);
    if (err) { setError(err.message); return; }
    await supprimerImageStockee(img.src);
    await load();
  };

  const saveEdit = async (id: string) => {
    await supabase.from('gallery_images').update({ label: editLabel, alt: editAlt }).eq('id', id);
    setEditingId(null);
    await load();
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditLabel(img.label);
    setEditAlt(img.alt);
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const arr = [...images];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    const updates = arr.map((img, i) => supabase.from('gallery_images').update({ sort_order: i }).eq('id', img.id));
    await Promise.all(updates);
    await load();
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark font-display">Galerie photos</h1>
          <p className="text-slate-500 mt-1">{images.length} photo{images.length !== 1 ? 's' : ''} en galerie</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand-blue text-brand-blue font-semibold text-sm hover:bg-brand-blue-bg transition-colors"
          >
            <Plus size={16} /> Ajouter par URL
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={!!uploading}
            className="btn-primary text-sm py-2.5 px-5 rounded-xl disabled:opacity-60"
          >
            <Upload size={16} />
            {uploading ?? 'Ajouter des photos'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) uploadFiles(f); }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {showUrlForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-brand-blue-dark mb-4">Ajouter une image par URL</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="form-label">URL de l'image</label>
              <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                className="form-input" placeholder="https://images.pexels.com/..." />
            </div>
            <div>
              <label className="form-label">Label affiché</label>
              <input type="text" value={urlLabel} onChange={e => setUrlLabel(e.target.value)}
                className="form-input" placeholder="Fenêtre PVC" />
            </div>
            <div>
              <label className="form-label">Texte alternatif (accessibilité)</label>
              <input type="text" value={urlAlt} onChange={e => setUrlAlt(e.target.value)}
                className="form-input" placeholder="Fenêtre PVC blanche" />
            </div>
            <div className="flex items-end gap-3">
              <button onClick={addByUrl} className="btn-primary py-3 px-6 rounded-xl text-sm">Ajouter</button>
              <button onClick={() => setShowUrlForm(false)} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">La galerie du site affiche ses {GALERIE_ORIGINE.length} photos d'origine</p>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            Importez-les pour pouvoir les réorganiser, les renommer ou en retirer.
            Dès qu'une photo est ajoutée ici, la galerie du site affiche uniquement les photos de cette page.
          </p>
          <button onClick={importerOrigine} className="btn-primary text-sm py-2.5 px-5 rounded-xl mt-5">
            Importer les {GALERIE_ORIGINE.length} photos actuelles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={img.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
              <div className="relative aspect-square">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 flex flex-col gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0}
                    className="w-7 h-7 bg-white/90 rounded-lg shadow flex items-center justify-center disabled:opacity-30 hover:bg-brand-blue hover:text-white transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === images.length - 1}
                    className="w-7 h-7 bg-white/90 rounded-lg shadow flex items-center justify-center disabled:opacity-30 hover:bg-brand-blue hover:text-white transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(img)}
                    className="w-7 h-7 bg-white/90 rounded-lg shadow flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => deleteImage(img)}
                    className="w-7 h-7 bg-white/90 rounded-lg shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={12} className="text-white/70 shrink-0" />
                  <span className="text-white text-xs font-semibold truncate bg-black/40 rounded px-1.5 py-0.5">{img.label}</span>
                </div>
              </div>

              {editingId === img.id ? (
                <div className="p-3 space-y-2">
                  <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                    className="form-input text-xs py-2" placeholder="Label" />
                  <input value={editAlt} onChange={e => setEditAlt(e.target.value)}
                    className="form-input text-xs py-2" placeholder="Texte alt" />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(img.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-brand-green text-white rounded-lg text-xs font-semibold">
                      <Check size={12} /> Sauver
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                      <X size={12} /> Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2.5">
                  <p className="text-brand-blue-dark font-semibold text-sm truncate">{img.label || '—'}</p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{img.alt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
