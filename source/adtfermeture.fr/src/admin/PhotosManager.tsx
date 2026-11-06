import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { EMPLACEMENTS, GROUPES, SECTION_EMPLACEMENT, type Emplacement } from '../lib/photos';
import { envoyerImage, supprimerImageStockee } from '../lib/images';
import { AlertCircle, Check, RotateCcw, Upload, Pencil, X, ExternalLink } from 'lucide-react';

type Ligne = { id: string; label: string; src: string; alt: string };

export default function PhotosManager() {
  const [lignes, setLignes] = useState<Record<string, Ligne>>({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const charger = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, label, src, alt')
      .eq('section', SECTION_EMPLACEMENT);
    if (error) setErreur(error.message);
    else {
      const r: Record<string, Ligne> = {};
      for (const l of data ?? []) r[l.label] = l;
      setLignes(r);
    }
    setChargement(false);
  };

  useEffect(() => { charger(); }, []);

  const signaler = (texte: string) => {
    setMessage(texte);
    window.setTimeout(() => setMessage(null), 4000);
  };

  const nbRemplacees = EMPLACEMENTS.filter((e) => lignes[e.cle]).length;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark font-display">Photos du site</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Remplacez n'importe quelle photo du site. Les photos sont réduites automatiquement avant l'envoi.
          {' '}{nbRemplacees} / {EMPLACEMENTS.length} personnalisée{nbRemplacees > 1 ? 's' : ''}.
        </p>
      </div>

      {erreur && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" /> {erreur}
          <button onClick={() => setErreur(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}
      {message && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 bg-brand-blue-dark text-white rounded-xl px-4 py-3 text-sm shadow-xl">
          <Check size={16} className="text-brand-green shrink-0" /> {message}
        </div>
      )}

      {chargement ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        GROUPES.map((groupe) => (
          <section key={groupe} className="mb-10">
            <h2 className="font-bold text-brand-blue-dark text-lg mb-4">{groupe}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {EMPLACEMENTS.filter((e) => e.groupe === groupe).map((e) => (
                <CartePhoto
                  key={e.cle}
                  emplacement={e}
                  ligne={lignes[e.cle]}
                  onChange={async (texte) => { await charger(); signaler(texte); }}
                  onErreur={setErreur}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function CartePhoto({
  emplacement: e,
  ligne,
  onChange,
  onErreur,
}: {
  emplacement: Emplacement;
  ligne?: Ligne;
  onChange: (message: string) => Promise<void>;
  onErreur: (message: string) => void;
}) {
  const [envoi, setEnvoi] = useState(false);
  const [edition, setEdition] = useState(false);
  const [alt, setAlt] = useState('');
  const fichier = useRef<HTMLInputElement>(null);
  const src = ligne?.src || e.defaut;

  const remplacer = async (f: File) => {
    setEnvoi(true);
    try {
      const url = await envoyerImage(f, 'emplacements');
      if (ligne) {
        const { error } = await supabase.from('gallery_images').update({ src: url }).eq('id', ligne.id);
        if (error) throw error;
        await supprimerImageStockee(ligne.src);
      } else {
        const { error } = await supabase.from('gallery_images').insert({
          section: SECTION_EMPLACEMENT, label: e.cle, src: url, alt: e.alt, sort_order: 0,
        });
        if (error) throw error;
      }
      await onChange(`« ${e.nom} » remplacée. Visible sur le site au prochain chargement.`);
    } catch (err) {
      onErreur(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setEnvoi(false);
      if (fichier.current) fichier.current.value = '';
    }
  };

  const restaurer = async () => {
    if (!ligne || !confirm(`Remettre la photo d'origine pour « ${e.nom} » ?`)) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', ligne.id);
    if (error) { onErreur(error.message); return; }
    await supprimerImageStockee(ligne.src);
    await onChange(`« ${e.nom} » : photo d'origine restaurée.`);
  };

  const enregistrerAlt = async () => {
    if (ligne) {
      const { error } = await supabase.from('gallery_images').update({ alt }).eq('id', ligne.id);
      if (error) { onErreur(error.message); return; }
    } else {
      // Description modifiée sans changer la photo : on enregistre la photo d'origine avec la nouvelle description.
      const { error } = await supabase.from('gallery_images').insert({
        section: SECTION_EMPLACEMENT, label: e.cle, src: e.defaut, alt, sort_order: 0,
      });
      if (error) { onErreur(error.message); return; }
    }
    setEdition(false);
    await onChange(`Description de « ${e.nom} » enregistrée.`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
      <div className={`relative aspect-[4/3] ${e.cle === 'logo' ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <img src={src} alt={ligne?.alt || e.alt} className={`w-full h-full ${e.cle === 'logo' ? 'object-contain p-6' : 'object-cover'}`} loading="lazy" />
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-lg ${ligne ? 'bg-brand-green text-white' : 'bg-white/90 text-slate-600'}`}>
          {ligne ? 'Personnalisée' : "Photo d'origine"}
        </span>
        {envoi && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="font-semibold text-brand-blue-dark">{e.nom}</div>
        <div className="text-slate-400 text-xs mt-0.5">{e.format}</div>

        {edition ? (
          <div className="mt-3 space-y-2">
            <label className="form-label text-xs">Description de la photo (référencement Google et accessibilité)</label>
            <input value={alt} onChange={(ev) => setAlt(ev.target.value)} className="form-input text-sm py-2" />
            <div className="flex gap-2">
              <button onClick={enregistrerAlt} className="flex-1 flex items-center justify-center gap-1 py-2 bg-brand-green text-white rounded-lg text-xs font-semibold">
                <Check size={12} /> Enregistrer
              </button>
              <button onClick={() => setEdition(false)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                <X size={12} /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-xs mt-2 line-clamp-2">{ligne?.alt || e.alt}</p>
        )}

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => fichier.current?.click()}
            disabled={envoi}
            className="btn-primary text-xs py-2 px-3 rounded-lg disabled:opacity-60"
          >
            <Upload size={14} /> {envoi ? 'Envoi…' : 'Remplacer'}
          </button>
          {!edition && (
            <button
              onClick={() => { setAlt(ligne?.alt || e.alt); setEdition(true); }}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue"
            >
              <Pencil size={13} /> Description
            </button>
          )}
          {ligne && (
            <button
              onClick={restaurer}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600"
            >
              <RotateCcw size={13} /> Photo d'origine
            </button>
          )}
          <a href={src} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-2 py-2 rounded-lg text-slate-400 hover:text-brand-blue" title="Voir en grand">
            <ExternalLink size={13} />
          </a>
        </div>
        <input
          ref={fichier}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(ev) => { const f = ev.target.files?.[0]; if (f) remplacer(f); }}
        />
      </div>
    </div>
  );
}
