import { Sparkles, Linkedin, Twitter, Mail, Youtube, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
}

export default function Footer({ onOpenLogin, onOpenSignup, onOpenLegal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D1B2A] border-t border-[#444444]/60 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-[#F7F3EC]">
      {/* Glow spots */}
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#C9A84C]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start justify-between gap-12">
        
        {/* Brand Description */}
        <div className="max-w-xs">
          <div onClick={handleScrollToTop} className="flex items-center gap-2.5 cursor-pointer group mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#888888] text-[#0D1B2A] shadow-lg shadow-[#C9A84C]/10">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white">
              Synapse<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#F7F3EC]">Sync</span>
            </span>
          </div>
          <p className="text-xs text-[#888888] leading-relaxed font-normal">
            Synapse Sync is the 'AI co-pilot for multi-channel content mastery', engineering single raw campaign ideas into algorithm-compliant reach leaders across LinkedIn, X, video, and emails.
          </p>
        </div>

        {/* Navigation columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-4 font-mono">
              The Platform
            </span>
            <ul className="space-y-2.5">
              <li>
                <a href="#demo" className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors">
                  Interactive Sandbox
                </a>
              </li>
              <li>
                <a href="#features" className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors">
                  Reach Elements
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors">
                  Objections FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-4 font-mono">
              Account Control
            </span>
            <ul className="space-y-2.5">
              {onOpenLogin && (
                <li>
                  <button onClick={onOpenLogin} className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Operator Log In
                  </button>
                </li>
              )}
              {onOpenSignup && (
                <li>
                  <button onClick={onOpenSignup} className="text-xs text-[#888888] hover:text-[#C9A84C] transition-colors cursor-pointer text-left">
                    Register Hub
                  </button>
                </li>
              )}
              <li className="flex items-center gap-1.5 text-xs text-[#888888]">
                <span>Status ID: Sandbox Online</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-4 font-mono">
              Integrations Included
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-xs text-[#888888]">
                <Linkedin className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>LinkedIn Sync</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-[#888888]">
                <Twitter className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>X / Twitter</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-[#888888]">
                <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Newsletter</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#444444]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#888888] font-normal">
        <span>© {currentYear} Synapse Sync Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <span onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">Privacy Policy</span>
          <span onClick={() => onOpenLegal && onOpenLegal('terms')} className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
        </div>
      </div>

    </footer>
  );
}
