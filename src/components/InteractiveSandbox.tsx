import React, { useState } from 'react';
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Youtube, 
  Sparkles, 
  Check, 
  Copy, 
  RotateCcw,
  Sliders, 
  Gauge, 
  Lightbulb, 
  ArrowUpRight, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { PRELOADED_DRAFTS, CHANNEL_METADATA, generatePlatformOptimization } from '../templates';
import { ChannelOptimizationMap } from '../types';

export default function InteractiveSandbox({ onOpenTrial }: { onOpenTrial?: (plan?: string) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template-startup');
  const [customText, setCustomText] = useState<string>(PRELOADED_DRAFTS[0].text);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['linkedin', 'x', 'newsletter', 'video']);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [optimizedOutputs, setOptimizedOutputs] = useState<ChannelOptimizationMap | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<string>('linkedin');

  // Templates handler
  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const doc = PRELOADED_DRAFTS.find(d => d.id === id);
    if (doc) {
      setCustomText(doc.text);
      // Reset output if switching template
      setOptimizedOutputs(null);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedTemplate('custom');
    setCustomText(e.target.value);
    setOptimizedOutputs(null);
  };

  const toggleChannel = (id: string) => {
    if (selectedChannels.includes(id)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== id));
      }
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
    setOptimizedOutputs(null);
  };

  // Run simulated optimization
  const runOptimization = () => {
    if (!customText.trim()) return;
    setIsProcessing(true);
    setOptimizedOutputs(null);

    const steps = [
      "Deconstructing raw input semantics...",
      "Extracting core hook proposals & taglines...",
      "Analyzing tone contours & readability scales...",
      "Mapping brand parameters for selected ecosystems...",
      "Injecting algorithm-compliant formatting rules...",
      "Compiling tailored multi-platform copy boards..."
    ];

    let currentStepIndex = 0;
    setProcessingStep(steps[currentStepIndex]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setProcessingStep(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        
        // Build actual outputs
        const results: ChannelOptimizationMap = {};
        selectedChannels.forEach(chan => {
          results[chan] = generatePlatformOptimization(customText, chan);
        });

        setOptimizedOutputs(results);
        setIsProcessing(false);
        // Default to first active tab
        if (selectedChannels.length > 0) {
          setActiveTab(selectedChannels[0]);
        }
      }
    }, 400);
  };

  const copyToClipboard = (text: string, channelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [channelId]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [channelId]: false });
    }, 2000);
  };

  const getChannelIcon = (id: string, sizeClass = "w-5 h-5") => {
    switch (id) {
      case 'linkedin': return <Linkedin className={sizeClass} />;
      case 'x': return <Twitter className={sizeClass} />; // using Twitter icon from Lucide
      case 'newsletter': return <Mail className={sizeClass} />;
      case 'video': return <Youtube className={sizeClass} />;
      default: return <Sparkles className={sizeClass} />;
    }
  };

  return (
    <section id="demo" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0D1B2A] border-t border-b border-[#444444]/40 overflow-hidden">
      {/* Background spot */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-[#C9A84C]/5 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative text-[#F7F3EC]">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider mb-4 font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            See the AI Co-Pilot in Action
          </h2>
          <p className="text-[#888888] mt-4 text-sm sm:text-base font-normal">
            Stop guessing. Input standard raw content below, select target systems, and click sync to see how Synapse tailors structure and style for premium reach.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Col-5) */}
          <div className="lg:col-span-5 bg-[#444444]/15 rounded-3xl border border-[#444444]/85 p-6 shadow-2xl relative backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#444444]/60">
              <div className="flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#C9A84C]" />
                <span className="font-display font-bold text-[#F7F3EC]">Draft Optimizer Controls</span>
              </div>
              {selectedTemplate !== 'template-startup' && (
                <button 
                  onClick={() => handleTemplateSelect('template-startup')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Template Selector */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-2.5 font-mono">
                Load Sample Draft Template
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PRELOADED_DRAFTS.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedTemplate === tpl.id
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]/50 text-[#F7F3EC]'
                        : 'bg-[#444444]/15 border-[#444444]/60 text-[#888888] hover:border-[#444444] hover:bg-[#444444]/25'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-[#F7F3EC] text-sm">{tpl.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#0D1B2A]/85 text-[9px] text-[#888888] font-mono font-normal">
                        {tpl.category}
                      </span>
                    </div>
                    <span className="line-clamp-1 text-[#888888] font-normal">{tpl.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-widest font-mono">
                  Raw Entry / Draft Ideation
                </label>
                <span className="text-[10px] text-[#888888] font-mono">
                  {customText.length} characters
                </span>
              </div>
              <textarea
                value={customText}
                onChange={handleCustomTextChange}
                maxLength={4000}
                placeholder="Type or paste your raw draft here..."
                className="w-full h-44 p-4 rounded-xl bg-[#444444]/15 border border-[#444444]/60 text-sm text-[#F7F3EC] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:border-[#C9A84C] transition-all font-sans leading-relaxed resize-none shadow-inner"
              />
            </div>

            {/* Multi-Channel Checklist */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-widest mb-3 font-mono">
                Select Distribution Targets
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {CHANNEL_METADATA.map(meta => {
                  const isSelected = selectedChannels.includes(meta.id);
                  return (
                    <button
                      key={meta.id}
                      onClick={() => toggleChannel(meta.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? `bg-[#444444]/30 border-[#C9A84C] text-[#F7F3EC]`
                          : 'bg-transparent border-transparent text-[#888888] hover:text-[#888888]/80'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg border transition-colors ${
                        isSelected 
                          ? `bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C]`
                          : 'bg-[#444444]/20 border-[#444444]/60 text-[#888888]'
                      }`}>
                        {getChannelIcon(meta.id, "w-4 h-4")}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold">{meta.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-[#888888] hidden sm:block font-mono">{meta.optimalLength.split(' ')[0]} chars</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Button */}
            <button
              id="sync-button"
              onClick={runOptimization}
              disabled={isProcessing || !customText.trim()}
              className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all ${
                isProcessing
                  ? 'bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] cursor-not-allowed'
                  : 'bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] cursor-pointer active:scale-[0.99] shadow-lg shadow-[#C9A84C]/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin" />
                  <span>Processing Rules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sync & Optimize with AI Co-Pilot</span>
                </>
              )}
            </button>

          </div>

          {/* Outputs Panel (Col-7) */}
          <div className="lg:col-span-7 h-full flex flex-col">
            
            {/* If Not Run Yet & Not Processing */}
            {!isProcessing && !optimizedOutputs && (
              <div id="sandbox-initial-placeholder" className="flex-1 min-h-[580px] flex flex-col items-center justify-center border border-dashed border-[#444444]/60 rounded-3xl p-10 text-center bg-[#444444]/10 backdrop-blur-md">
                <div className="p-4 rounded-full bg-[#444444]/20 text-[#C9A84C]/65 border border-[#444444]/60 mb-6 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">Engage the Synapse Core</h3>
                <p className="text-sm text-[#888888] max-w-sm leading-relaxed">
                  Click 'Sync & Optimize with AI Co-Pilot' on the left to watch how your thoughts get customized into a full omni-channel optimized masterboard.
                </p>
              </div>
            )}

            {/* If Processing Screen */}
            {isProcessing && (
              <div id="sandbox-processing-loader" className="flex-1 min-h-[580px] flex flex-col items-center justify-center border border-[#444444]/80 rounded-3xl p-8 bg-[#444444]/15 backdrop-blur-xl">
                <div className="relative w-24 h-24 mb-8">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/25 border-t-[#C9A84C] animate-spin" />
                  {/* Inner pulsing nucleus */}
                  <div className="absolute inset-4 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 animate-ping" />
                  <div className="absolute inset-5 rounded-full bg-[#444444]/35 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                </div>

                <h4 className="font-display font-semibold text-white text-base mb-2">Analyzing Platform Parameters</h4>
                <div className="h-6 overflow-hidden max-w-xs text-center">
                  <p className="text-xs text-[#C9A84C] font-mono animate-pulse">
                    {processingStep}
                  </p>
                </div>

                {/* Animated steps checklists */}
                <div className="mt-8 space-y-2 text-left bg-[#444444]/20 border border-[#444444]/80 rounded-2xl p-4 w-72">
                  <div className="flex items-center gap-2.5 text-xs text-[#C9A84C] font-medium font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Raw syntax parsed successfully</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#C9A84C]/80 font-medium font-mono">
                    <div className="w-4 h-4 rounded-full border border-[#C9A84C] border-t-transparent animate-spin shrink-0" />
                    <span>Adapting tone profiles...</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#888888] font-mono uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#888888] ml-1.5 shrink-0" />
                    <span>Formatting markdown block anchors</span>
                  </div>
                </div>
              </div>
            )}

            {/* If Output Ready */}
            {optimizedOutputs && (
              <div id="sandbox-outputs-container" className="flex-grow bg-[#444444]/15 rounded-3xl border border-[#444444]/85 p-6 flex flex-col shadow-2xl relative backdrop-blur-xl min-h-[580px]">
                
                {/* Horizontal Channels Select Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#444444]/60 pb-4 mb-6">
                  {selectedChannels.map(chanId => {
                    const meta = CHANNEL_METADATA.find(c => c.id === chanId)!;
                    const isActive = activeTab === chanId;
                    const metrics = optimizedOutputs[chanId];
                    return (
                      <button
                        key={chanId}
                        onClick={() => setActiveTab(chanId)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isActive
                            ? `bg-[#C9A84C]/15 border-[#C9A84C]/40 text-white`
                            : 'bg-transparent border-transparent text-[#888888] hover:text-[#F7F3EC]'
                        }`}
                      >
                        <span className={isActive ? 'text-[#C9A84C]' : 'text-[#888888]'}>
                          {getChannelIcon(chanId, "w-3.5 h-3.5")}
                        </span>
                        <span>{meta.name}</span>
                        {metrics && (
                          <span className="ml-1 px-1.5 py-0.2 rounded bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-mono">
                            {metrics.reachMultiplier}x
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Display Channel Board */}
                {selectedChannels.map(chanId => {
                  if (activeTab !== chanId) return null;
                  
                  const meta = CHANNEL_METADATA.find(c => c.id === chanId)!;
                  const data = optimizedOutputs[chanId];

                  if (!data) return null;

                  return (
                    <div key={chanId} className="flex-1 flex flex-col animate-in fade-in ease-out duration-150">
                      
                      {/* Top Metrics Block */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        
                        <div className="bg-[#444444]/20 rounded-xl border border-[#444444]/60 p-3 text-center">
                          <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1 font-mono">
                            Reach Multiplier
                          </span>
                          <span className="font-display font-extrabold text-2xl text-[#C9A84C] flex items-center justify-center gap-1 leading-tight">
                            {data.reachMultiplier}x
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                          <span className="text-[9px] text-[#888888] font-mono uppercase">vs. Raw Copy</span>
                        </div>

                        <div className="bg-[#444444]/20 rounded-xl border border-[#444444]/60 p-3 text-center">
                          <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1 font-mono">
                            Hook Adaptation
                          </span>
                          <span className="font-display font-bold text-[11px] text-[#F7F3EC] leading-tight block mb-1 mt-1 truncate">
                            {data.hookType}
                          </span>
                          <span className="text-[9px] text-[#888888] block font-mono uppercase font-normal">Behavior Formula</span>
                        </div>

                        <div className="bg-[#444444]/20 rounded-xl border border-[#444444]/60 p-3 text-center">
                          <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1 font-mono">
                            Tone Profile Score
                          </span>
                          <span className="font-display font-extrabold text-2xl text-[#F7F3EC] leading-tight inline-block my-0.5">
                            {data.toneScore}%
                          </span>
                          <span className="text-[9px] text-[#888888] block font-mono uppercase">Brand Aligned</span>
                        </div>

                        <div className="bg-[#444444]/20 rounded-xl border border-[#444444]/60 p-3 text-center">
                          <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block mb-1 font-mono">
                            Readability Score
                          </span>
                          <span className="font-display font-extrabold text-2xl text-[#F7F3EC] leading-tight inline-block my-0.5">
                            {data.readabilityScore}%
                          </span>
                          <span className="text-[9px] text-[#888888] block font-mono uppercase">Flesch Index High</span>
                        </div>

                      </div>

                      {/* Content Box */}
                      <div className="relative flex-grow flex flex-col mb-4 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-[#444444]/60 bg-[#444444]/10">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] animate-pulse" />
                            <span className="text-[9px] font-mono text-[#888888] uppercase">BESPOKE GENERATED BOARD</span>
                          </div>
                          
                          <button
                            onClick={() => copyToClipboard(data.content, chanId)}
                            className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#C9A84C]/80 font-semibold px-2.5 py-1.5 rounded bg-[#C9A84C]/10 hover:bg-[#C9A84C]/25 transition-colors cursor-pointer"
                          >
                            {copiedStates[chanId] ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="p-4 overflow-y-auto flex-grow max-h-[280px]">
                          <p className="text-sm text-gray-300 font-sans whitespace-pre-line leading-relaxed font-normal">
                            {data.content}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Diagnostics / Rules Meta */}
                      <div className="p-4 bg-[#444444]/20 border border-[#444444]/70 rounded-2xl backdrop-blur-md gap-4 flex flex-col md:flex-row">
                        <div className="flex-grow">
                          <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5 font-mono">
                            <Gauge className="w-3.5 h-3.5 text-[#C9A84C]" />
                            Core Multi-Platform Rewrite Changes
                          </span>
                          <p className="text-xs text-[#888888] leading-relaxed font-normal mt-1">
                            {data.keyChangeDescription}
                          </p>
                          
                          {/* Tags block */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {data.diagnosticTags.map((tag, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[10px] text-[#C9A84C] font-mono uppercase font-bold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="md:w-64 border-t md:border-t-0 md:border-l border-[#444444]/60 md:pl-4 pt-3 md:pt-0">
                          <span className="text-[10px] text-[#888888] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5 font-mono">
                            <Lightbulb className="w-3.5 h-3.5 text-[#C9A84C]" />
                            Optimization Tip
                          </span>
                          <ul className="space-y-1">
                            {data.tips.map((tip, idx) => (
                              <li key={idx} className="text-[11px] text-[#888888] leading-normal flex items-start gap-1">
                                <span className="text-[#C9A84C] shrink-0 font-bold">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
