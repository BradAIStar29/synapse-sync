import { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface NavigationProps {
  onOpenTrial: (plan?: string) => void;
  onOpenLogin: () => void;
}

export default function Navigation({ onOpenTrial, onOpenLogin }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      id="main-nav"
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
            <button
              onClick={() => scrollToSection('demo')}
              className="text-sm font-semibold text-[#888888] hover:text-[#F7F3EC] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
            >
              Interactive Demo
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-semibold text-[#888888] hover:text-[#F7F3EC] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
            >
              Features & Reach
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-sm font-semibold text-[#888888] hover:text-[#F7F3EC] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
            >
              Proven Results
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-semibold text-[#888888] hover:text-[#F7F3EC] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-semibold text-[#888888] hover:text-[#F7F3EC] transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
            >
              FAQ
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenLogin}
              className="text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] transition-colors px-3 py-1.5 cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="nav-cta"
              onClick={() => onOpenTrial()}
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] text-xs uppercase tracking-widest font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-[#C9A84C]/10 hover:shadow-lg hover:shadow-[#C9A84C]/25 active:scale-[0.98] cursor-pointer"
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#0D1B2A]/95 backdrop-blur-xl border-b border-[#444444] px-4 pt-2 pb-6 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => scrollToSection('demo')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5"
          >
            Interactive Demo
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5"
          >
            Features & Reach
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5"
          >
            Proven Results
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5"
          >
            Pricing Plans
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5"
          >
            FAQ
          </button>
          <div className="pt-4 border-t border-[#444444]/40 flex flex-col gap-3">
            <button
              onClick={onOpenLogin}
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:bg-white/5"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenTrial()}
              className="w-full text-center bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] py-3 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-colors"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
