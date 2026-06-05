import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Mail, Lock, Building, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { signUp, logIn, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'signup') {
        if (!email.trim() || !password || !workspaceName.trim()) {
          setLocalError("Please fill out all required fields.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setLocalError("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }
        const success = await signUp(email, password, workspaceName);
        if (success) {
          onClose();
        }
      } else {
        if (!email.trim() || !password) {
          setLocalError("Please enter both email and password.");
          setIsSubmitting(false);
          return;
        }
        const success = await logIn(email, password);
        if (success) {
          onClose();
        }
      }
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLocalError(null);
    setIsSubmitting(true);
    const success = await logIn(demoEmail, 'password123');
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#080b13]/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-md bg-[#0D1B2A] border border-[#444444] rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(201,168,76,0.15)] overflow-hidden animate-in zoom-in-95 duration-200 text-[#F7F3EC] font-sans"
      >
        {/* Glow behind modal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#888888] hover:text-[#F7F3EC] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand / Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#C9A84C] to-[#888888] text-[#0D1B2A] shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <span className="font-display font-extrabold text-sm uppercase tracking-wider text-[#F7F3EC]">
            Synapse<span className="text-[#C9A84C]">Sync</span> Core
          </span>
        </div>

        {/* Tabs switcher */}
        <div className="grid grid-cols-2 bg-[#444444]/20 p-1 rounded-xl mb-6 border border-[#444444]/50">
          <button
            onClick={() => {
              setActiveTab('login');
              setLocalError(null);
            }}
            className={`py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'login'
                ? 'bg-[#C9A84C] text-[#0D1B2A] shadow-md'
                : 'text-[#888888] hover:text-[#F7F3EC]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setLocalError(null);
            }}
            className={`py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'signup'
                ? 'bg-[#C9A84C] text-[#0D1B2A] shadow-md'
                : 'text-[#888888] hover:text-[#F7F3EC]'
            }`}
          >
            Register
          </button>
        </div>

        <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
          {activeTab === 'login' ? 'Welcome Back, Operator' : 'Establish Co-Pilot Hub'}
        </h3>
        <p className="text-[#888888] text-xs leading-relaxed mb-6">
          {activeTab === 'login' 
            ? 'Access your centralized multi-channel optimization dashboard and reach insights.' 
            : 'Initialize your brand workspace and generate algorithm-compliant contents.'}
        </p>

        {/* Error notifications */}
        {(localError || authError) && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-[#C9A84C]" />
            <span>{localError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workspace Name (signup only) */}
          {activeTab === 'signup' && (
            <div>
              <label className="block text-[10px] text-[#888888] uppercase tracking-wider font-semibold mb-1.5">
                Brand or Agency Workspace Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#888888]" />
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. CreatorLab Studio or Acme Media"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#444444]/20 border border-[#444444] rounded-xl text-xs text-[#F7F3EC] placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] font-sans"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider font-semibold mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#888888]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@synapsesync.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#444444]/20 border border-[#444444] rounded-xl text-xs text-[#F7F3EC] placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] font-sans"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider font-semibold mb-1.5 flex justify-between">
              <span>Secure Passcode</span>
              {activeTab === 'login' && (
                <span className="text-[#C9A84C] cursor-pointer hover:underline normal-case text-[9px]">Forgot?</span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#888888]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔐 Enter at least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-[#444444]/20 border border-[#444444] rounded-xl text-xs text-[#F7F3EC] placeholder-[#888888] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#888888] hover:text-[#F7F3EC] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-xl bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md shadow-[#C9A84C]/10 hover:shadow-lg hover:shadow-[#C9A84C]/20"
          >
            {isSubmitting ? 'Verifying Credentials...' : activeTab === 'login' ? 'Sign In Securely' : 'Establish Brand Account'}
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Client Exploration */}
        <div className="mt-6 pt-5 border-t border-[#444444]/50 text-center">
          <span className="text-[9px] uppercase tracking-wider text-[#888888] block mb-2.5 font-bold">
            ⚡ Quick Demo Portals (Fast Connection)
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => handleQuickLogin('agency@synapse.com')}
              className="py-1.5 px-2 bg-[#444444]/20 hover:bg-[#444444]/40 border border-[#444444]/60 rounded-lg text-left transition-all truncate text-[#F7F3EC] cursor-pointer group"
            >
              <span className="block font-semibold group-hover:text-[#C9A84C]">Acme Agency</span>
              <span className="text-[#888888] text-[9px]">agency@synapse.com</span>
            </button>
            <button
              onClick={() => handleQuickLogin('creator@synapse.com')}
              className="py-1.5 px-2 bg-[#444444]/20 hover:bg-[#444444]/40 border border-[#444444]/60 rounded-lg text-left transition-all truncate text-[#F7F3EC] cursor-pointer group"
            >
              <span className="block font-semibold group-hover:text-[#C9A84C]">Creator Lab</span>
              <span className="text-[#888888] text-[9px]">creator@synapse.com</span>
            </button>
          </div>
        </div>

        {/* Security assurance */}
        <div className="mt-5 flex items-center justify-center gap-1 text-[9px] text-[#888888]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Locked Protection. Simulated TLS-encrypted connection.</span>
        </div>

      </div>
    </div>
  );
}
