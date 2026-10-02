import { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface NavigationProps {
  onOpenTrial: (plan?: string) => void;
  onOpenLogin: () => void;
}

const NAV_LINKS = [
  { id: 'demo', label: 'How It Works' },
  { id: 'features', label: 'Features' },
  { id: 'testimonials', label: 'Results' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function Navigation({ onOpenTrial, onOpenLogin }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const isScrollingTo = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Scroll-spy: highlight the section currently in view
      // (skipped briefly while smooth-scrolling to a target)
      if (isScrollingTo.current) return;
      let current = '';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Lock body scroll while the mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (!element) return;

    // Temporarily suspend scroll-spy so the highlight lands on the target
    isScrollingTo.current = id;
    setActiveSection(id);

    const offset = 80; // navbar height
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    setTimeout(() => { isScrollingTo.current = null; }, 800);
  };

  const linkClass = (id: string) =>
    `relative text-[11px] font-semibold transition-colors cursor-pointer uppercase tracking-wider ${
      activeSection === id
        ? 'text-[#C9A84C]'
        : 'text-[#9BA3AF] hover:text-[#F7F3EC]'
    }`;

  return (
    <nav
      id="main-nav"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D1B2A]/90 backdrop-blur-md border-b border-[#444444]/60 py-3 shadow-[0_8px_32px_0_rgba(13,27,42,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            aria-label="Back to top"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#888888] text-[#0D1B2A] shadow-lg shadow-[#C9A84C]/10 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-[#C9A84C] transition-colors">
              Synapse<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#F7F3EC]">Sync</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                aria-current={activeSection === link.id ? 'true' : undefined}
                className={linkClass(link.id)}
              >
                {link.label}
                {/* Active underline indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 -bottom-1.5 h-px bg-[#C9A84C] transition-all duration-300 ${
                    activeSection === link.id ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold uppercase tracking-wider text-[#9BA3AF] hover:text-[#F7F3EC] transition-colors px-3 py-1.5 cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="nav-cta"
              onClick={() => onOpenTrial()}
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] text-xs uppercase tracking-widest font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-[#C9A84C]/10 hover:shadow-lg hover:shadow-[#C9A84C]/25 active:scale-[0.98] cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="menu"
          className="md:hidden bg-[#0D1B2A]/95 backdrop-blur-xl border-b border-[#444444] px-4 pt-2 pb-6 space-y-1 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              role="menuitem"
              onClick={() => scrollToSection(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeSection === link.id
                  ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                  : 'text-[#9BA3AF] hover:text-[#F7F3EC] hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#444444]/40 flex flex-col gap-3">
            <button
              role="menuitem"
              onClick={onOpenLogin}
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#9BA3AF] hover:text-[#F7F3EC] hover:bg-white/5"
            >
              Sign In
            </button>
            <button
              role="menuitem"
              onClick={() => { setIsMobileMenuOpen(false); onOpenTrial(); }}
              className="w-full text-center bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] py-3 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
