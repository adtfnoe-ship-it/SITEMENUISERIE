import { MapPin, Users, Award, Building2, ArrowRight } from 'lucide-react';
import { usePhoto } from '../lib/photos';

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

const partners = ['Bubendorff', 'Distral', 'Drutex', 'Eko Okno', 'Fame', 'Futurol', 'Isea', 'Verissima'];

export default function About() {
  const photo = usePhoto('apropos.photo');

  return (
    <section id="a-propos" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              {/* Green frame per charter */}
              <div className="absolute inset-0 rounded-2xl border-4 border-brand-green z-10 pointer-events-none" />
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover brightness-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-dark/15 to-transparent" />
            </div>
            {/* Floating year badge */}
            <div className="absolute -bottom-6 -right-4 bg-brand-blue text-white rounded-2xl shadow-xl px-6 py-5 z-20">
              <div className="font-display font-bold text-3xl leading-none">2015</div>
              <div className="text-white/70 text-xs font-medium mt-1">Fondée par</div>
              <div className="text-brand-green text-sm font-bold">Marie-Laure ROL</div>
            </div>
            {/* Green accent block */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-green/15 rounded-2xl -z-10" aria-hidden="true" />
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="eyebrow-bar" />
              <span className="eyebrow">À propos d'ADTF</span>
            </div>

            <h2 className="section-title mb-6">
              Une entreprise de menuiserie au service de tous vos projets
            </h2>

            <p className="text-slate-600 leading-relaxed mb-4">
              Créée en mai 2015 par Marie-Laure ROL, la société ADTF (Alliance Diffusion Toutes Fermetures)
              propose tous types de menuiseries sur mesure en aluminium, en PVC, en bois ou en bois/alu
              aux propriétaires et aux entrepreneurs.
            </p>

            <p className="text-slate-600 leading-relaxed mb-4">
              L'entreprise dispose de ses propres équipes de pose afin de garantir une réalisation
              professionnelle, avec toutes les garanties en vigueur (RGE, Qualibat, Décennale). Les
              menuiseries ADTF répondent à toutes les normes en vigueur, elles sont de fabrication
              française et européenne.
            </p>

            <p className="text-slate-600 leading-relaxed mb-6">
              ADTF vous propose ainsi le meilleur rapport qualité prix dans les Vosges mais aussi
              en Alsace et dans le sud de la Moselle. Les poseurs sont régulièrement formés, tout
              comme les commerciaux et les équipes du bureau.
            </p>

            {/* Zone card — green border left per charter */}
            <div className="bg-white rounded-2xl border border-brand-green/25 p-5 mb-6 green-border-left">
              <div className="flex items-start gap-3">
                <div className="icon-chip">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-brand-blue-dark text-sm mb-1">Zone d'intervention</div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Secteur Vosgien (88), Alsacien (67/68) et une partie de la Meurthe-et-Moselle (54),
                    dans les alentours de Fraize — trajets de 1h30 maximum.
                  </p>
                </div>
              </div>
            </div>

            {/* Key figures */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              {[
                { Icon: Users, value: '4', label: 'Agents commerciaux' },
                { Icon: Award, value: '3', label: 'Équipes de pose' },
                { Icon: Building2, value: '1', label: 'Showroom + entrepôt' },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="text-center p-2 sm:p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-green/30 transition-colors">
                  <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon size={17} className="text-white" />
                  </div>
                  <div className="font-display font-bold text-brand-blue-dark text-xl">{value}</div>
                  <div className="text-slate-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => scrollTo('#contact')} className="btn-primary">
              Besoin d'un devis ?
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Showroom card */}
        <div className="mt-20 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Green top accent line */}
          <div className="h-1 bg-brand-green" />
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 p-8 lg:p-10">
              <h3 className="font-display font-bold text-brand-blue-dark text-2xl mb-4">
                Visitez notre showroom pour découvrir nos portes et fenêtres
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nous vous accueillons dans notre showroom ADTF à Saint-Léonard du lundi au vendredi
                de 9h à 12h et de 14h à 18h (le samedi matin sur rendez-vous).
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Venez découvrir notre espace de présentation et rencontrer notre équipe de
                professionnels à votre écoute. Les mises en scènes de nos produits vous
                permettront de vous projeter dans votre futur projet.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Notre entrepôt ADTF à Fraize nous permet de stocker tous les éléments que nous posons.
                Contactez-nous au 03 55 23 01 61 pour toutes informations complémentaires.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:0355230161" className="btn-primary text-sm">
                  Appeler le 03 55 23 01 61
                </a>
                <button onClick={() => scrollTo('#contact')} className="btn-secondary border border-slate-200 text-sm">
                  Prendre rendez-vous
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 bg-brand-blue-dark p-8 lg:p-10 flex flex-col justify-center">
              <h4 className="font-display font-semibold text-white text-lg mb-5">Heures d'ouverture</h4>
              <div className="space-y-3">
                {[
                  { day: 'Lundi — Vendredi', hours: '9h00–12h00 / 14h00–18h00', open: true },
                  { day: 'Samedi', hours: '9h00–12h00', open: true },
                  { day: 'Dimanche', hours: 'Fermé', open: false },
                ].map(({ day, hours, open }) => (
                  <div key={day} className="flex justify-between items-center py-2.5 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-white/55">{day}</span>
                    <span className={`font-semibold ${open ? 'text-white' : 'text-white/30'}`}>{hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-start gap-2 text-sm text-white/50">
                <div className="icon-chip w-7 h-7 shrink-0">
                  <MapPin size={12} className="text-white" />
                </div>
                <span className="mt-1">3 Impasse de Claingoutte, 88650 Saint-Léonard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-16">
          <h3 className="text-center font-display font-bold text-brand-blue-dark text-xl mb-8">
            Nos marques partenaires et fabricants
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {partners.map((name) => (
              <div
                key={name}
                className="bg-white rounded-xl border border-slate-200 hover:border-brand-green/50 py-4 px-3 flex items-center justify-center hover:shadow-sm transition-all duration-200"
              >
                <span className="font-bold text-brand-blue-dark text-sm text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
