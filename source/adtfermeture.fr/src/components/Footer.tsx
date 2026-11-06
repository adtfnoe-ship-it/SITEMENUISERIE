import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePhoto } from '../lib/photos';

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

const menuiserieLinks = [
  { label: 'Menuiseries intérieures', href: '#interieures' },
  { label: 'Fenêtres & Portes-fenêtres', href: '#interieures' },
  { label: 'Baies vitrées', href: '#interieures' },
  { label: 'Portes intérieures', href: '#interieures' },
  { label: 'Verrières & Velux', href: '#interieures' },
  { label: 'Menuiseries extérieures', href: '#exterieures' },
  { label: 'Portails & Clôtures', href: '#exterieures' },
  { label: 'Volets & Stores', href: '#exterieures' },
  { label: 'Pergolas & Carports', href: '#exterieures' },
];

const entrepriseLinks = [
  { label: "À propos d'ADTF", href: '#a-propos' },
  { label: 'Nos engagements', href: '#avantages' },
  { label: 'Label RGE', href: '#avantages' },
  { label: 'Parrainage', href: '#avantages' },
  { label: 'Nos réalisations', href: '#realisations' },
  { label: 'Contact & Devis', href: '#contact' },
];

export default function Footer() {
  const logo = usePhoto('logo');
  return (
    <footer className="bg-brand-blue-dark text-white">
      {/* Green accent top */}
      <div className="h-1 bg-brand-green" />

      {/* CTA band — brand-blue */}
      <div className="bg-brand-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="font-display font-bold text-white text-xl">
                Un projet de menuiserie ? Obtenez votre devis gratuit
              </h3>
              <p className="text-white/75 text-sm mt-1">
                Étude personnalisée, gratuite et sans engagement — réponse rapide.
              </p>
            </div>
            <button onClick={() => scrollTo('#contact')} className="btn-secondary whitespace-nowrap shrink-0">
              Demander un devis
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div>
            {/* Logo on white background per charter */}
            <div className="bg-white rounded-xl px-4 py-3 inline-block mb-5">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Alliance Diffusion Toutes Fermetures — menuiseries sur mesure en aluminium, PVC, bois.
              Vente et pose depuis 2015 dans les Vosges, Alsace et Moselle.
            </p>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={12} className="text-white" />
                </div>
                <span className="text-white/55">3 Impasse de Claingoutte<br />88650 Saint-Léonard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-white" />
                </div>
                <a href="tel:0355230161" className="text-white/60 hover:text-white transition-colors">03 55 23 01 61</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-white" />
                </div>
                <a href="tel:0667434825" className="text-white/60 hover:text-white transition-colors">06 67 43 48 25</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center shrink-0">
                  <Mail size={12} className="text-white" />
                </div>
                <a href="mailto:adtf68@hotmail.fr" className="text-white/60 hover:text-white transition-colors break-all">adtf68@hotmail.fr</a>
              </div>
            </address>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Facebook, label: 'Facebook ADTF' },
                { Icon: Instagram, label: 'Instagram ADTF' },
                { Icon: Linkedin, label: 'LinkedIn ADTF' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 bg-white/8 hover:bg-brand-green rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Menuiseries */}
          <div>
            <h4 className="font-display font-bold text-brand-green text-sm mb-4 uppercase tracking-wider">
              Nos menuiseries
            </h4>
            <ul className="space-y-2.5">
              {menuiserieLinks.map(({ label, href }) => (
                <li key={label}>
                  <button onClick={() => scrollTo(href)} className="text-white/50 hover:text-white text-sm transition-colors text-left hover:translate-x-0.5 transform duration-150">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-display font-bold text-brand-green text-sm mb-4 uppercase tracking-wider">
              L'entreprise
            </h4>
            <ul className="space-y-2.5 mb-7">
              {entrepriseLinks.map(({ label, href }) => (
                <li key={label}>
                  <button onClick={() => scrollTo(href)} className="text-white/50 hover:text-white text-sm transition-colors text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
            <h4 className="font-display font-bold text-brand-green text-sm mb-3 uppercase tracking-wider">
              Certifications
            </h4>
            {['RGE', 'Qualibat', 'Décennale'].map((c) => (
              <div key={c} className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                <span className="text-white/55 text-sm">{c}</span>
              </div>
            ))}
          </div>

          {/* Horaires + RGE badge */}
          <div>
            <h4 className="font-display font-bold text-brand-green text-sm mb-4 uppercase tracking-wider">
              Horaires
            </h4>
            <div className="space-y-2.5 text-sm mb-8">
              {[
                { day: 'Lundi — Vendredi', h: '9h–12h / 14h–18h' },
                { day: 'Samedi', h: '9h–12h' },
                { day: 'Dimanche', h: 'Fermé', closed: true },
              ].map(({ day, h, closed }) => (
                <div key={day} className="flex justify-between gap-3">
                  <span className="text-white/45">{day}</span>
                  <span className={`font-semibold ${closed ? 'text-white/25' : 'text-white/80'}`}>{h}</span>
                </div>
              ))}
            </div>

            {/* Zone */}
            <h4 className="font-display font-bold text-brand-green text-sm mb-3 uppercase tracking-wider">Zone d'intervention</h4>
            <div className="space-y-1.5 text-sm text-white/55 mb-8">
              <div>Vosges — 88</div>
              <div>Alsace — 67 / 68</div>
              <div>Meurthe-et-Moselle — 54</div>
              <div className="text-white/30 text-xs pt-1">Trajets de 1h30 maximum</div>
            </div>

            {/* RGE badge — charter: bas gauche, fond blanc recommandé, toujours visible */}
            <div className="bg-white rounded-xl p-4 border-l-4 border-brand-green">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-display font-bold text-brand-blue-dark text-sm">RGE QUALIBAT</div>
                  <div className="text-brand-green font-bold text-xs uppercase tracking-wider">La qualité reconnue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {new Date().getFullYear()} ADTF — Alliance Diffusion Toutes Fermetures. Tous droits réservés.</p>
          <nav className="flex gap-5" aria-label="Liens légaux">
            {['Mentions légales', 'Politique de confidentialité', 'Infos cookies'].map((l) => (
              <a key={l} href="#" className="hover:text-white/65 transition-colors">{l}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
