import { TemplateDraft, ChannelOptimizationMap } from './types';

export const CHANNEL_METADATA = [
  {
    id: 'linkedin',
    name: 'LinkedIn Professional',
    icon: 'Linkedin',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/30',
    placeholder: 'Write a professional announcement, milestone, or thought piece...',
    optimalLength: '900 - 1,500 chars',
    bestTime: 'Tuesday 9:00 AM',
    recommendation: 'Use a provocative 1-sentence hook. Build a story loop. Add 3 bullet points with double spacing.'
  },
  {
    id: 'x',
    name: 'X (formerly Twitter)',
    icon: 'Twitter', // X is Twitter in Lucide
    color: 'text-zinc-300',
    bgColor: 'bg-zinc-900/60',
    borderColor: 'border-zinc-700/50',
    placeholder: 'Write a punchy, counter-intuitive insight or launch thread start...',
    optimalLength: '120 - 240 chars',
    bestTime: 'Wednesday 12:00 PM',
    recommendation: 'Lead with a counter-intuitive stats claim. Use high-density action verbs. Max 1 emoji.'
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    icon: 'Facebook',
    color: 'text-blue-500',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-500/20',
    placeholder: 'Write a warm community post, local update, or agency project success story...',
    optimalLength: '200 - 450 chars',
    bestTime: 'Thursday 1:00 PM',
    recommendation: 'Start with a question. Write in a friendly, community-first tone. Use mild emojis.'
  },
  {
    id: 'instagram',
    name: 'Instagram Grid',
    icon: 'Instagram',
    color: 'text-pink-400',
    bgColor: 'bg-pink-950/20',
    borderColor: 'border-pink-500/20',
    placeholder: 'Write an aesthetic, highly interactive grid caption...',
    optimalLength: '150 - 320 chars',
    bestTime: 'Friday 11:30 AM',
    recommendation: 'Grab attention in the first 4 words. Use clear spacing dividers. Move hashtags to the footer.'
  },
  {
    id: 'wordpress',
    name: 'WordPress Blog',
    icon: 'BookOpen',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/20',
    borderColor: 'border-cyan-500/20',
    placeholder: 'Write an SEO-rich, comprehensive article outline and summary hooks...',
    optimalLength: '1,500 - 3,000 words',
    bestTime: 'Monday 8:00 AM',
    recommendation: 'Organize using clean markdown headings (H2, H3). Structure with an introduction, key lessons, and clear CTAs.'
  },
  {
    id: 'medium',
    name: 'Medium Story',
    icon: 'PenTool',
    color: 'text-teal-400',
    bgColor: 'bg-teal-950/20',
    borderColor: 'border-teal-500/20',
    placeholder: 'Write a narrative thought piece with rich story arcs and lessons...',
    optimalLength: '1,000 - 2,200 words',
    bestTime: 'Thursday 10:00 AM',
    recommendation: 'Lead with an immersive personal story or failure-to-success path. Prioritize editorial readability.'
  },
  {
    id: 'newsletter',
    name: 'Conversational Newsletter',
    icon: 'Mail',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/30',
    placeholder: 'Write a deep-dive value post, tutorial, or direct email pitch...',
    optimalLength: '1,500 - 3,000 chars',
    bestTime: 'Thursday 7:30 AM',
    recommendation: 'Open with a warm, personal greeting. Write in active present tense. Break into skimmable subheadings.'
  },
  {
    id: 'video',
    name: 'Video / YouTube script',
    icon: 'Youtube',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/30',
    placeholder: 'Write an opening hook, intro, or call-to-action description...',
    optimalLength: '30-second read intro',
    bestTime: 'Sunday 2:00 PM',
    recommendation: 'Start with an immediate "open loop" query. Use high rhythmic shifts. Include visual cues in brackets.'
  }
];

export const PRELOADED_DRAFTS: TemplateDraft[] = [
  {
    id: 'template-startup',
    title: '🚀 SaaS Launcher Release',
    category: 'Product Launch',
    audience: 'Agencies & SMB Owners',
    text: `Just launched Synapse Sync! We have been working on this for 6 months because managing client accounts across 4 different platforms was driving our agency team crazy. Hootsuite kept dropping connections, and drafting individual posts for LinkedIn, Twitter, and email took all day. 

Synapse Sync is an AI co-pilot. It takes one raw draft and rewrites it perfectly for each channel. Starter plan is $10/mo, Pro is $100/mo. Check it out now!`
  },
  {
    id: 'template-educational',
    title: '💡 Marketing Wisdom Hook',
    category: 'Educational Growth',
    audience: 'Professional Creators',
    text: `Most brands make the mistake of cross-posting the exact same copy. They write for LinkedIn and then copy-paste it to X and their newsletter. This is lazy and hurts engagement. X requires high density, LinkedIn requires story hooks, and newsletters require personal warmth. If you don't optimize for each platform algorithm, you will get zero reach.`
  },
  {
    id: 'template-case-study',
    title: '📊 SMB 4x Reach Breakthrough',
    category: 'Case Study',
    audience: 'Small-Medium Businesses',
    text: `We helped an organic soap business go from 2k impressions/mo to 45k impressions/mo without spending a single dollar on ads. How? We optimized their content structure. Instead of posting product links, we turned their manufacturing process into mini educational visual stories tailored specifically for each channel. Our tool Synapse Sync makes this effortless.`
  }
];

