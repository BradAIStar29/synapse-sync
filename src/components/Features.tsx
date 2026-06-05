import { 
  Layers, 
  TrendingUp, 
  Shield, 
  Bot, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Features() {
  const benefits = [
    {
      icon: <Layers className="w-6 h-6 text-[#C9A84C]" />,
      tag: "Omni-Channel Adaptation",
      title: "Algorithmic Adaptation: Write Once, Dominate Everywhere",
      description: "Standard scheduling tools treat LinkedIn, X, and newsletters as simple copy-paste text fields. Synapse Sync tears apart your raw draft and automatically crafts bespoke versions—formatting LinkedIn storytelling loops, tightening X factual bullets, and writing conversational newsletter pitches in seconds.",
      outcome: "Saves 4+ hours of rewrite adjustments per post.",
      highlights: ["Formatting adaptations tailored for separate feeds", "Re-engineered conversational hooks", "Algorithm-boosting spacing buffers"]
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#C9A84C]" />,
      tag: "Predictive Analytics",
      title: "Pre-Publish Diagnostics: Know Performance Before You Go Live",
      description: "Stop flying blind. Traditional dashboards tell you what already failed. Synapse Sync evaluates your draft against high-performing patterns, scoring hook strengths and vocabulary density live in the editor. Fix performance weaknesses before they touch the feed.",
      outcome: "Ensures 1x baseline engagement lift on every release.",
      highlights: ["Real-time optimization scoring out of 100", "Custom vocabulary recommendations", "Direct suggestions to increase CTR"]
    },
    {
      icon: <Shield className="w-6 h-6 text-[#C9A84C]" />,
      tag: "API Resiliency",
      title: "Resilient API Buffering: Neutralize Platform Instability",
      description: "Worried about third-party API changes breaking your content stream? We have built an isolated queue pipeline. If X, LinkedIn, or YouTube modifies integrations or experiences outages, Synapse stores your campaigns in local buffers, automatically retrying behind the scenes so your stream never drops.",
      outcome: "99.9% uptime despite unstable third-party social APIs.",
      highlights: ["Durable local buffering cache buffers", "Automated smart scheduling retries", "Outage protection system"]
    },
    {
      icon: <Bot className="w-6 h-6 text-[#C9A84C]" />,
      tag: "Agency-Grade Workspace",
      title: "Unified Command Center: Tailor Client Identity at Scale",
      description: "For agencies and managers handling 3+ platforms across multiple brands, keeping styles isolated is crucial. Set up independent client workspaces, pre-feed individual custom tone models, and review queued drafts through team collaboration boards.",
      outcome: "Enables single managers to maintain 15+ clients effortlessly.",
      highlights: ["Separate white-labeled brand workspaces", "Independent brand voice tuning profiles", "Slick manager validation flows"]
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#0D1B2A] border-t border-[#444444]/40 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[#F7F3EC]">
      {/* Light leakage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-[-10%] w-[40%] h-[40%] bg-[#444444]/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <span className="text-[#C9A84C] text-[10px] uppercase font-bold tracking-widest block mb-3 font-mono">
            Outcomes &gt; Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Designed for those who value data-driven results—not dumb calendars.
          </h2>
          <p className="text-[#888888] mt-5 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Anyone can schedule a post. Synapse Sync is built for professional growth teams who need their multi-channel distribution stream to actively pull attention, earn leads, and drive business value.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((item, index) => (
            <div 
              key={index}
              className="bg-[#444444]/15 border border-[#444444]/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-350 hover:border-[#C9A84C]/50 hover:bg-[#444444]/25 shadow-[0_8px_32px_0_rgba(13,27,42,0.8)] backdrop-blur-xl group relative hover:-translate-y-1"
            >
              {/* Glow accent */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-transparent group-hover:bg-[#C9A84C]/20 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-[#444444]/20 border border-[#444444]">
                    {item.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-1 rounded-full font-mono">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-3 group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-[#888888] text-sm leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom outcome section */}
              <div className="pt-5 border-t border-[#444444]/60">
                <div className="flex items-center gap-2 mb-3.5">
                  <Zap className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  <span className="text-xs text-[#C9A84C] font-mono uppercase tracking-wider">
                    PROVABLE OUTCOME: {item.outcome}
                  </span>
                </div>

                {/* Highlights checklists */}
                <div className="space-y-2">
                  {item.highlights.map((hlt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#888888]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A84C]/70 shrink-0" />
                      <span>{hlt}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
