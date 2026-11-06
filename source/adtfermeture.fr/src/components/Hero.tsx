import { ArrowRight, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { usePhoto } from '../lib/photos';

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  const principale = usePhoto('accueil.principale');
  const gauche = usePhoto('accueil.gauche');
  const droite = usePhoto('accueil.droite');

  return (
    <section id="accueil" className="relative min-h-screen flex flex-col bg-brand-blue-dark overflow-hidden">

      {/* ── Decorative background shapes ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large circle top-right */}
        <div className="absolute -top-40 -right-40 w-[280px] h-[280px] sm:w-[600px] sm:h-[600px] rounded-full bg-brand-blue/30" />
        {/* Small circle bottom-left */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-blue/20" />
        {/* Green accent rectangle */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green" />
        {/* Subtle dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#9CCB00" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-44 pb-10">

        {/* ── 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">

          {/* LEFT — text */}
          <div>
            {/* RGE badge */}
            <div className="inline-flex items-center gap-2.5 bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-md shadow-brand-green/30">
              <ShieldCheck size={14} className="shrink-0" />
              Certifié RGE · Qualibat · Décennale — La qualité reconnue
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-6">
              Votre spécialiste<br />
              <span className="text-brand-green">menuiseries</span>{' '}
              <span className="text-white">sur mesure</span><br />
              <span className="text-white/70 text-2xl sm:text-3xl xl:text-4xl">près de Saint-Dié-des-Vosges</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-3">
              Alliance Diffusion Toutes Fermetures — vente et pose de menuiseries en
              bois, aluminium et PVC. Fabrication française et européenne, pose par
              nos propres équipes depuis 2015.
            </p>

            <div className="flex items-center gap-2 text-brand-green text-sm font-semibold mb-8">
              <MapPin size={15} className="shrink-0" />
              Secteur Vosgien (88) · Alsace (67/68) · Meurthe-et-Moselle (54)
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-primary text-base py-4 px-8 rounded-xl shadow-lg shadow-brand-blue/40"
              >
                Demander un devis gratuit
                <ArrowRight size={18} />
              </button>
              <a
                href="tel:0355230161"
                className="btn-outline text-base py-4 px-8 rounded-xl"
              >
                <Phone size={18} />
                03 55 23 01 61
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: '10+', label: "ans d'expérience" },
                { value: '8', label: 'marques partenaires' },
                { value: '3', label: 'équipes de pose' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/8 px-3 py-4 text-center"
                >
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white">{value}</div>
                  <div className="text-slate-300 text-xs sm:text-sm mt-1 font-medium leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — photo collage */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Main photo with green frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border-4 border-brand-green/60 shadow-2xl shadow-black/40">
              <img
                src={principale.src}
                alt={principale.alt}
                className="w-full h-full object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white font-bold text-sm bg-brand-blue-dark/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-brand-green/30">
                Baies vitrées aluminium
              </div>
            </div>

            {/* Two smaller photos side by side */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { photo: gauche, label: "Porte d'entrée" },
                { photo: droite, label: 'Portail aluminium' },
              ].map(({ photo, label }) => (
                <div key={label} className="relative rounded-xl overflow-hidden aspect-[4/3] border-2 border-brand-green/40 shadow-lg">
                  <img src={photo.src} alt={photo.alt || label} className="w-full h-full object-cover brightness-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/60 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 text-white font-bold text-xs bg-brand-blue-dark/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-brand-green/30">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8" aria-hidden="true">
        <div className="flex flex-col items-center gap-2 animate-bounce opacity-60">
          <div className="w-0.5 h-7 bg-brand-green rounded-full" />
          <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
        </div>
      </div>
    </section>
  );
}
