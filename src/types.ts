export interface ChannelConfig {
  id: string;
  name: string;
  icon: string; // Lucide icon name or indicator
  color: string;
  bgColor: string;
  borderColor: string;
  placeholder: string;
  optimalLength: string;
  bestTime: string;
  recommendation: string;
}

export interface OptimizationResult {
  content: string;
  hookType: string;
  toneScore: number; // 0-100
  readabilityScore: number; // 0-100
  reachMultiplier: number; // e.g. 2.4
  diagnosticTags: string[];
  keyChangeDescription: string;
  hashtags: string[];
  tips: string[];
}

export interface ChannelOptimizationMap {
  [channelId: string]: OptimizationResult;
}

export interface TemplateDraft {
  id: string;
  title: string;
  category: string;
  text: string;
  audience: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatarSeed: string;
  metricsAchieved: string;
  platformStrength: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  badge?: string;
}
