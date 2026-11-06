import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, User, Briefcase, MessageSquare } from 'lucide-react';

type Step = 1 | 2 | 3;

interface FormData {
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  codePostal: string;
  ville: string;
  typeProjet: string;
  typeMenuiserie: string[];
  matiere: string;
  budget: string;
  delai: string;
  message: string;
  newsletter: boolean;
  rgpd: boolean;
}

type Errors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  civilite: '', prenom: '', nom: '', email: '', telephone: '',
  codePostal: '', ville: '', typeProjet: '', typeMenuiserie: [],
  matiere: '', budget: '', delai: '', message: '', newsletter: false, rgpd: false,
};

const MENUISERIE_OPTIONS = [
  'Fenêtres', 'Portes-fenêtres', 'Baies vitrées', 'Fenêtres de toit',
  'Verrières', "Porte d'entrée", 'Portail / Clôture', 'Volets',
  'Pergola / Carport', 'Porte de garage', 'Portes intérieures', 'Stores',
];

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-semibold" role="alert">
      <AlertCircle size={11} aria-hidden="true" />
      {message}
    </p>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { n: 1 as Step, Icon: User, label: 'Vos coordonnées' },
    { n: 2 as Step, Icon: Briefcase, label: 'Votre projet' },
    { n: 3 as Step, Icon: MessageSquare, label: 'Votre message' },
  ];
  return (
    <div className="flex items-start justify-between mb-8 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 mx-10" aria-hidden="true" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-brand-green transition-all duration-500 mx-10"
        style={{ width: `${((step - 1) / 2) * 100}%` }}
        aria-hidden="true"
      />
      {steps.map(({ n, Icon, label }) => {
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} className="flex flex-col items-center gap-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
              done ? 'bg-brand-green border-brand-green text-white' :
              active ? 'bg-white border-brand-blue text-brand-blue' :
              'bg-white border-slate-200 text-slate-400'
            }`}>
              {done ? <CheckCircle size={18} /> : <Icon size={16} />}
            </div>
            <span className={`text-xs font-bold hidden sm:block ${active ? 'text-brand-blue-dark' : done ? 'text-brand-green' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormData, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }

  function toggleMenuiserie(val: string) {
    const arr = form.typeMenuiserie;
    set('typeMenuiserie', arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  function validateStep1(): boolean {
    const e: Errors = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est obligatoire.';
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire.';
    if (!form.email.trim()) e.email = "L'adresse e-mail est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "L'adresse e-mail n'est pas valide.";
    if (!form.telephone.trim()) e.telephone = "Le numéro de téléphone est obligatoire.";
    else if (!/^(\+33|0)[1-9]\d{8}$/.test(form.telephone.replace(/[\s\-.]/g, '')))
      e.telephone = "Le numéro de téléphone n'est pas valide (ex : 06 12 34 56 78).";
    if (!form.codePostal.trim()) e.codePostal = 'Le code postal est obligatoire.';
    else if (!/^\d{5}$/.test(form.codePostal)) e.codePostal = 'Le code postal doit contenir 5 chiffres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Errors = {};
    if (!form.typeProjet) e.typeProjet = 'Veuillez sélectionner un type de projet.';
    if (form.typeMenuiserie.length === 0) e.typeMenuiserie = 'Veuillez sélectionner au moins un type de menuiserie.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3(): boolean {
    const e: Errors = {};
    if (!form.message.trim()) e.message = 'Veuillez décrire votre projet.';
    else if (form.message.trim().length < 20) e.message = 'Veuillez donner plus de détails (minimum 20 caractères).';
    if (!form.rgpd) e.rgpd = 'Vous devez accepter la politique de confidentialité pour continuer.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep3()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-brand-green-bg border-4 border-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand-green" />
          </div>
          <h2 className="font-display font-bold text-brand-blue-dark text-3xl mb-4">Merci pour votre demande !</h2>
          <p className="text-slate-600 text-lg mb-2">
            Votre message a bien été envoyé. L'équipe ADTF vous contactera dans les meilleurs délais.
          </p>
          <p className="text-slate-400 text-sm">Nous reviendrons vers vous dès que possible.</p>
          <button onClick={() => { setSubmitted(false); setForm(INITIAL); setStep(1); }} className="btn-primary mt-8">
            Faire une nouvelle demande
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="eyebrow-bar" />
            <span className="eyebrow">Contact & Devis</span>
            <div className="eyebrow-bar" />
          </div>
          <h2 className="section-title mb-4">Contactez-nous pour recevoir un devis de menuiseries</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Simulations et devis gratuits — remplissez ce formulaire et notre équipe vous recontactera
            rapidement pour étudier votre projet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            <div className="bg-brand-blue-dark rounded-2xl p-8 text-white">
              {/* Green top accent */}
              <div className="-mx-8 -mt-8 mb-6 h-1 bg-brand-green rounded-t-2xl" />
              <h3 className="font-display font-bold text-xl mb-6">Informations de contact</h3>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, title: 'Adresse', content: (<address className="text-white/60 text-sm not-italic">3 Impasse de Claingoutte<br />88650 Saint-Léonard</address>) },
                  { Icon: Phone, title: 'Téléphone', content: (<div><a href="tel:0355230161" className="text-brand-green hover:text-brand-green-light text-sm font-bold transition-colors block">03 55 23 01 61</a><a href="tel:0667434825" className="text-white/55 hover:text-white/80 text-sm transition-colors block mt-1">06 67 43 48 25</a></div>) },
                  { Icon: Mail, title: 'E-mail', content: (<a href="mailto:adtf68@hotmail.fr" className="text-brand-green hover:text-brand-green-light text-sm font-bold transition-colors break-all">adtf68@hotmail.fr</a>) },
                ].map(({ Icon, title, content }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="icon-chip shrink-0"><Icon size={18} className="text-white" /></div>
                    <div>
                      <div className="font-bold text-white/90 text-sm mb-1">{title}</div>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-6 pt-6">
                <div className="font-bold text-white/90 text-sm mb-3">Heures d'ouverture</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/50">Lun — Ven</span><span className="text-white font-semibold">9h–12h / 14h–18h</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Samedi</span><span className="text-white font-semibold">9h–12h</span></div>
                </div>
              </div>
            </div>

            {/* Trust badge — green left border per charter */}
            <div className="bg-brand-green-bg rounded-2xl border border-brand-green/30 p-6 border-l-4 border-l-brand-green">
              <div className="font-display font-bold text-brand-blue-dark text-base mb-1">Devis gratuit & sans engagement</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Votre étude personnalisée est entièrement gratuite. SAV gratuit sur tous nos produits
                et prestations pendant 10 ans*.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Green top line */}
              <div className="h-1 bg-brand-green" />
              <div className="p-6 sm:p-8">
                <StepIndicator step={step} />

                <form onSubmit={handleSubmit} noValidate aria-label="Formulaire de demande de devis">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <fieldset className="space-y-5">
                      <legend className="font-display font-bold text-brand-blue-dark text-xl mb-6">Vos coordonnées</legend>
                      <div>
                        <span className="form-label">Civilité</span>
                        <div className="flex gap-5 mt-1">
                          {['M.', 'Mme'].map((c) => (
                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="civilite" value={c} checked={form.civilite === c} onChange={(e) => set('civilite', e.target.value)} className="w-4 h-4 accent-brand-blue" />
                              <span className="text-sm text-brand-blue-dark font-semibold">{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="prenom" className="form-label">Prénom *</label>
                          <input id="prenom" type="text" placeholder="Votre prénom" value={form.prenom} onChange={(e) => set('prenom', e.target.value)} className={`form-input ${errors.prenom ? 'form-input-error' : ''}`} autoComplete="given-name" />
                          {errors.prenom && <FieldError message={errors.prenom} />}
                        </div>
                        <div>
                          <label htmlFor="nom" className="form-label">Nom *</label>
                          <input id="nom" type="text" placeholder="Votre nom" value={form.nom} onChange={(e) => set('nom', e.target.value)} className={`form-input ${errors.nom ? 'form-input-error' : ''}`} autoComplete="family-name" />
                          {errors.nom && <FieldError message={errors.nom} />}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="form-label">Adresse e-mail *</label>
                        <input id="email" type="email" placeholder="votre@email.fr" value={form.email} onChange={(e) => set('email', e.target.value)} className={`form-input ${errors.email ? 'form-input-error' : ''}`} autoComplete="email" />
                        {errors.email && <FieldError message={errors.email} />}
                      </div>
                      <div>
                        <label htmlFor="telephone" className="form-label">Téléphone *</label>
                        <input id="telephone" type="tel" placeholder="06 12 34 56 78" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} className={`form-input ${errors.telephone ? 'form-input-error' : ''}`} autoComplete="tel" />
                        {errors.telephone && <FieldError message={errors.telephone} />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="codePostal" className="form-label">Code postal *</label>
                          <input id="codePostal" type="text" placeholder="88000" maxLength={5} value={form.codePostal} onChange={(e) => set('codePostal', e.target.value)} className={`form-input ${errors.codePostal ? 'form-input-error' : ''}`} autoComplete="postal-code" />
                          {errors.codePostal && <FieldError message={errors.codePostal} />}
                        </div>
                        <div>
                          <label htmlFor="ville" className="form-label">Ville</label>
                          <input id="ville" type="text" placeholder="Saint-Dié-des-Vosges" value={form.ville} onChange={(e) => set('ville', e.target.value)} className="form-input" autoComplete="address-level2" />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <fieldset className="space-y-6">
                      <legend className="font-display font-bold text-brand-blue-dark text-xl mb-6">Votre projet</legend>
                      <div>
                        <span className="form-label">Type de projet *</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-1.5">
                          {['Rénovation', 'Construction neuve', 'Remplacement', 'Extension', 'Parrainage', 'Autre'].map((t) => (
                            <label key={t} className={`flex items-center justify-center px-3 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold text-center ${
                              form.typeProjet === t ? 'border-brand-green bg-brand-green-bg text-brand-blue-dark' : 'border-slate-200 text-slate-600 hover:border-brand-green/40'
                            }`}>
                              <input type="radio" name="typeProjet" value={t} checked={form.typeProjet === t} onChange={(e) => set('typeProjet', e.target.value)} className="sr-only" />
                              {t}
                            </label>
                          ))}
                        </div>
                        {errors.typeProjet && <FieldError message={errors.typeProjet} />}
                      </div>
                      <div>
                        <span className="form-label">Type(s) de menuiserie souhaité(s) *</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1.5">
                          {MENUISERIE_OPTIONS.map((m) => (
                            <label key={m} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                              form.typeMenuiserie.includes(m) ? 'border-brand-green bg-brand-green-bg text-brand-blue-dark font-bold' : 'border-slate-200 text-slate-600 hover:border-brand-green/40'
                            }`}>
                              <input type="checkbox" checked={form.typeMenuiserie.includes(m)} onChange={() => toggleMenuiserie(m)} className="w-4 h-4 accent-brand-green shrink-0" />
                              {m}
                            </label>
                          ))}
                        </div>
                        {errors.typeMenuiserie && <FieldError message={errors.typeMenuiserie} />}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="matiere" className="form-label">Matière souhaitée</label>
                          <select id="matiere" value={form.matiere} onChange={(e) => set('matiere', e.target.value)} className="form-input">
                            <option value="">Sélectionner…</option>
                            {['PVC', 'Aluminium', 'Bois', 'Bois/Aluminium', 'Indifférent'].map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="budget" className="form-label">Budget estimatif</label>
                          <select id="budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} className="form-input">
                            <option value="">Sélectionner…</option>
                            <option value="moins-1000">Moins de 1 000 €</option>
                            <option value="1000-5000">1 000 € – 5 000 €</option>
                            <option value="5000-10000">5 000 € – 10 000 €</option>
                            <option value="10000-20000">10 000 € – 20 000 €</option>
                            <option value="plus-20000">Plus de 20 000 €</option>
                            <option value="non-defini">Non défini</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="delai" className="form-label">Délai souhaité pour les travaux</label>
                        <select id="delai" value={form.delai} onChange={(e) => set('delai', e.target.value)} className="form-input">
                          <option value="">Sélectionner…</option>
                          <option value="urgent">Urgent (moins d'1 mois)</option>
                          <option value="1-3mois">1 à 3 mois</option>
                          <option value="3-6mois">3 à 6 mois</option>
                          <option value="6mois+">Plus de 6 mois</option>
                          <option value="non-defini">Non défini</option>
                        </select>
                      </div>
                    </fieldset>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <fieldset className="space-y-5">
                      <legend className="font-display font-bold text-brand-blue-dark text-xl mb-6">Votre message</legend>
                      <div>
                        <label htmlFor="message" className="form-label">Décrivez votre projet *</label>
                        <textarea
                          id="message"
                          rows={6}
                          placeholder="Décrivez votre projet en détail : type de travaux, superficie, contraintes particulières, questions…"
                          value={form.message}
                          onChange={(e) => set('message', e.target.value)}
                          className={`form-input resize-none ${errors.message ? 'form-input-error' : ''}`}
                        />
                        <div className="flex justify-between mt-1">
                          {errors.message ? <FieldError message={errors.message} /> : <span />}
                          <span className="text-xs text-slate-400">{form.message.length} car.</span>
                        </div>
                      </div>
                      <div className="space-y-4 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={form.newsletter} onChange={(e) => set('newsletter', e.target.checked)} className="w-4 h-4 mt-0.5 accent-brand-green shrink-0" />
                          <span className="text-sm text-slate-600 leading-relaxed">
                            J'accepte de recevoir les actualités et offres commerciales d'ADTF par e-mail.
                          </span>
                        </label>
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.rgpd} onChange={(e) => set('rgpd', e.target.checked)} className="w-4 h-4 mt-0.5 accent-brand-green shrink-0" aria-required="true" />
                            <span className="text-sm text-slate-600 leading-relaxed">
                              * J'accepte que mes données personnelles soient utilisées par ADTF pour traiter
                              ma demande. Les données sont destinées à ADTF et ses sous-traitants. Je dispose de
                              droits d'accès, rectification, effacement et opposition que je peux exercer à{' '}
                              <a href="mailto:adtf68@hotmail.fr" className="text-brand-blue underline">adtf68@hotmail.fr</a>.
                              Un justificatif d'identité pourra être demandé.
                            </span>
                          </label>
                          {errors.rgpd && <FieldError message={errors.rgpd} />}
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                    {step > 1 ? (
                      <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} className="flex items-center gap-2 text-slate-600 hover:text-brand-blue-dark font-bold text-sm transition-colors">
                        <ChevronLeft size={18} />
                        Retour
                      </button>
                    ) : <div />}

                    {step < 3 ? (
                      <button type="button" onClick={handleNext} className="btn-primary">
                        Continuer
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                            Envoi en cours…
                          </>
                        ) : (
                          <>
                            <Send size={17} />
                            Envoyer ma demande
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <p className="text-center text-slate-400 text-xs mt-4">
              Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
