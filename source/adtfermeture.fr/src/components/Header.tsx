import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { usePhoto } from '../lib/photos';

const navLinks = [
  { label: 'Accueil', href: '#accueil', section: 'accueil' },
  {
    label: 'Menuiseries',
    href: '#menuiseries',
    section: 'menuiseries',
    children: [
      { label: 'Menuiseries intérieures', href: '#interieures' },
      { label: 'Menuiseries extérieures', href: '#exterieures' },
    ],
  },
  { label: 'À propos', href: '#a-propos', section: 'a-propos' },
  { label: 'Actualités', href: '#actualites', section: 'actualites' },
  { label: 'Réalisations', href: '#realisations', section: 'realisations' },
  { label: 'Contact', href: '#contact', section: 'contact' },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Header() {
  const logo = usePhoto('logo');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const sections = navLinks
      .flatMap((l) => (l.section ? [l.section] : []))
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActiveSection((topmost.target as HTMLElement).id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    scrollTo(href);
  };

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.section === activeSection) return true;
    if (link.children) {
      return link.children.some((c) => c.href.slice(1) === activeSection);
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-brand-blue-dark ${
        scrolled ? 'shadow-2xl' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8 h-20 sm:h-36">

          {/* Logo */}
          <button
            onClick={() => handleNav('#accueil')}
            className="shrink-0 hover:opacity-90 transition-opacity flex items-center"
            aria-label="Retour à l'accueil"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-14 sm:h-[132px] w-auto object-contain"
            />
          </button>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-white/20 shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1" aria-label="Navigation principale">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" ref={dropdownRef}>
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                      isActive(link)
                        ? 'text-white bg-white/15'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 opacity-70 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Active dot */}
                  {isActive(link) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-green rounded-full" />
                  )}

                  {/* Dropdown */}
                  <div
                    className={`absolute top-[calc(100%+8px)] left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 transition-all duration-150 origin-top-left ${
                      dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
                        Nos produits
                      </span>
                    </div>
                    {link.children.map((child) => (
                      <button
                        key={child.label}
                        onClick={() => handleNav(child.href)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-green-bg hover:text-brand-blue-dark font-semibold transition-colors rounded-lg mx-0"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => handleNav(link.href)}
                    className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                      isActive(link)
                        ? 'text-white bg-white/15'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                  {isActive(link) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-green rounded-full" />
                  )}
                </div>
              ),
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 ml-auto">
            <a
              href="tel:0355230161"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors group"
              aria-label="Appeler ADTF"
            >
              <span className="w-7 h-7 bg-brand-green/20 group-hover:bg-brand-green/30 rounded-lg flex items-center justify-center transition-colors">
                <Phone size={13} className="text-brand-green" />
              </span>
              <span className="hidden xl:block">03 55 23 01 61</span>
            </a>
            <button
              onClick={() => handleNav('#contact')}
              className="bg-brand-green hover:bg-brand-green-light text-white text-sm font-bold px-5 py-2 rounded-lg transition-all duration-200 shadow-md shadow-brand-green/20 hover:shadow-brand-green/30"
            >
              Devis gratuit
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-brand-blue-dark border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-4 h-px bg-brand-green" />
                    <span className="text-brand-green text-xs font-bold uppercase tracking-widest">{link.label}</span>
                  </div>
                  {link.children.map((child) => (
                    <button
                      key={child.label}
                      onClick={() => handleNav(child.href)}
                      className="w-full text-left pl-9 pr-4 py-2.5 text-white/80 hover:text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                    activeSection === link.section
                      ? 'text-white bg-white/15'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ),
            )}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 pb-2">
              <a
                href="tel:0355230161"
                className="flex items-center gap-3 text-white/70 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Phone size={15} className="text-brand-green" />
                03 55 23 01 61
              </a>
              <button
                onClick={() => handleNav('#contact')}
                className="bg-brand-green hover:bg-brand-green-light text-white text-sm font-bold px-5 py-3 rounded-lg transition-all w-full"
              >
                Demander un devis gratuit
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