// Helper to generate dynamic, intelligent platform variations on custom text entered by the user
export function generatePlatformOptimization(rawContent: string, channelId: string): {
  content: string;
  hookType: string;
  toneScore: number;
  readabilityScore: number;
  reachMultiplier: number;
  diagnosticTags: string[];
  keyChangeDescription: string;
  hashtags: string[];
  tips: string[];
} {
  const text = rawContent || "Just launched our brand new masterclass! Learn how to scale your brand to 10k follower base without burnout in 30 days.";
  
  // Extract custom hooks or keywords to make it customized
  const firstSentence = text.split(/[.!?]/).filter(t => t.trim().length > 0)[0] || text;
  const capitalizedHook = firstSentence.trim();

  switch (channelId) {
    case 'linkedin':
      return {
        hookType: "Narrative Bridge Hook",
        toneScore: 92,
        readabilityScore: 88,
        reachMultiplier: 2.8,
        diagnosticTags: ["High Hook Score", "Optimized Paragraph Density", "Story Loop Active"],
        keyChangeDescription: "Injected a professional story loop in the first line. Restructured into double-spaced paragraphs and converted lists to bullet points with clear vertical separation.",
        content: `📈 Unpopular opinion: Most marketing channels are failing not because the idea is bad, but because the format is lazy.

${capitalizedHook}.

Here is the realistic breakdown of how high-growth teams are actually solving this:

1️⃣ Stop cross-posting raw text. LinkedIn requires professional narrative loops rather than sterile links.
2️⃣ Inject social proof. People connect with operator insights, not generic company PR lines.
3️⃣ Create immediate dialogue. Ask questions that challenge the status quo rather than begging for likes.

The cost of staying mediocre is compounding. Agree or disagree? Let me know in the comments below. 👇`,
        hashtags: ["#ContentStrategy", "#MarketingOperations", "#B2BGrowth", "#SynapseMastery"],
        tips: [
          "Wait 45 minutes before replying to comments to let the algorithm pool initial traffic.",
          "Keep links in the organic body; the 'link-in-comments' penalty is now active again."
        ]
      };

    case 'x':
      // Shorten the content down drastically
      const xCore = text.length > 140 ? text.substring(0, 140) + "..." : text;
      return {
        hookType: "High-Beta Density Hook",
        toneScore: 87,
        readabilityScore: 94,
        reachMultiplier: 3.1,
        diagnosticTags: ["Peak Density", "High Impact Syntax", "Low Adjective Count"],
        keyChangeDescription: "Condensed character footprint by 75%. Stripped flowery language, introduced structural numbering, and structured hook for instant visual processing during infinite scroll.",
        content: `Universal scheduling is dead. Multi-channel mastery is born.

Here is the truth about:
"${capitalizedHook.length > 80 ? capitalizedHook.substring(0, 80) + '...' : capitalizedHook}"

- Lazy cross-posting dilutes engagement by 84%
- Tailored formatting drives 3.4x higher click-throughs
- Context-aware hooks win the feed

Stop posting blind. Synapse Sync does this rewrite automatically. 👇`,
        hashtags: ["#marketing", "#buildinpublic"],
        tips: [
          "Format as a tweet-thread starter; X's algorithm boosts initial posts with thread extensions.",
          "Avoid repeating more than 2 high-frequency words in a single line."
        ]
      };

    case 'facebook':
      return {
        hookType: "Community Connection Hook",
        toneScore: 90,
        readabilityScore: 91,
        reachMultiplier: 2.1,
        diagnosticTags: ["Highly Conversational", "Relation Centric", "Organic Reach Ready"],
        keyChangeDescription: "Shifted tone from high-pressure jargon to a warmer, friendly community dialogue. Included social proof points and invited audience members to comment with questions.",
        content: `👋 Hey everyone! Quick question for this amazing group: have you ever felt completely overwhelmed trying to keep up with marketing on multiple channels at once?

Here's the honest story behind: 
"${capitalizedHook}"

We talk to creators and small business owners every day who are burnt out from constant copy-pasting. That's why we're focusing on intelligent, automated channel tailoring. When you customize the message for each platform, the results absolutely speak for themselves.

What platforms are you currently focusing your energy on this month? Let's discuss in the comments below! 💬👇`,
        hashtags: ["#DigitalMarketing", "#SmallBizOwner", "#ContentCreation", "#AgencyLife"],
        tips: [
          "Upload native high-resolution images. Facebook vastly de-prioritizes text-only updates in newsfeeds.",
          "Reply to comments within the first solid 2 hours to trigger the local community bubble index."
        ]
      };

    case 'instagram':
      return {
        hookType: "Visual Aesthetic Hook",
        toneScore: 89,
        readabilityScore: 86,
        reachMultiplier: 2.5,
        diagnosticTags: ["High Aesthetic Score", "Emoji Scannable", "CTA Anchor Ready"],
        keyChangeDescription: "Dramatically increased visual readability by inserting line breakers, using expressive visual emojis, and cleanly segmenting actionable calls-to-action from tags.",
        content: `✨ STOP DOING THIS ✨

Most teams are burning 5+ hours a day rewriting content across their feeds. Here's how to actually fix it:

🌿 Tailor, don't copy-paste
🎯 Grab attention in the first 4 words
🔑 Focus heavily on context matching

Our focus with "${capitalizedHook.length > 50 ? capitalizedHook.substring(0, 50) + '...' : capitalizedHook}" is exactly that: automated platform mastery.

Drop a 'SYNC' below and we'll DM you our private strategy checklist! 📩👇
.
.
.`,
        hashtags: ["#ContentCreator", "#InstagramGrowth", "#AestheticFeed", "#SocialMediaAgency", "#SynapseSync"],
        tips: [
          "Post as a carousel post structure. Instagram re-serves carousels to users who scrolled past the first slide.",
          "Include a clear prompt to 'Save this post' - saves are weighted 5x heavier than likes in current grids."
        ]
      };

    case 'wordpress':
      return {
        hookType: "SEO Keyword-Enriched Heading Outline",
        toneScore: 95,
        readabilityScore: 82,
        reachMultiplier: 2.9,
        diagnosticTags: ["SEO Optimized", "Strong Semantics", "H2-H3 Structural Layout"],
        keyChangeDescription: "Transformed short text into a complete, deep blog structure. Added optimized subheadings (H2, H3) to capture high-volume search intent and defined clear informational segments.",
        content: `# The Ultimate Guide to Multi-Channel Marketing Optimization

Managing distribution is the single biggest bottleneck for modern marketing agencies and fast-growing brands today. 

Let's dive into:
"${capitalizedHook}"

## Why Generic Cross-Posting is Killing Your Metric Goals
When you copy-paste the exact same copy across social feeds, blogs, and emails, you ignore the core psychology of each platform. Users visit different sites for completely unique reasons.

### 1. Social Channels Demand Rapid Visual Storytelling
LinkedIn and X are built for scroll-stopping hooks and rapid, high-density value.

### 2. Blogs Demand High Informational Intent
WordPress and Medium require deeply descriptive, structured analysis that Answers Google queries directly.

## Standardizing Your Brand Strategy with Synapse Sync
Rather than manually spending four hours rewriting essays, our AI-assisted publishing flow allows creators to optimize their reach in under five minutes.

### Key Results of Bespoke Distribution:
- 3.4x average click-through-rate boost
- 84% reduction in manual content production labor
- Consistent, cohesive messaging across your entire digital presence

**Are you ready to claim continuous growth?** Check out our Starter ($10/mo) and Pro ($100/mo) options today to claim free automated marketing audits.`,
        hashtags: ["WordPress", "SEO", "ContentMarketing", "DigitalAgency"],
        tips: [
          "Configure your focus keyphrase as 'Multi-Channel Marketing' in Yoast SEO before pressing publish.",
          "Include alt-text captions describing every single image asset to optimize on Google Image search indexing."
        ]
      };

    case 'medium':
      return {
        hookType: "Narrative Growth Story Arc",
        toneScore: 94,
        readabilityScore: 89,
        reachMultiplier: 2.7,
        diagnosticTags: ["Compelling Narrative", "Intellectual Warmth", "High Story Score"],
        keyChangeDescription: "Molded content into an elegant, thought-provoking editorial style. Set a personal tone that emphasizes continuous learning and sharing hard-learned lessons.",
        content: `### We Spent 6 Months Trying to Master Multi-Channel Distribution. Here's what we learned.

The feedback loop is brutal.

You spend hours crafting an amazing story. You're proud of it. But when you schedule it across all platforms, you hear absolute crickets on half of them. 

Let's look at the core reality:
"${capitalizedHook}"

Most business owners assume that putting their content onto more platforms is a direct win. But lazy syndication without platform optimization actually works against you. The algorithms penalize non-native behaviors instantly.

Here are the three rules we developed to guide our agency clients:
- **Write natively always:** If it looks like a tweet on LinkedIn, or a B2B announcement on Medium, it fails.
- **Invest in stop-points:** The first sentence of any Medium post must read like a high-end magazine opening.
- **Give value before links:** Readers want deep insights inside the page itself before click-navigating elsewhere.

This philosophy is what led to Synapse Sync. A simple, unified workspace to construct beautiful, intelligent variations without losing your week.

If you are managing distribution for client accounts or your own brand, what is your single biggest bottleneck right now? Let's discuss in the responses below.`,
        hashtags: ["Marketing", "#Business", "#Writing", "#StartupLife", "#Productivity"],
        tips: [
          "Submit this story to top publications like 'Better Marketing' or 'The Startup' for 10x organic reach.",
          "Highlight key sentences throughout the draft to visually break up text logs for quick readers."
        ]
      };

    case 'newsletter':
      return {
        hookType: "Conversational Value-First Hook",
        toneScore: 96,
        readabilityScore: 85,
        reachMultiplier: 2.3,
        diagnosticTags: ["High Warmth Index", "Subheading Scannability", "Clear Action Anchor"],
        keyChangeDescription: "Inserted personalization tokens, converted technical jargon into conversational narrative format, and anchored a clear, highly low-friction call-to-action.",
        content: `Hey friends,

Let's cut through the noise today. I want to talk about something that's been driving me absolutely crazy in the growth space: 

"${capitalizedHook}"

We see so many agencies and content creators pounding their heads against the wall, trying to keep up with publishing on 3+ platforms. They're spending hours manual-formatting, rewriting, and timing their releases. 

Here is what we discovered after analyzing over 10M impressions last quarter:
The channels are completely different subcultures. What feels authentic on LinkedIn feels like corporate jargon on X, and what gets read on X is too fragmented for an email.

### The Synapse Rule: Tailored Distribution
True distribution is not about posting more. It’s about tailoring the message automatically so every individual channel gets your absolute best thinking without wasting your week.

This is exactly why we spent 6 months building Synapse Sync—our active AI co-pilot that treats every channel like its native playground. 

Are you still doing this manually? Reply directly to this email with your main channel link—I'll personally run a free distribution-flow audit for you.

Best,
— The Synapse Team`,
        hashtags: [],
        tips: [
          "Use a short, curiosity-inducing subject line like: 'the cross-posting trap'",
          "Avoid using more than 3 hyperlinks to protect your email deliverability domain score."
        ]
      };

    case 'video':
      return {
        hookType: "The 3-Second Retention Loop",
        toneScore: 94,
        readabilityScore: 91,
        reachMultiplier: 2.6,
        diagnosticTags: ["High Hook retention", "Oral Rhythm Optimized", "Visual Cues Preloaded"],
        keyChangeDescription: "Restructured for oral presentation with pauses. Added visual suggestions in brackets [ ] and designed an immediate retention loop in the first 3 seconds.",
        content: `[Visual: Tight close-up on speaker, high energy. Soft ambient blue backlighting.]

Spoken: "Most content creators are flushing 80% of their reach down the toilet. And they don't even know it."

[Visual: Fast jump cut to side-scroll of massive, cluttered folders.]

Spoken: "They spent six hours writing a single awesome piece of content... and then they just... copy-pasted it. LinkedIn, X, video descriptions—exactly. the. same."

[Visual: Overlay graphic showing a red arrow plunging down.]

Spoken: "Here's what they should have done. They should have fed it to Synapse Sync. Watch this. One click, and it turns that raw draft into a bespoke LinkedIn story, an engineered X loop, and a newsletter that people actually open."

"${capitalizedHook.substring(0, 100)}..."

Spoken: "Stop scheduling. Start mastering. Hit the link in our bio for a 14-day free trial."`,
        hashtags: ["#ContentCreator", "#ShortsStrategy", "#VideoGrowth"],
        tips: [
          "Keep the first sentence under 10 words to ensure maximum viewer retention before the first skip option.",
          "Use dramatic visual punch cuts on pauses for high-speed engagement."
        ]
      };

    default:
      return {
        hookType: "Standard Adaptor",
        toneScore: 80,
        readabilityScore: 80,
        reachMultiplier: 1.0,
        diagnosticTags: ["Neutral Output"],
        keyChangeDescription: "Formatted for generic web reading.",
        content: text,
        hashtags: [],
        tips: []
      };
  }
}
