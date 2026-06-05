import { useState } from 'react';
import { ChevronDown, AlertCircle, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does Synapse Sync's AI guarantee authentic, high-converting copy instead of robotic 'AI slop'?",
      answer: "We share your skepticism. Generic LLMs generate overly polite, stale copy that social feeds reject instantly. Synapse Sync is styled differently. Instead of raw open-ended requests, we utilize isolated tone heuristics. Every run uses proven vertical copywriting formulas—such as Narrative Bridges, High-Beta Density points, and retention loops. It adapts your core raw concepts to these algorithms, maintaining your natural insights while securing appropriate platform spacing and paragraph splits. It reads like you, optimized for speed-reading.",
      badge: "AI Effectiveness"
    },
    {
      question: "Social APIs are notoriously unstable. What happens to my scheduled content if LinkedIn, X, or Mail services change their access codes?",
      answer: "This is a serious dependency that breaks standard schedulers. To secure your flow, we engineered an isolated local caching queue pipeline. If X, LinkedIn, or YouTube modifies endpoints, goes offline, or throttles calls, Synapse Sync catches your content in our encrypted servers. We keep your queue buffered and run smart automated retry loops behind the scenes. This shields your campaign from partner downtime and lets you write with total peace of mind.",
      badge: "API Stability"
    },
    {
      question: "How is this different from standard tools like Hootsuite, Buffer, or general scheduling calendars?",
      answer: "Traditional tools are essentially passive clocks—they help you send content, but do nothing to make it perform. Synapse Sync is an active AI co-pilot focused on adaptation, reach multipliers, and engagement. We don't just schedule; we actively re-engineer drafts specifically for different subculture formats (X threads, LinkedIn storytelling, conversational emails) so you actively expand your reach, and we provide diagnostic feedback before you launch.",
      badge: "Our Differentiator"
    },
    {
      question: "Can we isolate multiple clients inside an agency plan without mixing up brand-voice profiles?",
      answer: "Yes, fully. The Pro Plan features fully containerized Brand Workspaces. Each client you register receives isolated database buffers, separate custom brand voice profiles, distinct team permissions, and unique analytics boards. Brand guidelines, prompts, and schedules will never cross-contaminate.",
      badge: "Agency Workspace"
    },
    {
      question: "How does the 14-day free trial work? Is it simple to cancel or do I need to jump through hoops?",
      answer: "We hate trial traps. You get complete, unthrottled access to your chosen tier for 14 full days. If Synapse Sync doesn't save you hours and boost engagement, you can cancel directly inside your dashboard with just two clicks. No phone lines, no sales pitches, and no awkward cancel surveys. You can even keep the customized drafts generated in your first week.",
      badge: "Risk Reversal"
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#0D1B2A] border-t border-[#444444]/40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gold highlights */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider mb-4 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Answers to Doubts</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F7F3EC] tracking-tight leading-tight">
            We know you're skeptical. Let's tackle the hard questions.
          </h2>
          <p className="text-[#888888] mt-4 text-sm sm:text-base">
            You've been burned by automatic tools that promised the moon. Here is the realistic breakdown of how Synapse protects your workflow and achieves real reach metrics.
          </p>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-[#444444]/15 border backdrop-blur-xl rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-[#C9A84C] bg-[#444444]/25 shadow-lg shadow-[#C9A84C]/5' 
                    : 'border-[#444444]/80'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-start sm:items-center justify-between p-5 text-left gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-bold uppercase font-mono shrink-0 border border-[#C9A84C]/20">
                      {faq.badge}
                    </span>
                    <span className="font-display font-semibold text-[#F7F3EC] text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#888888] shrink-0 transition-transform duration-200 mt-0.5 sm:mt-0 ${
                    isOpen ? 'rotate-180 text-[#C9A84C]' : ''
                  }`} />
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t border-[#444444]/60' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 text-sm text-[#F7F3EC]/85 leading-relaxed font-normal bg-[#444444]/5">
                    <span className="inline-block sm:hidden px-2.5 py-0.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-bold uppercase font-mono mb-2 md:mr-2">
                      {faq.badge}
                    </span>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Objection summary / contact suggestion */}
        <div className="mt-12 text-center p-6 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-xl text-[#C9A84C] shrink-0 hidden sm:block">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[#F7F3EC] text-sm font-bold">Have a custom technical objection or agency requirement?</h4>
              <p className="text-xs text-[#888888] leading-normal mt-0.5">Speak directly to an engineer. No marketing jargon—just clear API and LLM parameters answers.</p>
            </div>
          </div>
          <a
            href="mailto:support@synapsesync.com"
            className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:text-[#0D1B2A] hover:bg-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md font-mono"
          >
            Ask An Engineer
          </a>
        </div>

      </div>
    </section>
  );
}
