import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Linkedin, 
  Twitter, 
  Mail, 
  Youtube, 
  Globe, 
  BookOpen, 
  Volume2, 
  ChevronRight, 
  ArrowRight, 
  Loader2,
  Lock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const AVAILABLE_PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn Professional',
    description: 'Perfect for B2B industry positioning, networking, and expert loops.',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'text-blue-400',
    borderColor: 'hover:border-blue-500/50',
    connectedColor: 'bg-blue-500/10 border-blue-500/50 text-blue-300'
  },
  {
    id: 'x',
    name: 'X / Twitter Feed',
    description: 'Perfect for rapid ideas, newsjacking, thread-building, and high hooks.',
    icon: <Twitter className="w-5 h-5" />,
    color: 'text-zinc-200',
    borderColor: 'hover:border-zinc-500/50',
    connectedColor: 'bg-zinc-500/10 border-zinc-500/55 text-zinc-300'
  },
  {
    id: 'newsletter',
    name: 'Newsletter / Substack',
    description: 'Perfect for value-dense teaching, direct emails, and sub-lists.',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/50',
    connectedColor: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
  },
  {
    id: 'video',
    name: 'YouTube Media/Shorts',
    description: 'Perfect for video scripts, high-impact titles, hooks, and summaries.',
    icon: <Youtube className="w-5 h-5" />,
    color: 'text-red-400',
    borderColor: 'hover:border-red-500/50',
    connectedColor: 'bg-red-500/10 border-red-500/50 text-red-300'
  },
  {
    id: 'medium',
    name: 'Medium / Blog Engine',
    description: 'Perfect for research deep dives, brand essays, and long SEO boards.',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-[#C9A84C]',
    borderColor: 'hover:border-[#C9A84C]/50',
    connectedColor: 'bg-[#C9A84C]/10 border-[#C9A84C]/50 text-[#C9A84C]'
  }
];

