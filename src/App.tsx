import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import InteractiveSandbox from './components/InteractiveSandbox';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import TrialModal from './components/TrialModal';
import AuthModal from './components/AuthModal';
import OnboardingFlow from './components/OnboardingFlow';
import DashboardWorkspace from './components/DashboardWorkspace';
import LegalModal from './components/LegalModal';

export default function App() {
  const { 
    user, 
    isLoading, 
    completeOnboarding, 
    updateWorkspaceName, 
    updateBrandTone, 
    connectPlatform 
  } = useAuth();
  
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success' && user) {
      const brand = params.get('brand');
      const tone = params.get('tone');
      const channelsStr = params.get('channels');
      
      if (brand) {
        updateWorkspaceName(decodeURIComponent(brand));
      }
      if (tone) {
        updateBrandTone(decodeURIComponent(tone));
      }
      if (channelsStr) {
        try {
          const decodedChannels = decodeURIComponent(channelsStr);
          const channels = JSON.parse(decodedChannels);
          if (Array.isArray(channels)) {
            // Unify keys safely
            channels.forEach(ch => {
              if (ch) connectPlatform(ch);
            });
          }
        } catch (e) {
          console.error("Failed to parse redirected channels params:", e);
        }
      }
      
      // Mark onboarding as complete to route safely to dashboard
      completeOnboarding();
      
      // Wash the url search parameters clean to maintain safety and pristine UX
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [user]);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');

  const handleOpenLegal = (tab: 'terms' | 'privacy') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const handleOpenTrial = (planName?: string) => {
    // If user is not logged in, route them to signup to lock in their trial account
    if (!user) {
      setAuthTab('signup');
      setIsAuthOpen(true);
    } else {
      if (planName) {
        setSelectedPlan(planName);
      } else {
        setSelectedPlan('Pro');
      }
      setIsTrialOpen(true);
    }
  };

  const handleScrollToDemo = () => {
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      const offset = 80; // Navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = demoElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const openLogin = () => {
    setAuthTab('login');
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthTab('signup');
    setIsAuthOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center text-[#F7F3EC] font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#C9A84C]/25 border-t-[#C9A84C] mb-4" />
        <span className="text-xs uppercase tracking-widest font-bold text-[#888888] font-mono">Synchronizing Workspace Portals...</span>
      </div>
    );
  }

  // Routing flows:
  if (user) {
    if (!user.hasCompletedOnboarding) {
      return (
        <OnboardingFlow onComplete={() => {}} />
      );
    } else {
      return (
        <DashboardWorkspace />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-gray-100 selection:bg-[#C9A84C]/30 selection:text-[#F7F3EC] antialiased overflow-x-hidden">
      
      {/* Navbar layer */}
      <Navigation onOpenTrial={handleOpenTrial} onOpenLogin={openLogin} />

      {/* Hero layer */}
      <Hero onOpenTrial={handleOpenTrial} onScrollToDemo={handleScrollToDemo} />

      {/* Demo layer */}
      <InteractiveSandbox onOpenTrial={handleOpenTrial} />

      {/* Features layer */}
      <Features />

      {/* Testimonials layer */}
      <Testimonials />

      {/* Pricing layer */}
      <Pricing onOpenTrial={handleOpenTrial} />

      {/* FAQ layer */}
      <FAQ />

      {/* Footer layer */}
      <Footer onOpenLogin={openLogin} onOpenSignup={openSignup} onOpenLegal={handleOpenLegal} />

      {/* Interactive Modal layer */}
      <TrialModal 
        isOpen={isTrialOpen} 
        onClose={() => setIsTrialOpen(false)} 
        selectedPlan={selectedPlan} 
      />

      {/* Robust User Credentials Portal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      {/* Compliance / Legal Privacy Portal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

    </div>
  );
}
