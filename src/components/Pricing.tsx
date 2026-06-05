import { Check, ShieldCheck, Sparkles, Building, UserCheck } from 'lucide-react';

interface PricingProps {
  onOpenTrial: (plan: string) => void;
}

export default function Pricing({ onOpenTrial }: PricingProps) {
  const plans = [
    {
      name: "Starter",
      price: "10",
      description: "Automated brand co-pilot for solo creators and managers to schedule posts and identify optimal audience slots.",
      trialText: "14-day free trial — then $10/month",
      icon: <UserCheck className="w-5 h-5 text-[#C9A84C]" />,
      features: [
        "Cross-platform scheduling & queues",
        "Basic channel analytics & reports",
        "AI optimal posting times tracking",
        "Connect up to 3 brand channels",
        "Local Draft buffers",
        "Standard support channels"
      ],
      buttonText: "Claim My Starter 14-Day Free Trial",
      popular: false,
      badge: "Solo Marketer"
    },
    {
      name: "Pro",
      price: "100",
      description: "Complete AI content engine for agencies, startups, and high-growth writers looking to scale across all networks.",
      trialText: "14-day free trial — then $100/month",
      icon: <Building className="w-5 h-5 text-[#C9A84C]" />,
      features: [
        "All Starter features included",
        "Creative Content Library Hub",
        "Intelligent AI Repurposing suite",
        "Creator tool integrations (Canva / Jasper)",
        "Competitor strategy & peer intel monitor",
        "Audience persona segmentation loops",
        "Advanced Predictive analytics & virality mapping",
        "Priority sync delivery buffers"
      ],
      buttonText: "Establish My Pro 14-Day Free Trial",
      popular: true,
      badge: "Agency Standard"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0D1B2A] px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#444444]/40">
      
      {/* Glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#444444]/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-[#F7F3EC]">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest block mb-3 font-mono">
            Direct & Transparent Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F7F3EC] tracking-tight leading-tight">
            Stop waste. Pick the co-pilot that fits your current operational scale.
          </h2>
          <p className="text-[#888888] mt-4 text-sm sm:text-base leading-relaxed">
            Every plan includes our 14-day zero-risk trial. Pay $0 today, explore all adaptations, and watch engagement climb before charging your card.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 relative shadow-2xl ${
                p.popular
                  ? 'border-[#C9A84C] bg-[#444444]/25 scale-100 md:scale-[1.03] z-10 shadow-[0_8px_40px_rgba(201,168,76,0.15)]'
                  : 'border-[#444444]/80 bg-[#444444]/15'
              }`}
            >
              {/* Popularity Badge */}
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#888888] text-[#0D1B2A] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-[#C9A84C]/25 font-mono border border-[#C9A84C]/50">
                  <Sparkles className="w-3 h-3 text-[#0D1B2A] fill-[#0D1B2A] animate-pulse" />
                  Most Pro Choice
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#444444]/20 border border-[#444444]">
                      {p.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#C9A84C] font-mono">
                      {p.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#F7F3EC] mb-2 leading-tight">
                  {p.name}
                </h3>
                
                <p className="text-[#888888] text-sm leading-relaxed mb-6 font-normal">
                  {p.description}
                </p>

                {/* Price Label */}
                <div className="flex items-baseline gap-2 mb-6 border-b border-[#444444]/60 pb-6">
                  <span className="font-display font-extrabold text-5xl text-[#F7F3EC]">
                    ${p.price}
                  </span>
                  <span className="text-[#888888] text-sm font-medium font-mono">/ month</span>
                </div>

                {/* Features checklist */}
                <ul className="space-y-3.5 mb-8">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#F7F3EC]/85">
                      <Check className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                      <span className="font-normal">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Button Area */}
              <div className="mt-auto">
                <button
                  id={`cta-btn-${p.popular ? 'pro' : 'starter'}`}
                  onClick={() => onOpenTrial(p.name)}
                  className={`w-full inline-flex items-center justify-center py-4 rounded-2xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                    p.popular
                      ? 'bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] shadow-lg shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/45'
                      : 'bg-[#444444]/15 hover:bg-[#444444]/35 border border-[#444444] text-[#F7F3EC]'
                  }`}
                >
                  {p.buttonText}
                </button>
                <span className="block text-center text-[10px] text-[#888888] mt-3 font-medium">
                  {p.trialText}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Security / Risk Reversal Badge Footer */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-[#888888] bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-4 max-w-lg mx-auto backdrop-blur-md">
          <ShieldCheck className="w-4.5 h-4.5 text-[#C9A84C] shrink-0" />
          <span>Locked Guarantee: Secure 256-bit encryption. Zero commitment. Cancel with two clicks anytime.</span>
        </div>

      </div>
    </section>
  );
}