const TONAL_PROFILES = [
  {
    id: 'thought-leader',
    name: 'Thought Leader Positioning',
    description: 'Professional, consultative, authoritative. Uses strong hooks with vertical spacing to command industry authority.',
    badge: 'Highly B2B Compatible'
  },
  {
    id: 'viral-growth',
    name: 'High-Impact Hook & Hype',
    description: 'Punchy, highly readable, short paragraphs. Leverages counter-intuitive statements to trigger clicks during scroll.',
    badge: 'Creator Boost'
  },
  {
    id: 'educator',
    name: 'Value-Dense Classroom',
    description: 'Informative, clean, tutorial-minded. Focuses on data points, structured numbering, and zero-fluff explanations.',
    badge: 'High Conversion'
  },
  {
    id: 'conversational',
    name: 'Personal Co-pilot Warmth',
    description: 'Relatable, soft, narrative-based. Uses direct address "you" and informal punctuation to build deep personal connections.',
    badge: 'E-mail Native'
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, connectPlatform, disconnectPlatform, updateBrandTone, updateWorkspaceName, completeOnboarding } = useAuth();
  
  const [step, setStep] = useState<number>(1);
  const [typedWorkspace, setTypedWorkspace] = useState(user?.workspaceName || '');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [connectionLogs, setConnectionLogs] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('thought-leader');

  if (!user) return null;

  const handleNextStep = () => {
    if (step === 1) {
      if (typedWorkspace.trim()) {
        updateWorkspaceName(typedWorkspace.trim());
      }
      setStep(2);
    } else if (step === 2) {
      // Must connect at least 1 platform
      if (user.connectedPlatforms.length === 0) {
        // Fallback to auto connect linkedin to speed up
        handleLinkPlatform('linkedin');
      }
      setStep(3);
    } else if (step === 3) {
      updateBrandTone(selectedTone);
      setStep(4);
    } else if (step === 4) {
      completeOnboarding();
      onComplete();
    }
  };

  const handleLinkPlatform = (id: string) => {
    if (user.connectedPlatforms.includes(id)) {
      disconnectPlatform(id);
      return;
    }

    setIsConnecting(id);
    setConnectionLogs('Resolving OAuth endpoints ...');
    
    // Simulate animated API handshake
    setTimeout(() => {
      setConnectionLogs('Exchanging token credentials via TLS ...');
      setTimeout(() => {
        setConnectionLogs('Syncing platform templates & metadata ...');
        setTimeout(() => {
          connectPlatform(id);
          setIsConnecting(null);
          setConnectionLogs('');
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between text-[#F7F3EC] relative overflow-hidden font-sans">
      
      {/* Decorative background spots */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-[#C9A84C]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#444444]/40 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#888888] text-[#0D1B2A] shadow-md">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">
            Synapse<span className="text-[#C9A84C]">Sync</span> Setup
          </span>
        </div>
        <div className="text-xs text-[#888888] font-mono tracking-widest font-semibold uppercase">
          Step <span className="text-[#C9A84C]">{step}</span> of 4
        </div>
      </div>

      {/* Progress Bar indicator */}
      <div className="max-w-4xl mx-auto w-full mt-4 bg-[#444444]/20 h-1.5 rounded-full overflow-hidden relative z-10 border border-[#444444]/20">
        <div 
          className="bg-gradient-to-r from-[#C9A84C] to-[#888888] h-full rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* Central Content */}
      <div className="max-w-3xl mx-auto w-full py-12 flex-1 flex flex-col justify-center relative z-10">
        
        {step === 1 && (
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-5">
            <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest block mb-2 font-mono">
              Welcome, Content Architect
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Welcome to the 'AI Co-pilot for Multi-Platform Content Mastery'
            </h1>
            <p className="text-[#888888] text-sm sm:text-base mb-8 max-w-2xl">
              Synapse Sync converts your raw thoughts, campaigns, and announcements into algorithm-compliant reach leaders across all channels simultaneously. First, let's establish the name of your hub.
            </p>

            <div className="bg-[#444444]/15 border border-[#444444] rounded-2xl p-6 sm:p-8 mb-8">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#C9A84C] mb-2">
                Brand or Agency Workspace Name
              </label>
              <p className="text-[#888888] text-xs mb-4">
                This forms your local namespace and organizes your interconnected accounts.
              </p>
              <input
                type="text"
                value={typedWorkspace}
                onChange={(e) => setTypedWorkspace(e.target.value)}
                placeholder="e.g. Acme Media Lab"
                className="w-full text-base sm:text-lg p-3.5 bg-[#444444]/35 border border-[#444444] rounded-xl text-[#F7F3EC] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] placeholder-[#888888] transition-all font-sans font-medium"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!typedWorkspace.trim()}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C9A84C] text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-[#C9A84C]/95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                Configure Platform Connections
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-300">
            <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest block mb-2 font-mono">
              Interconnection Hub
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Connect Your First Distribution Channel
            </h1>
            <p className="text-[#888888] text-xs sm:text-sm mb-6">
              Connect at least one platform below to boot Synapse Sync! We integrate securely to read channel algorithms, tailor hooks, and optimize copy bounds.
            </p>

            {/* Simulated Handshake Logs */}
            {isConnecting && (
              <div className="mb-6 p-4 bg-[#0d1522] border border-[#C9A84C]/30 rounded-xl flex items-center gap-3.5 animate-pulse text-[#C9A84C] font-mono text-xs">
                <Loader2 className="w-5 h-5 animate-spin shrink-0 text-[#C9A84C]" />
                <div>
                  <span className="block font-bold">SYNLINK SECURE PROTOCOL ACTIVE</span>
                  <span className="text-[10px] text-[#888888]">{connectionLogs}</span>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-8">
              {AVAILABLE_PLATFORMS.map((plat) => {
                const isConnected = user.connectedPlatforms.includes(plat.id);
                return (
                  <div
                    key={plat.id}
                    onClick={() => !isConnecting && handleLinkPlatform(plat.id)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      isConnected
                        ? plat.connectedColor
                        : `bg-[#444444]/15 border-[#444444] ${plat.borderColor}`
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-[#444444]/30 text-[#888888]'}`}>
                        {plat.icon}
                      </div>
                      <div>
                        <span className="font-semibold text-sm block">{plat.name}</span>
                        <span className="text-xs text-[#888888] mt-0.5 block">{plat.description}</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      disabled={!!isConnecting}
                      className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isConnected
                          ? 'bg-[#C9A84C]/20 border border-[#C9A84C]/45 text-[#C9A84C]'
                          : 'bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A]'
                      }`}
                    >
                      {isConnected ? 'Linked ✓' : 'Connect Channel'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 text-xs uppercase tracking-wider font-bold text-[#888888] hover:text-[#F7F3EC] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Tune Writing Tone
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in duration-300">
            <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest block mb-2 font-mono">
              Platform Personalization
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Select Your Core AI Writing Tone
            </h1>
            <p className="text-[#888888] text-xs sm:text-sm mb-6">
              This governs how our AI drafts optimization contours, structure, hooks, and line heights. You can modify this in real-time within the workspace.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {TONAL_PROFILES.map((tone) => {
                const isSelected = selectedTone === tone.id;
                return (
                  <div
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-white shadow-md'
                        : 'bg-[#444444]/15 border-[#444444] hover:border-[#888888]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm tracking-tight">{tone.name}</span>
                        {isSelected && <CheckCircle2 className="w-4.5 h-4.5 text-[#C9A84C] shrink-0" />}
                      </div>
                      <p className="text-xs text-[#888888] leading-relaxed mb-4">{tone.description}</p>
                    </div>
                    <span className="inline-block px-2 py-0.5 bg-[#444444]/30 border border-[#444444] rounded-full text-[9px] font-mono uppercase tracking-wider text-[#C9A84C] w-fit">
                      {tone.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 text-xs uppercase tracking-wider font-bold text-[#888888] hover:text-[#F7F3EC] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Verify Configuration
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in duration-300 text-center py-6">
            <div className="inline-flex p-4 rounded-full bg-[#C9A84C]/25 text-[#C9A84C] mb-6 border border-[#C9A84C]/50 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <span className="text-[#C9A84C] text-xs font-mono font-bold uppercase tracking-widest block mb-2">
              Workspace Generated Successfully
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Synapse Sync Active
            </h1>
            <p className="text-[#888888] text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-normal">
              Congratulations! Your brand workspace <strong className="text-white">"{user.workspaceName}"</strong> has been securely initialized. Your connected channel integrations are synchronized and the AI co-pilot models are online.
            </p>

            <div className="bg-[#444444]/15 border border-[#444444] rounded-2xl p-5 text-left max-w-md mx-auto mb-8 space-y-3 font-medium">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#444444]/40">
                <span className="text-[#888888]">Channel Security:</span>
                <span className="text-[#C9A84C] font-mono font-bold">Simulated TLS-1.3 Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Compass className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>Selected Tone: {TONAL_PROFILES.find(t=>t.id===user.brandTone)?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>Connected distributions:</span>
                <div className="flex flex-wrap gap-1.5 ml-1.5 text-xs text-[#C9A84C]">
                  {user.connectedPlatforms.length > 0 ? (
                    user.connectedPlatforms.map(p => (
                      <span key={p} className="bg-[#C9A84C]/10 border border-[#C9A84C]/35 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#888888] italic">generic draft</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full max-w-sm py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#888888] text-[#0D1B2A] font-extrabold text-xs uppercase tracking-widest cursor-pointer hover:shadow-lg hover:shadow-[#C9A84C]/15 active:scale-[0.99] transition-all"
            >
              Enter Launch Dashboard Workspace
            </button>
          </div>
        )}

      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-4xl mx-auto w-full pt-6 border-t border-[#444444]/40 text-center text-[10px] text-[#888888] relative z-10">
        Synapse Sync operates in local mock integration loops. Standard telemetry constraints apply. Created for premium marketer evaluation.
      </div>

    </div>
  );
}
