import { ArrowRight, Home, Wind, Layers } from 'lucide-react';
import { usePhoto } from '../lib/photos';

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

const interieureProducts = [
  {
    title: 'Fenêtres',
    description: "PVC, aluminium, bois ou bi-matière. Double ou triple vitrage, large choix de couleurs et finitions. Renfort métallique intégré, 5 ou 6 chambres d'aérations selon fournisseur.",
    photo: 'interieur.fenetres',
    tags: ['PVC', 'Aluminium', 'Bois'],
  },
  {
    title: 'Portes-fenêtres & Baies vitrées',
    description: "Coulissantes à translation, levantes ou galandage. Maximisez la luminosité et l'espace de votre intérieur avec nos solutions sur mesure de grandes marques.",
    photo: 'interieur.baies',
    tags: ['Coulissant', 'Galandage', 'Sur mesure'],
  },
  {
    title: 'Fenêtres de toit (Velux)',
    description: "Remplacement uniquement (pas de création). Apport de lumière naturelle indispensable pour rendre vos combles habitables et confortables.",
    photo: 'interieur.velux',
    tags: ['Velux', 'Combles', 'Lumière'],
  },
  {
    title: 'Verrières',
    description: "Séparations lumineuses et design. Attention : le toit est déjà existant — à ne pas confondre avec une véranda. Idéal pour ouvrir et sublimer vos espaces intérieurs.",
    photo: 'interieur.verrieres',
    tags: ['Intérieur', 'Design', 'Lumineux'],
  },
  {
    title: 'Portes intérieures',
    description: "Battantes à feuillure, coulissantes sur ou dans le mur, portes climat/palières ou en verre. Décors inox, toutes couleurs et poignées modulables.",
    photo: 'interieur.portes',
    tags: ['Battante', 'Coulissante', 'Verre'],
  },
  {
    title: 'Stores intérieurs',
    description: "Installables sur tous types de fenêtres, électriques ou manuels. Large gamme de motifs et couleurs disponibles pour un confort optimal.",
    photo: 'interieur.stores',
    tags: ['Électrique', 'Manuel', 'Sur mesure'],
  },
];

const exterieureProducts = [
  {
    title: 'Portails & Clôtures',
    description: "Portillons, portails 1 ou 2 vantaux, coulissants. Manuel ou motorisé avec digicode, caméra, boîte aux lettres. Tous styles et couleurs en aluminium.",
    photo: 'exterieur.portails',
    tags: ['Aluminium', 'Motorisé', 'Sur mesure'],
  },
  {
    title: "Portes d'entrée",
    description: "Panneaux Verissima vitrés sécurisés (44.2 mm anti-effraction), décors modernes ou anciens, ouverture biométrique, judas caméra, bâtons de maréchal.",
    photo: 'exterieur.portes-entree',
    tags: ['Anti-effraction', 'Biométrique', 'Design'],
  },
  {
    title: 'Volets roulants & Battants',
    description: "Monoblock, rénovation, tradi, BSO ou caissons titans. Moteur filaire, radio ou solaire. Volets battants en bois, PVC ou aluminium extrudé.",
    photo: 'exterieur.volets',
    tags: ['Roulant', 'Battant', 'Solaire'],
  },
  {
    title: 'Pergolas & Carports',
    description: "Pergolas bioclimatiques intelligentes s'auto-gérant selon le soleil et la température. Carports pour protéger votre véhicule des intempéries.",
    photo: 'exterieur.pergolas',
    tags: ['Bioclimatique', 'Connecté', 'Sur mesure'],
  },
  {
    title: 'Portes de garage',
    description: "Sectionnelles, basculantes, battantes ou enroulables. Motorisées avec digicode, portillon intégré, hublots et décors personnalisables.",
    photo: 'exterieur.garage',
    tags: ['Sectionnelle', 'Motorisé', 'Personnalisé'],
  },
  {
    title: 'Garde-corps & Marquises',
    description: "Sécurisent terrasses et montées d'escalier (normes très strictes — remplacement obligatoire en totalité). Marquises au-dessus des portes pour vous abriter des intempéries en toutes saisons.",
    photo: 'exterieur.garde-corps',
    tags: ['Sécurité', 'Normes', 'Design'],
  },
];

