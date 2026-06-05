import { Star, Quote, Building, User, Award } from 'lucide-react';
import { Testimonial } from '../types';

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "t1",
      author: "Sarah Jenkins",
      title: "Managing Director",
      company: "Zenith Social Group (Digital Agency)",
      quote: "Before Synapse, we were wasting untold billable hours manually rewriting single campaign ideas into LinkedIn articles, X threads, and newsletter briefs for 12 client portfolios. Universal calendars just blasted the same boring text blocks everywhere, resulting in zero reach. With Synapse Sync, our copywriters adjust voice structures in single clicks—and client reach stats blew up by 180% inside our first month.",
      avatarSeed: "sarah",
      metricsAchieved: "Saved 15+ Billable Hours/Week",
      platformStrength: "LinkedIn & Newsletter Adaption"
    },
    {
      id: "t2",
      author: "Marcus Reed",
      title: "Solo Creator & Substack Author",
      company: "The Compound (Professional Creator)",
      quote: "You simply cannot paste the exact same text onto X and expect newsletter subscribers to open it. Social subcultures smell lazy publishing immediately. Converting my deep-dive essays into high-density threads, video bullets, and warm email hooks used to steal my entire weekend. Synapse Sync is the only co-pilot that keeps my core theories while generating platform-specific hooks that work. My active community size doubled in weeks.",
      avatarSeed: "marcus",
      metricsAchieved: "14,200 New Subscribers Generated",
      platformStrength: "X (Twitter) & Substack Funnels"
    },
    {
      id: "t3",
      author: "Elena Rostova",
      title: "Chief Marketing Officer",
      company: "CoreBio Skincare (Scaling SMB)",
      quote: "As an organic brand, our three-person marketing team handles everything in-house. We were pasting standard product specs across Instagram, LinkedIn, and our weekly reports, obtaining zero responses. Synapse Sync re-engineered our product descriptions into custom narrative stories optimized for algorithmic reach. We jumped from 3k to 48k monthly impressions without spending an extra dime on paid ads.",
      avatarSeed: "elena",
      metricsAchieved: "+1,200% Organic Page Impressions",
      platformStrength: "Multi-Platform Brand Syncing"
    }
  ];  return (
    <section id="testimonials" className="py-24 bg-[#0D1B2A] px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#444444]/40">
      
      {/* Visual background elements */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#C9A84C]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#C9A84C] text-[10px] uppercase font-bold tracking-widest block mb-3 font-mono">
            Social Proof & Trust
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F7F3EC] tracking-tight leading-tight">
            Proof from teams who syndicalize content for a living.
          </h2>
          <p className="text-[#888888] mt-4 text-sm sm:text-base font-normal">
            See how scaling digital agencies, full-time independent creators, and performance-minded brands use Synapse Sync to completely change how they reach target feeds.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-sans">
          {testimonials.map((test) => (
            <div 
              key={test.id} 
              className="bg-[#444444]/15 border border-[#444444]/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#C9A84C]/50 hover:bg-[#444444]/25 transition-all duration-300 relative shadow-lg backdrop-blur-xl group"
            >
              <div className="absolute top-6 right-6 text-[#C9A84C]/10 group-hover:text-[#C9A84C]/20 transition-colors pointer-events-none">
                <Quote className="w-12 h-12 stroke-[3]" />
              </div>

              <div>
                {/* Visual Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>

                <p className="text-[#F7F3EC]/90 text-sm sm:text-[14.5px] leading-relaxed mb-6 font-normal italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Bottom Author block & Metrics */}
              <div>
                {/* Metric achievement highlight */}
                <div className="mb-5 p-3 rounded-xl bg-[#444444]/20 border border-[#444444] inline-flex items-center gap-1.5 w-full">
                  <Award className="w-4.5 h-4.5 text-[#C9A84C] shrink-0" />
                  <span className="text-[10px] font-bold text-[#C9A84C] tracking-wide font-mono uppercase">
                    {test.metricsAchieved}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Styled Avatar Placeholder */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#888888] flex items-center justify-center font-bold text-[#0D1B2A] text-xs uppercase shadow-md shadow-[#C9A84C]/10 shrink-0">
                    {test.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-bold text-sm truncate">{test.author}</span>
                    <span className="text-[#888888] text-xs truncate flex items-center gap-1 font-medium">
                      <Building className="w-3 h-3 text-[#C9A84C]" />
                      {test.company}
                    </span>
                    <span className="text-[10px] text-[#C9A84C] mt-0.5 uppercase tracking-wider font-mono">
                      {test.platformStrength}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
