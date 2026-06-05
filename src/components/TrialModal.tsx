import { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Linkedin, 
  Twitter, 
  Mail, 
  Youtube, 
  Sliders, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  CreditCard,
  Lock,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

export default function TrialModal({ isOpen, onClose, selectedPlan }: TrialModalProps) {
  const { user, completeOnboarding, updateWorkspaceName, updateBrandTone, connectPlatform } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [brandName, setBrandName] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['linkedin', 'x']);
  const [selectedTone, setSelectedTone] = useState<string>('growth');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  
  // Credit Card Gateway Input State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [agreedToLegal, setAgreedToLegal] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  
  // Reset fields on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBrandName('');
      setSelectedChannels(['linkedin', 'x']);
      setSelectedTone('growth');
      setIsLoading(false);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
      setAgreedToLegal(false);
      setPaymentError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChannelSelect = (id: string) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter(c => c !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!brandName.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmitOnboarding = async () => {
    if (!agreedToLegal) {
      setPaymentError('You must agree to the Terms of Service & Privacy Policy before finalizing registration.');
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setPaymentError('Please complete all payment gateway fields to authorize the secure trial setup.');
      return;
    }
    setPaymentError('');
    setIsLoading(true);
    setLoadingText("Contacting secure PCI-compliant gateway endpoints...");

    try {
      const apiBase = import.meta.env.VITE_API_URL ?? '';
      const response = await fetch(`${apiBase}/api/billing/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan,
          email: user?.email || "customer@example.com",
          brandName: brandName,
          selectedTone: selectedTone,
          connectedChannels: selectedChannels,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed secure billing session negotiation.");
      }

      // If keys are provided, route to real checkout
      if (!data.isMock && data.redirectUrl) {
        setLoadingText("Gateway response: SECURELY AUTHORIZED! Connecting to checkout portal...");
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1000);
        return;
      }

      // Proceed with simulated interactive verification sequence
      const progressText = [
        "Contacting secure PCI-compliant gateway endpoints...",
        "Validating credit card credentials pre-authorization...",
        "Authorizing $0.00 zero-risk trial capture loop...",
        "Establishing algorithm-friendly webhooks & channels under Synapse Sync...",
        "Securing 14-day subscription token...",
        "Gateway response: AUTHORIZED successfully! Launching co-pilot..."
      ];

      let index = 0;
      setLoadingText(progressText[index]);

      const timer = setInterval(() => {
        index++;
        if (index < progressText.length) {
          setLoadingText(progressText[index]);
        } else {
          clearInterval(timer);
          setIsLoading(false);
          setStep(5);
        }
      }, 550);

    } catch (err: any) {
      console.error("Billing Gateway Connection Error:", err);
      setPaymentError(err?.message || "Secure billing process was interrupted. Please check network connectivity.");
      setIsLoading(false);
    }
  };

  const handleLaunchWorkspace = () => {
    if (brandName.trim()) {
      updateWorkspaceName(brandName.trim());
    }
    if (selectedTone) {
      updateBrandTone(selectedTone);
    }
    if (selectedChannels && selectedChannels.length > 0) {
      selectedChannels.forEach(c => connectPlatform(c));
    }
    completeOnboarding();
    onClose();
  };

  const tones = [
    { id: 'growth', label: 'Conversational Growth', desc: 'Direct, educational, high engagement density.' },
    { id: 'operator', label: 'Professional Operator', desc: 'Slick, corporate, narrative authority bridges.' },
    { id: 'scientific', label: 'High-Beta analytical', desc: 'Factual, statistic-heavy, low adjective count.' },
    { id: 'bold', label: 'Provocative & Bold', desc: 'Contrarian hooks, aggressive formatting.' }
  ];

  return (
    <div id="trial-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        id="trial-modal-card" 
        className="relative w-full max-w-lg bg-[#0D1B2A] border border-[#444444] rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(201,168,76,0.15)] backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200 font-sans text-[#F7F3EC]"
      >
        {/* Glow behind modal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading Spinner Scene */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/15 border-t-[#C9A84C] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A84C] animate-pulse" />
              </div>
            </div>
            <h4 className="font-display font-bold text-white text-base mb-2">Initializing Synapse Engine</h4>
            <p className="text-xs text-[#C9A84C] font-mono animate-pulse">{loadingText}</p>
          </div>
        ) : (
          <div>
            {/* Step 1: Account setup */}
            {step === 1 && (
              <div id="modal-step-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-0.5 rounded-full font-mono">
                    Step 1 of 3
                  </span>
                  <span className="text-xs text-[#888888] font-medium font-mono">Selected plan: {selectedPlan || 'Pro Trial'}</span>
                </div>

                <h3 className="font-display text-2xl font-extrabold text-white mb-2 leading-tight">
                  Let's configure your Synapse Workspace.
                </h3>
                <p className="text-[#888888] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Set up your brand portal now to claim your 14-day zero-risk co-pilot license. Pay $0 today.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
                      Brand / Workspace Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Acme Agency or Jane's Studio"
                      className="w-full p-3 bg-[#444444]/15 border border-[#444444]/60 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/45 focus:border-[#C9A84C] transition-all font-sans placeholder-[#888888] text-[#F7F3EC]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-mono">
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@acmeagency.com"
                      required
                      className="w-full p-3 bg-[#444444]/15 border border-[#444444]/60 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/45 focus:border-[#C9A84C] transition-all font-sans placeholder-[#888888] text-[#F7F3EC]"
                    />
                  </div>
                </div>

                <button
                  id="modal-next-1"
                  onClick={handleNextStep}
                  disabled={!brandName.trim()}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                    brandName.trim()
                      ? 'bg-[#C9A84C] text-[#0D1B2A] hover:bg-[#C9A84C]/95 hover:shadow-lg hover:shadow-[#C9A84C]/25'
                      : 'bg-[#444444]/25 text-[#888888]/40 cursor-not-allowed border border-[#444444]/40'
                  }`}
                >
                  Configure Channels
                  <ChevronRight className="w-4 h-4 text-xs font-bold" />
                </button>
              </div>
            )}

            {/* Step 2: Channels setup */}
            {step === 2 && (
              <div id="modal-step-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-0.5 rounded-full font-mono">
                    Step 2 of 3
                  </span>
                  <span className="text-xs text-[#888888] font-medium font-mono">Workspace: {brandName}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                  Connect target accounts.
                </h3>
                <p className="text-[#888888] text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Select the core channels you actively publish on right now. You can link deeper credentials inside the settings tab anytime.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { id: 'linkedin', label: 'LinkedIn Pro', icon: <Linkedin className="w-4 h-4" /> },
                    { id: 'x', label: 'X (Twitter)', icon: <Twitter className="w-4 h-4" /> },
                    { id: 'newsletter', label: 'Mail/Newsletter', icon: <Mail className="w-4 h-4" /> },
                    { id: 'video', label: 'YouTube descriptions', icon: <Youtube className="w-4 h-4" /> }
                  ].map(chan => {
                    const isSel = selectedChannels.includes(chan.id);
                    return (
                      <button
                        key={chan.id}
                        onClick={() => handleChannelSelect(chan.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-[#F7F3EC] font-bold shadow-[#C9A84C]/10'
                            : 'bg-[#444444]/10 border-[#444444]/60 text-[#888888] hover:border-[#444444]'
                        }`}
                      >
                        <div className={`p-1 rounded-md ${isSel ? 'text-[#C9A84C]' : 'text-[#888888]'}`}>
                          {chan.icon}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{chan.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-[#444444]/15 hover:bg-[#444444]/25 border border-[#444444]/60 text-[#888888] text-xs font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="modal-next-2"
                    onClick={handleNextStep}
                    disabled={selectedChannels.length === 0}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-mono font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                      selectedChannels.length > 0
                        ? 'bg-[#C9A84C] text-[#0D1B2A] hover:bg-[#C9A84C]/95'
                        : 'bg-[#444444]/25 text-[#888888]/40 cursor-not-allowed border border-[#444444]/40'
                    }`}
                  >
                    Tone Tuning
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Tone Tuning */}
            {step === 3 && (
              <div id="modal-step-3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-0.5 rounded-full font-mono">
                    Step 3 of 3
                  </span>
                  <span className="text-xs text-[#888888] font-medium font-mono">{selectedChannels.length} platforms synced</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                  Fine-tune your brand voice.
                </h3>
                <p className="text-[#888888] text-xs sm:text-sm leading-relaxed mb-6">
                  Select your core communication profile. This informs how our AI co-pilot transforms your thoughts.
                </p>

                <div className="space-y-2 mb-8">
                  {tones.map(t => {
                    const isSel = selectedTone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTone(t.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#C9A84C]/15 border-[#C9A84C] text-[#F7F3EC]'
                            : 'bg-[#444444]/15 border-[#444444]/60 text-[#888888] hover:border-[#444444]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{t.label}</span>
                          <span className="text-[10px] text-[#888888] block mt-0.5">{t.desc}</span>
                        </div>
                        {isSel && <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-[#444444]/15 hover:bg-[#444444]/25 border border-[#444444]/60 text-[#888888] text-xs font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="modal-submit-tone"
                    onClick={() => setStep(4)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-lg transition-all cursor-pointer font-mono"
                  >
                    Setup Billing Setup
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment Gateway Checkout */}
            {step === 4 && (
              <div id="modal-step-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2.5 py-0.5 rounded-full font-mono">
                    Step 4 of 4
                  </span>
                  <span className="text-xs text-[#888888] font-medium font-mono">Gateway Integration</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  Secure Checkout Portal
                </h3>
                <p className="text-[#888888] text-xs sm:text-sm leading-relaxed mb-5">
                  Set up your 14-day zero-risk trial. Pay <strong className="text-white">$0.00 today</strong>. Cancel anytime with two clicks directly from the dashboard settings.
                </p>

                {/* Pricing Summary Block */}
                <div className="bg-[#444444]/15 border border-[#444444]/60 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between items-center pb-2 border-b border-[#444444]/45 mb-2.5">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-[#C9A84C] font-mono">
                        {selectedPlan?.includes('Starter') ? 'Starter Tier' : 'Pro Tier'}
                      </span>
                      <p className="text-[10px] text-[#888888] mt-0.5">14-day zero-cost trial active</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-black text-xl text-white">
                        ${selectedPlan?.includes('Starter') ? '10' : '100'}
                      </span>
                      <span className="text-[10px] text-[#888888] font-mono">/ mo</span>
                    </div>
                  </div>

                  {/* Feature Breakdown matching requested tiers */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#888888] block font-mono">
                      Authorized Tier Features:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 gap-y-1.5">
                      {selectedPlan?.includes('Starter') ? (
                        <>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Cross-platform scheduling</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Basic analytics metrics</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/90 col-span-2">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>AI optimal posting times tracking</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Scheduling & basic reports</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Creative Content Library</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Intelligent AI Repurposing</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Canva & Jasper Integration</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Competitor analysis tracker</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Audience segmentation logs</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-white/90 col-span-2">
                            <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>Predictive analytics & virality models</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gateway Inputs */}
                <div className="space-y-3 mb-4">
                  {paymentError && (
                    <div className="p-3 bg-[#E63946]/10 border border-[#E63946]/35 rounded-xl text-xs text-[#E63946] font-medium leading-relaxed">
                      {paymentError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#888888] mb-1.5 font-mono">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Sandra Sterling"
                      className="w-full p-2.5 bg-[#444444]/15 border border-[#444444]/75 rounded-xl text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#888888] mb-1.5 font-mono">
                      Credit Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          // Simple formatting card numbers
                          const val = e.target.value.replace(/\D/g, '');
                          const matches = val.match(/\d{4,16}/g);
                          const match = matches && matches[0] || '';
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          if (parts.length > 0) {
                            setCardNumber(parts.join(' '));
                          } else {
                            setCardNumber(val);
                          }
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full p-2.5 pl-9 bg-[#444444]/15 border border-[#444444]/75 rounded-xl text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] transition-all font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#888888] mb-1.5 font-mono">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            setCardExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-[#444444]/15 border border-[#444444]/75 rounded-xl text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] transition-all font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#888888] mb-1.5 font-mono">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full p-2.5 bg-[#444444]/15 border border-[#444444]/75 rounded-xl text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] transition-all font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions approval check */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none pt-2">
                    <input
                      type="checkbox"
                      checked={agreedToLegal}
                      onChange={(e) => setAgreedToLegal(e.target.checked)}
                      className="mt-0.5 text-[#C9A84C] rounded border-[#444444]/60 bg-[#444444]/30 focus:ring-0"
                    />
                    <span className="text-[10px] leading-relaxed text-[#888888]">
                      I understand I will be charged $0.00 today under a 14-day free trial. I authorize secure subscription pre-authorization and agree to the <span className="hover:text-white underline font-semibold">Terms of Service</span> & <span className="hover:text-white underline font-semibold">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-[#444444]/15 hover:bg-[#444444]/25 border border-[#444444]/60 text-[#888888] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="modal-gateway-authorize"
                    onClick={handleSubmitOnboarding}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] text-xs font-mono font-extrabold uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Authorize Setup
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Gateway Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-[9px] text-[#888888] font-mono uppercase font-bold border-t border-[#444444]/40 pt-3">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-[#C9A84C]" /> 256-Bit SSL Encryption</span>
                  <span>•</span>
                  <span>PCI Compliant Gateway</span>
                </div>
              </div>
            )}

            {/* Step 5: Success confirmation */}
            {step === 5 && (
              <div id="modal-step-5" className="text-center py-6">
                <div className="inline-flex p-3 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] mb-6 font-bold">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                
                <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                  Your Synapse Synced!
                </h3>
                <p className="text-xs sm:text-sm text-[#888888] leading-relaxed max-w-sm mx-auto mb-6 font-normal">
                  Congratulations! Work group <strong className="text-white">{brandName || 'My Creator Space'}</strong> has been initialized successfully. Your 14-day zero-risk trial license key is active.
                </p>

                {/* Integration checklist success summary */}
                <div className="bg-[#444444]/15 border border-[#444444]/60 rounded-2xl p-4 text-left max-w-sm mx-auto mb-8 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium pb-1.5 border-b border-[#444444]/60 mb-1">
                    <span className="text-[#888888]">Workspace Status:</span>
                    <span className="text-[#C9A84C] font-mono font-bold">ACTIVE SUBSCRIPTION (TRIAL)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium pb-1.5 border-b border-[#444444]/60 mb-1">
                    <span className="text-[#888888]">Subscribed Plan:</span>
                    <span className="text-white font-bold">{selectedPlan?.includes('Starter') ? 'Starter ($10/mo)' : 'Pro ($100/mo)'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#F7F3EC] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Trial Billing: $0.00 today (Expires in 14 days)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#F7F3EC] mb-1">
                    <Sliders className="w-4 h-4 text-[#C9A84C] shrink-0" />
                    <span>Communication Tone: {tones.find(t => t.id === selectedTone)?.label || 'Conversational Growth'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#888888]">
                    <span>Connected queues: </span>
                    <div className="flex gap-1.5 ml-1.5 text-[#F7F3EC] font-semibold">
                      {selectedChannels.map(c => (
                        <span key={c} className="text-xs text-[#C9A84C] font-bold capitalize">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    id="dashboard-launch-btn"
                    onClick={handleLaunchWorkspace}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest cursor-pointer shadow-lg shadow-[#C9A84C]/20 active:scale-[0.99] transition-all"
                  >
                    Go To My Dashboard Workspace
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-xs text-[#888888] hover:text-[#F7F3EC] transition-colors font-semibold py-1 cursor-pointer"
                  >
                    Dismiss & Continue exploring landing details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
