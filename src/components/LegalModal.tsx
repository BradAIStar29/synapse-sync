import { X, Shield, Scale, ScrollText, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, initialTab = 'terms' }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div id="legal-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/90 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        id="legal-modal-card" 
        className="relative w-full max-w-2xl bg-[#0D1B2A] border border-[#444444] rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(201,168,76,0.12)] backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200 font-sans text-[#F7F3EC] max-h-[85vh] flex flex-col"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          id="close-legal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-extrabold text-white leading-none">Legal & Regulatory Compliance</h3>
            <span className="text-[10px] text-[#888888] uppercase tracking-wider font-mono font-bold mt-1 block">Synapse Sync Platform Standard</span>
          </div>
        </div>

        {/* Document Scroll Container */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-xs text-[#888888] leading-relaxed custom-scrollbar pb-4 select-text">
          
          {/* Section 1: Terms of Service */}
          <div className="space-y-4 border-b border-[#444444]/40 pb-6">
            <h4 className="font-display font-bold text-sm text-[#F7F3EC] flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#C9A84C]" />
              1. TERMS OF SERVICE
            </h4>
            <p className="font-semibold text-white/90">Last Updated: June 5, 2026</p>
            
            <p>
              Welcome to Synapse Sync ("Service"). Standard terms outline conditions govern our cloud-supported reach optimization suite. By establishing a 14-day free trial on our website, connecting brand channels, or using Synapse Sync software interfaces, you enter a binding pact with Synapse Sync Inc. (or the "Company").
            </p>

            <div className="space-y-3 pl-2.5 border-l border-[#C9A84C]/30">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">A. Subscription Activation & Trial Period</h5>
              <p>
                Each customer gains access via a standard 14-day free trial. If you active a Starter ($10/mo) or Pro ($100/mo) plan, a zero-dollar trial billing hold verifies your gateway credentials. You will not be charged if you terminate your co-pilot registration prior to the conclusion of the 14-day sequence.
              </p>

              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">B. AI-Generated Adaptations & Content Rights</h5>
              <p>
                Synapse Sync processes your raw drafts through advanced LLMs to optimize hooks and pacing. Under this license agreement, you retain complete ownership of all outbound drafts, content adaptations, and channel templates. Synapse Sync claims no proprietary equity over text assets created via our co-pilot interface.
              </p>

              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">C. Acceptable Use of Reach Automated Planners</h5>
              <p>
                You represent that linked LinkedIn, X, Substack, and YouTube channel accounts are authorized media hubs under your standard possession or marketing agency custody. Automated content distribution must not propagate malicious, scam, or bot-harvested spam scripts infringing native target network regulations.
              </p>
            </div>
          </div>

          {/* Section 2: Privacy Policy */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-[#F7F3EC] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C9A84C]" />
              2. PRIVACY & DATA INTEGRITY POLICY
            </h4>
            
            <p>
              Your multi-channel growth requires ironclad data integrity. At Synapse Sync, our privacy strategy utilizes local sandbox sand-boxing, encrypted transit caches, and optional third-party integrations to maximize safety.
            </p>

            <div className="space-y-3 pl-2.5 border-l border-[#C9A84C]/30">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">A. Secure OAuth Processing & Tokens</h5>
              <p>
                When connecting LinkedIn, X, mailing queues, or video channels, token parameters undergo rigorous AES-256 local configuration buffer protection. We do not extract personal demographic rosters or store your private network passwords.
              </p>

              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">B. Processing Optimization Logs</h5>
              <p>
                We inspect campaign performance analytics (e.g. initial reach percentage, hook scroll clicks, engagement index density) purely to train the local user preference algorithm. No telemetry parameters or brand metrics are sold to external marketing brokers.
              </p>

              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">C. Standard Right to Terminate</h5>
              <p>
                Any active user has the permanent capability to remove workspace logs, unlink active channel adapters, and wipe their credit holdings from our active databases with two checkout menu clicks.
              </p>
            </div>
          </div>

          {/* Compliance list */}
          <div className="bg-[#444444]/15 border border-[#444444] rounded-2xl p-4 space-y-2 mt-4">
            <h5 className="text-[#C9A84C] font-mono uppercase font-bold text-[10px] tracking-widest flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Guarantee Verified Compliance
            </h5>
            <ul className="space-y-1.5 text-[11px] text-white/80 font-medium font-sans">
              <li>✓ GDPR & CCPA Data Deletion Rights Authorized</li>
              <li>✓ PCI-DSS Level 1 Gateway Verification Process</li>
              <li>✓ SOC 2 Type II Encrypted Token Session Buffers</li>
            </ul>
          </div>

        </div>

        {/* Modal footer */}
        <div className="mt-6 pt-4 border-t border-[#444444]/40 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-[#444444]/15 border border-[#444444]/80 hover:bg-[#444444]/35 text-[#F7F3EC] text-xs font-mono font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-[0.99]"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>

    </div>
  );
}
