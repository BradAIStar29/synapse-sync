import { useState } from 'react';
import { Sparkles, Linkedin, Twitter, Mail, Youtube, ArrowUpRight, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

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

  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFooterEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail.trim() || footerStatus === 'loading') return;
    setFooterStatus('loading');
    try {
      const apiBase = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${apiBase}/api/collect-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: footerEmail.trim(), source: 'Footer Email Capture' }),
      });
      if (res.ok) {
        setFooterStatus('success');
        setFooterEmail('');
      } else {
        setFooterStatus('error');
      }
    } catch {
      setFooterStatus('error');
    }
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

      {/* Email Capture Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-12 border-t border-[#444444]/60">
        <div className="bg-[#444444]/10 border border-[#444444]/60 rounded-2xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display font-extrabold text-white text-base mb-1">Stay ahead of the algorithm.</h4>
            <p className="text-xs text-[#888888]">Get early access tips, platform updates, and content strategies straight to your inbox.</p>
          </div>
          <form onSubmit={handleFooterEmailSubmit} className="flex items-center gap-2 w-full md:w-auto">
            {footerStatus === 'success' ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                You're in! Check your inbox.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 md:w-64 p-3 bg-[#0D1B2A] border border-[#444444] rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] focus:border-[#C9A84C] placeholder-[#888888] transition-all"
                />
                <button
                  type="submit"
                  disabled={footerStatus === 'loading'}
                  className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-60 cursor-pointer"
                >
                  {footerStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Subscribe</span><ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#444444]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#888888] font-normal">
        <span>© {currentYear} Synapse Sync Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <span onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-[#C9A84C] transition-colors cursor-pointer">Privacy Policy</span>
          <span onClick={() => onOpenLegal && onOpenLegal('terms')} className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
        </div>
      </div>

    </footer>
  );
}
