import { CheckCircle, Gift, FileText, Wrench, CreditCard, Leaf, ShieldCheck, Star, Users, Clock } from 'lucide-react';

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

const commitments = [
  { icon: FileText, title: 'Étude personnalisée gratuite', description: 'Nous réalisons votre étude personnalisée, gratuite et sans engagement.' },
  { icon: ShieldCheck, title: 'Fabricants sélectionnés', description: 'Nous sélectionnons nos fabricants pour leur professionnalisme et la qualité de leurs produits.' },
  { icon: Star, title: 'Meilleur rapport qualité/prix', description: 'Nous vous garantissons un bon rapport qualité prix dans les Vosges, Alsace et Moselle.' },
  { icon: Wrench, title: 'SAV gratuit 10 ans', description: 'Nous offrons un service après-vente gratuit sur nos produits et prestations pendant 10 ans*.' },
  { icon: CheckCircle, title: 'Label RGE Qualibat', description: "Nous possédons l'agrément RGE Qualibat et vous garantissons la décennale." },
  { icon: Users, title: 'Poseurs salariés qualifiés', description: "Nos poseurs sont des salariés de l'entreprise hautement qualifiés, régulièrement formés." },
  { icon: CreditCard, title: "Aide aux dossiers d'aides", description: "Nous vous accompagnons dans l'enregistrement de votre dossier d'aides d'État et financement Cofidis." },
  { icon: Leaf, title: 'Engagement écoresponsable', description: "Nous nous engageons à limiter notre impact sur l'environnement par des actions écoresponsables." },
];

const highlights = [
  'Large choix de produits de grandes marques',
  'Simulations et devis gratuits',
  'SAV sur nos produits pendant 10 ans*',
  'Aide pour vos dossiers de financement',
];

export default function Benefits() {
  return (
    <>
      {/* Engagements */}
      <section id="avantages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="eyebrow-bar" />
              <span className="eyebrow">Pourquoi nous choisir</span>
              <div className="eyebrow-bar" />
            </div>
            <h2 className="section-title mb-4">Les engagements d'ADTF envers sa clientèle</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Le premier engagement de ADTF c'est votre satisfaction ! Vous accompagner et réaliser
              vos projets sont nos priorités.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {commitments.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-brand-green/40 bg-slate-50/50 hover:bg-brand-green-bg/30 transition-all duration-300"
              >
                {/* Green icon chip — charter: white icon on green */}
                <div className="icon-chip group-hover:bg-brand-blue transition-colors duration-300 mb-4">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-brand-blue-dark text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">
            *Voir conditions détaillées avec l'entreprise, valable uniquement sur une pose faite par ADTF.
          </p>

          {/* Highlights row — brand-blue bg, green check */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {highlights.map((text) => (
              <div key={text} className="flex items-center gap-3 bg-brand-blue rounded-2xl px-5 py-4">
                <CheckCircle size={18} className="text-brand-green shrink-0" />
                <span className="text-white font-semibold text-sm leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parrainage & RGE — brand-blue-dark background */}
      <section className="py-20 bg-brand-blue-dark relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/6 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        {/* Green accent top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-brand-green" />
                <span className="text-brand-green font-bold text-sm uppercase tracking-widest">Programme de parrainage</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Notre offre de parrainage pour vos projets de travaux
              </h2>
              <p className="text-white/70 leading-relaxed mb-5">
                Vous avez des proches qui ont un projet de construction ou de rénovation ? Parrainez
                votre famille ou vos amis et soyez récompensés ! ADTF vous offre des chèques cadeaux
                à valoir dans plus de 300 enseignes pour toute personne parrainée par vos soins
                (non connue de notre société) qui choisit ADTF pour son projet de menuiserie.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                En parrainant une personne de votre entourage, vous lui assurez un bon rapport qualité
                prix, une qualité de service et un suivi constant. Notre offre de parrainage n'est pas
                limitée dans le temps ! Vous pouvez nous recommander à autant de filleuls que vous le
                souhaitez et cumuler les chèques cadeaux.
              </p>
              <button onClick={() => scrollTo('#contact')} className="btn-primary">
                <Gift size={18} />
                Je parraine un proche
              </button>
            </div>

            <div className="space-y-4">
              {[
                { Icon: Gift, text: 'Chèques cadeaux valables dans plus de 300 enseignes' },
                { Icon: Clock, text: 'Offre non limitée dans le temps' },
                { Icon: Users, text: 'Parrainage illimité — cumulez les chèques cadeaux' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                  <div className="icon-chip shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-white/80 font-semibold">{text}</p>
                </div>
              ))}

              {/* RGE highlight — charter: white background recommended */}
              <div className="bg-white rounded-2xl p-5 border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="icon-chip shrink-0">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-brand-blue-dark text-base mb-1">
                      Label RGE — Reconnu Garant de l'Environnement
                    </h4>
                    <p className="text-brand-green font-bold text-xs uppercase tracking-wider mb-1.5">
                      La qualité reconnue
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Grâce à notre label RGE, vous bénéficiez des subventions de l'État en toute conformité
                      avec la loi de finance du 1er juin 2019. Financement Cofidis disponible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
