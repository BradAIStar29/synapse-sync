import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenTrial: (plan?: string) => void;
  onScrollToDemo: () => void;
}

export default function Hero({ onOpenTrial, onScrollToDemo }: HeroProps) {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#0D1B2A]">
      {/* Background Gradients & Effects from theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#444444]/30 rounded-full blur-[120px]" />
      </div>
      
      {/* Mesh grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C] text-[11px] font-mono font-bold uppercase tracking-widest mb-8 animate-fade-in shadow-[0_0_15px_rgba(201,168,76,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] fill-current animate-pulse" />
          <span>The Multi-Channel Co-Pilot</span>
        </div>

        {/* Emotionally Provocative Headline targeting major content creators / agencies */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6 text-[#F7F3EC]">
          Managing 3+ content channels is burning you out.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#F7F3EC] to-[#888888]">
            Cross-posting same lazy copy is killing your engagement.
          </span>
        </h1>

        {/* Clear Subheadline in non-technical simple language */}
        <p className="text-sm sm:text-base md:text-lg text-[#888888] max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Stop posting the exact same content everywhere. <strong className="text-[#C9A84C] font-semibold">Synapse Sync</strong> is your dedicated AI co-pilot that actively formats, engineers, and optimizes your core insights into specific, high-reach posts customized for the specific algorithms of <strong className="text-[#F7F3EC]">LinkedIn, X, video descriptions,</strong> and <strong className="text-[#F7F3EC]">email newsletters</strong>—all in one place.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => onOpenTrial()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/45 hover:scale-105 active:scale-[0.99] group cursor-pointer"
          >
            Optimize My Reach Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onScrollToDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#444444]/20 hover:bg-[#444444]/45 text-[#F7F3EC] hover:text-white border border-[#444444] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-md cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-[#C9A84C]" />
            Try Live Co-Pilot Simulator
          </button>
        </div>

        {/* High Display Stats Section (3 compelling statistics) */}
        <div id="stats" className="border border-[#444444]/80 bg-[#444444]/15 backdrop-blur-xl py-10 md:py-14 max-w-5xl mx-auto rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative shadow-2xl">
          {/* Subtle light leak internally */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/5 to-transparent rounded-3xl pointer-events-none" />
          
          <div className="px-6 text-center md:border-r border-[#444444]/60 last:border-0 flex flex-col justify-center">
            <span className="font-display font-black text-5xl md:text-6xl text-[#C9A84C] tracking-tight block mb-2">
              4.2x
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#888888] mt-1 font-bold block mb-2">
              Avg. Reach Growth
            </span>
            <span className="text-[#888888] text-xs md:text-sm font-normal max-w-[240px] mx-auto">
              Average lift in organic engagement compared to manual raw cross-posting.
            </span>
          </div>

          <div className="px-6 text-center md:border-r border-[#444444]/60 last:border-0 flex flex-col justify-center">
            <span className="font-display font-black text-5xl md:text-6xl text-[#F7F3EC] tracking-tight block mb-2">
              12hrs
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#888888] mt-1 font-bold block mb-2">
              Saved Per Week
            </span>
            <span className="text-[#888888] text-xs md:text-sm font-normal max-w-[240px] mx-auto">
              Weekly hours saved per client workspace by eliminating manual rewrite cycles.
            </span>
          </div>

          <div className="px-6 text-center flex flex-col justify-center">
            <span className="font-display font-black text-5xl md:text-6xl text-[#C9A84C] tracking-tight block mb-2">
              89%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#888888] mt-1 font-bold block mb-2">
              Higher Engagement
            </span>
            <span className="text-[#888888] text-xs md:text-sm font-normal max-w-[240px] mx-auto">
              Increase in outbound referral traffic driven by algorithmic hook variations.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