interface ProductCardProps {
  title: string;
  description: string;
  photo: string;
  tags: string[];
}

function ProductCard({ title, description, photo, tags }: ProductCardProps) {
  const image = usePhoto(photo);

  return (
    <article className="card group">
      <div className="relative overflow-hidden h-48">
        <img
          src={image.src}
          alt={image.alt || title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/55 to-transparent" />
        {/* Green bottom accent line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-brand-blue-dark text-lg mb-2 group-hover:text-brand-blue transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-bold bg-brand-green-bg text-brand-blue border border-brand-green/30 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function PhotoVitrage({ cle, label }: { cle: string; label: string }) {
  const photo = usePhoto(cle);
  return (
    <div className="h-36 overflow-hidden">
      <img src={photo.src} alt={photo.alt || label} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  onCta,
}: {
  eyebrow: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="eyebrow-bar" />
          <span className="eyebrow">
            {/* Green icon chip per charter */}
            <span className="w-6 h-6 bg-brand-green rounded-md flex items-center justify-center">
              <Icon size={12} className="text-white" />
            </span>
            {eyebrow}
          </span>
        </div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle max-w-2xl">{subtitle}</p>
      </div>
      <button
        onClick={onCta}
        className="hidden md:flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark font-bold text-sm transition-colors mt-4 md:mt-0 shrink-0 border-b-2 border-brand-green pb-0.5"
      >
        Demander un devis
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default function Services() {
  return (
    <>
      {/* Intérieures */}
      <section id="interieures" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Intérieur"
            icon={Home}
            title="Menuiseries intérieures"
            subtitle="Découvrez nos fenêtres, portes-fenêtres, baies vitrées, verrières et portes intérieures de grandes marques. Composez vos menuiseries selon vos besoins et envies."
            onCta={() => scrollTo('#contact')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interieureProducts.map((p) => <ProductCard key={p.title} {...p} />)}
          </div>

          {/* Technical vitrage panel */}
          <div className="mt-10 bg-white rounded-2xl border border-brand-green/20 p-6">
            <h3 className="font-display font-bold text-brand-blue-dark text-base mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                <Layers size={14} className="text-white" />
              </span>
              Notre expertise vitrage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                { label: 'Double vitrage (standard)', spec: '4/16/4 — Gaz Argon', note: 'Le standard — 4 mm de verre, 16 mm inter-espace.', accent: false, photo: 'vitrage.double' },
                { label: 'Triple vitrage', spec: '4/18/4/18/4 — Haute performance', note: 'Isolation thermique maximale pour les régions froides.', accent: false, photo: 'vitrage.triple' },
                { label: 'Anti-effraction', spec: '44.2/16/4 — Catégorie sécurité', note: 'Vitrage feuilleté sécurit conforme aux normes assurances.', accent: true, photo: null },
              ].map(({ label, spec, note, accent, photo }) => (
                <div key={label} className={`rounded-xl overflow-hidden ${accent ? 'bg-brand-green-bg border border-brand-green/30' : 'bg-slate-50'}`}>
                  {photo && <PhotoVitrage cle={photo} label={label} />}
                  <div className="p-4">
                    <div className="font-bold text-brand-blue-dark mb-1">{label}</div>
                    <div className={`font-mono text-xs mb-2 ${accent ? 'text-brand-blue' : 'text-slate-500'}`}>{spec}</div>
                    <div className="text-slate-500 text-xs">{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extérieures */}
      <section id="exterieures" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Extérieur"
            icon={Wind}
            title="Menuiseries extérieures"
            subtitle="Portails, portes d'entrée, volets, pergolas, portes de garage et bien plus. Esthétique, sécurité et praticité pour protéger et embellir votre propriété."
            onCta={() => scrollTo('#contact')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exterieureProducts.map((p) => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
