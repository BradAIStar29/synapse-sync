import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Linkedin, 
  Twitter, 
  Mail, 
  Youtube, 
  Globe, 
  LogOut, 
  Sliders, 
  Plus, 
  Check, 
  Copy, 
  Trash2, 
  ArrowUpRight, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Layers, 
  CheckCircle2, 
  Compass, 
  Play, 
  Bell, 
  Activity,
  PlusCircle,
  AlertCircle,
  Clock,
  Calendar,
  Settings,
  Lock,
  CreditCard,
  Download,
  UserPlus,
  Shield,
  Facebook,
  Instagram,
  BookOpen,
  PenTool
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PRELOADED_DRAFTS, CHANNEL_METADATA, generatePlatformOptimization } from '../templates';
import { ChannelOptimizationMap } from '../types';
import AssetLibraryAndRepurposer from './AssetLibraryAndRepurposer';

export default function DashboardWorkspace() {
  const { user, logOut, connectPlatform, disconnectPlatform, updateBrandTone, updateWorkspaceName } = useAuth();
  
  // App-level mock state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'optimizer', 'channels', 'analytics'
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'scheduled' | 'published'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template-startup');
  const [customText, setCustomText] = useState<string>(PRELOADED_DRAFTS[0].text);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [optimizedOutputs, setOptimizedOutputs] = useState<ChannelOptimizationMap | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [activeResultTab, setActiveResultTab] = useState<string>('');
  
  // Saved campaigns list in Local Storage
  const [savedCampaigns, setSavedCampaigns] = useState<any[]>([]);
  const [newWorkspaceNameInput, setNewWorkspaceNameInput] = useState(user?.workspaceName || '');
  const [editWorkspaceSuccess, setEditWorkspaceSuccess] = useState(false);

  // Admin settings, subscriptions, payment and team state
  const [adminSubTab, setAdminSubTab] = useState<'profile' | 'billing' | 'security' | 'team'>('profile');
  const [notifyOptimalSlots, setNotifyOptimalSlots] = useState<boolean>(true);
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState<boolean>(true);
  const [notifyWebhook, setNotifyWebhook] = useState<boolean>(false);
  const [notifySystemStatus, setNotifySystemStatus] = useState<boolean>(true);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://hooks.slack.com/services/T00000000/B00000000/XXXX');
  const [prefSuccess, setPrefSuccess] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [enable2FA, setEnable2FA] = useState<boolean>(false);

  const [billingPlan, setBillingPlan] = useState<'starter' | 'pro'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [cardholderName, setCardholderName] = useState<string>('Jane Doe Agency');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('321');
  const [postalCode, setPostalCode] = useState<string>('94105');

  const [editCardholderName, setEditCardholderName] = useState<string>('Jane Doe Agency');
  const [editCardNumber, setEditCardNumber] = useState<string>('4242424242424242');
  const [editCardExpiry, setEditCardExpiry] = useState<string>('12/28');
  const [editCardCvv, setEditCardCvv] = useState<string>('321');
  const [editPostalCode, setEditPostalCode] = useState<string>('94105');
  const [cardSuccess, setCardSuccess] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string>('');

  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2026-004', date: 'Jun 01, 2026', plan: 'Pro Plan Subscription - Monthly', amount: '$100.00', status: 'Paid' },
    { id: 'INV-2026-003', date: 'May 01, 2026', plan: 'Pro Plan Subscription - Monthly', amount: '$100.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Apr 01, 2026', plan: 'Pro Plan Subscription - Monthly', amount: '$100.00', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Mar 15, 2026', plan: 'Workspace Setup & Priority Queue Init', amount: '$0.00', status: 'Paid' }
  ]);

  const [teamMembers, setTeamMembers] = useState<any[]>([
    { id: 'team-owner', name: 'Jane Doe', email: user?.email || 'subscriptionguide2026@gmail.com', role: 'Administrator (Owner)', status: 'Active' },
    { id: 'team-member-1', name: 'Sarah Jenkins', email: 'sarah@acmeagency.com', role: 'Editor / Publisher', status: 'Active' },
    { id: 'team-member-2', name: 'Marcus Vance', email: 'marcus@acmeagency.com', role: 'Analyst / Viewer', status: 'Active' }
  ]);

  const [addMemberName, setAddMemberName] = useState<string>('');
  const [addMemberEmail, setAddMemberEmail] = useState<string>('');
  const [addMemberRole, setAddMemberRole] = useState<string>('Editor / Publisher');
  const [teamError, setTeamError] = useState<string>('');
  const [teamSuccess, setTeamSuccess] = useState<string>('');

  // 🧠 Synapse Advanced AI Modules States
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'virality' | 'personas' | 'competitors'>('overview');
  
  // 1. Competitor Intelligence Tracker States
  const [competitorList, setCompetitorList] = useState<any[]>([
    { id: 'comp-1', name: 'VentureEdge Marketing', platform: 'linkedin', followers: '142,000', bestStrategy: 'Data-driven visual charts, customer proof checklists', successRate: '94%', activeGrowth: '+12.4% monthly' },
    { id: 'comp-2', name: 'SocialHack Enterprise', platform: 'x', followers: '350,000', bestStrategy: 'Controversy triggers, daily rapid threads, Q&A spaces', successRate: '88%', activeGrowth: '+6.1% monthly' },
    { id: 'comp-3', name: 'GrowthEngine Corp', platform: 'newsletter', subscribers: '58,000', bestStrategy: 'Bullet point highlights, case studies, early Tuesday optimal inbox slots', successRate: '92%', activeGrowth: '+14.2% monthly' },
    { id: 'comp-4', name: 'PixelPerfect Agency', platform: 'video', followers: '89,000', bestStrategy: 'Bento Grid product overlays, first 4-second hook loops', successRate: '90%', activeGrowth: '+9.8% monthly' }
  ]);
  const [newCompName, setNewCompName] = useState('');
  const [newCompPlatform, setNewCompPlatform] = useState('linkedin');
  const [newCompFollowers, setNewCompFollowers] = useState('');
  const [newCompStrategy, setNewCompStrategy] = useState('');

  // 2. Audience Segmentation & Personas States
  const [personas, setPersonas] = useState<any[]>([
    {
      id: 'per-1',
      name: 'Venture SaaS Founders',
      cohortSize: 'Enterprise High-Growth',
      primaryChannels: 'LinkedIn, X / Twitter',
      bio: 'B2B startup leaders & decision-makers. They prioritize scale hacks, customer validation data, and tech integration proof.',
      contentPreference: 'Actionable steps, high-contrast metrics charts, zero jargon fluff, structured checklists.',
      optimalSlots: 'Tuesday at 8:30 AM & Saturday at 10:00 AM',
      resonanceColor: 'text-blue-400'
    },
    {
      id: 'per-2',
      name: 'Scaling Digital Agencies',
      cohortSize: 'Multi-Channel Power Users',
      primaryChannels: 'LinkedIn, Newsletters, Video',
      bio: 'Agencies with 5-100 clients. They value workflow speed metrics, automated scheduling co-pilots, and report generation.',
      contentPreference: 'Client testimonial proof, white-label setup walkthroughs, multi-platform efficiency benchmarks.',
      optimalSlots: 'Wednesday at 11:30 AM & Thursday at 2:15 PM',
      resonanceColor: 'text-[#C9A84C]'
    },
    {
      id: 'per-3',
      name: 'SMB Marketing Directors',
      cohortSize: 'Local & National B2C Core',
      primaryChannels: 'Newsletters, Video, Facebook',
      bio: 'Dedicated in-house managers scaling limited budgets. They search for organic organic reach leverage without ad-spend.',
      contentPreference: 'Visual case studies, simple formatting formulas, bite-sized tutorials and story-driven copy.',
      optimalSlots: 'Monday at 9:00 AM & Friday at 3:30 PM',
      resonanceColor: 'text-emerald-450'
    }
  ]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('per-1');
  const [personaTestText, setPersonaTestText] = useState(
    "📈 SaaS founders are wasting $4,500/mo on boilerplate marketing agencies.\n\nHere is how we bypassed standard scheduling tools to gain 45k impressions organically in 14 days without spending a cent on ads."
  );
  const [isTestingPersona, setIsTestingPersona] = useState(false);
  const [personaCompatibilityResult, setPersonaCompatibilityResult] = useState<any>({
    tested: true,
    score: 87,
    segment: 'Venture SaaS Founders',
    sentimentAlignment: 'Highly Optimized (Professional & Assertive)',
    resonanceTags: ['Metrics Proof', 'Scale Hacks', 'Actionable Bullet-points'],
    gapOpportunities: [
      'Include a direct mention of specific SaaS MRR thresholds to lock B2B context.',
      'Reduce greeting length to appeal to busy founders.'
    ],
    engagementMultiplier: '2.4x estimated lift'
  });

  // 3. Predictive Virality & Reach States
  const [viralDraftText, setViralDraftText] = useState(
    "Universal standard scheduling is officially dead.\n\nMost content creators dilution rate is over 80% because they just copy-paste boilerplate text across X, LinkedIn, and Email channels. Stop lazy posting. Tailor for the algorithm."
  );
  const [viralSelectedPlatform, setViralSelectedPlatform] = useState('linkedin');
  const [isSimulatingVirality, setIsSimulatingVirality] = useState(false);
  const [viralityPredictionResult, setViralityPredictionResult] = useState<any>({
    tested: true,
    score: 84,
    momentumScale: 'High Exponential Pulse',
    hookScore: '9/10 (Strong pattern disruptor)',
    engagementRatio: '4.8% forecasted CTR',
    predictedReachMultiplier: '2.8x organic lift',
    optimalPostingTimes: 'Thursday 9:15 AM (EST)',
    positives: [
      'Bold, declarative hook statement triggers high feed-stopping attention.',
      'Platform tailoring keywords stimulate algorithmic resonance.'
    ],
    improvements: [
      'Inject at least one specific numerical percentage (e.g. 84% instead of "over 80%") to increase trust score by +6%.',
      'Add brief line-spacing or bullet list after line 2 to enhance visual readability on mobile displays.'
    ]
  });

  // Distribution Content Queue state for dashboard
  const [contentQueue, setContentQueue] = useState<any[]>(() => {
    const cached = localStorage.getItem('synapse_content_queue');
    if (cached) {
      return JSON.parse(cached);
    }
    return [
      {
        id: 'post-1',
        platform: 'linkedin',
        title: 'Format over boilerplate concept',
        snippet: '📈 Unpopular opinion: Most marketing channels are failing not because the idea is bad, but because the format is lazy.\n\nLinkedIn requires storytelling narrative loops rather than generic copy-paste corporate lines.',
        status: 'published',
        publishedAt: '4 hours ago',
        metrics: { impressions: '14,240', clicks: '452', ctr: '3.18%', engagement: '4.8%' },
        category: 'B2B Story Loop'
      },
      {
        id: 'post-2',
        platform: 'x',
        title: 'Universal scheduling is dead',
        snippet: 'Universal scheduling is dead. Multi-channel mastery is born.\n\nStop lazy cross-posting—this is exactly how you dilute reach by 84%. Format for the platform algorithm.',
        status: 'scheduled',
        scheduledFor: 'Tuesday at 9:00 AM (AI Optimal Slot)',
        metrics: { predictedReach: '3.1x Lift', priority: 'High Resonance Feed' },
        category: 'Viral Growth Thread'
      },
      {
        id: 'post-3',
        platform: 'newsletter',
        title: 'Personalized Warmth Value Post',
        snippet: 'Hey friends,\n\nLet’s cut through the noise today. I want to talk about something that’s been driving me absolutely crazy in the marketing & distribution space: the copy-paste trap.',
        status: 'scheduled',
        scheduledFor: 'Thursday at 7:30 AM (AI Optimal Slot)',
        metrics: { predictedReach: '2.3x Lift', priority: 'Peak Inbox Placement' },
        category: 'Email Editorial Deep Dive'
      },
      {
        id: 'post-4',
        platform: 'video',
        title: 'Spoken Retention: Youtube Hook Intro',
        snippet: '[Visual: Tight close-up on speaker, high energy. Soft ambient backlighting.]\n\nSpoken: "Most content creators are flushing 80% of their reach down the toilet. And they don’t even know it."',
        status: 'published',
        publishedAt: '2 days ago',
        metrics: { impressions: '28,500', clicks: '1,200', ctr: '4.21%', engagement: '6.4%' },
        category: 'Video Anchor Hook'
      },
      {
        id: 'post-5',
        platform: 'linkedin',
        title: 'SMB Breakthrough Case Study',
        snippet: 'We helped an organic soap business go from 2k impressions/mo to 45k impressions/mo without spending a single dollar on ads.\n\nFirst shift: turned the manufacturing into mini visual educational narratives.',
        status: 'published',
        publishedAt: '3 days ago',
        metrics: { impressions: '8,420', clicks: '291', ctr: '3.46%', engagement: '5.1%' },
        category: 'Social Proof Case Study'
      }
    ];
  });

  // Sync contentQueue to localStorage
  useEffect(() => {
    localStorage.setItem('synapse_content_queue', JSON.stringify(contentQueue));
  }, [contentQueue]);

  const handleSchedulePost = (platformId: string, content: string, hookType: string, multiplier: number) => {
    const meta = CHANNEL_METADATA.find(c => c.id === platformId);
    const bestTime = meta ? meta.bestTime : 'Tomorrow at 10:00 AM';
    
    const newPost = {
      id: `post-${Date.now()}`,
      platform: platformId,
      title: content.split('\n').filter(l => l.trim().length > 0)[0]?.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 32) || 'AI Tailored Post',
      snippet: content,
      status: 'scheduled',
      scheduledFor: `${bestTime} (AI Optimal Slot)`,
      metrics: { predictedReach: `${multiplier}x Lift`, priority: 'Active Queue Slot' },
      category: hookType || 'AI Tailored Content'
    };
    
    setContentQueue(prev => [newPost, ...prev]);
    alert(`Successfully optimized and scheduled to your Workspace Queue under ${meta?.name || platformId}!`);
  };

  const handlePublishNow = (id: string) => {
    setContentQueue(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          status: 'published',
          publishedAt: 'Just now',
          metrics: {
            impressions: '120',
            clicks: '8',
            ctr: '6.67%',
            engagement: '8.33%'
          }
        };
      }
      return post;
    }));
  };

  const handleCancelPost = (id: string) => {
    if (confirm("Are you sure you want to cancel and remove this scheduled post?")) {
      setContentQueue(prev => prev.filter(post => post.id !== id));
    }
  };

  // 🧠 Synapse Advanced AI Modules Handler Methods
  const handleSimulateVirality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viralDraftText.trim()) {
      alert("Please enter draft text to execute virality predictions.");
      return;
    }
    setIsSimulatingVirality(true);
    setTimeout(() => {
      const hasNumbers = /\d+/.test(viralDraftText);
      const textLower = viralDraftText.toLowerCase();
      const length = viralDraftText.length;
      
      const hasResonanceKeywords = /founders|algorithm|scaling|agency|dead|impressions|organically|boilerplates|competitor|persona|predictive/gi.test(viralDraftText);
      
      let calculatedScore = 72;
      if (hasNumbers) calculatedScore += 7;
      if (hasResonanceKeywords) calculatedScore += 8;
      if (length > 120 && length < 320) calculatedScore += 5; // optimized segment
      if (textLower.includes('unpopular opinion') || textLower.includes('dead') || textLower.includes('synergy')) {
        calculatedScore += 4;
      }
      if (calculatedScore > 98) calculatedScore = 98;

      const dynamicPositives = [];
      if (hasNumbers) {
        dynamicPositives.push("Credibility anchor detected through specific numerical/percentage metrics, establishing quick viewer trust.");
      } else {
        dynamicPositives.push("Nice direct opening hooks structure, though it lacks direct quantitative metrics.");
      }
      if (hasResonanceKeywords) {
        dynamicPositives.push("Includes strong high-resonance marketing keyword triggers, boosting algorithmic channel scoring index.");
      } else {
        dynamicPositives.push("Conversational warmth is highly responsive.");
      }
      if (length > 120 && length < 320) {
        dynamicPositives.push("Excellent text density. Fits standard mobile viewports perfectly without truncation.");
      }

      const dynamicImprovements = [];
      if (!hasNumbers) {
        dynamicImprovements.push("Inject at least one specific statistical reference or data metric (e.g. 84% instead of 'most' or 'almost all') to drive direct authority.");
      }
      if (length > 350) {
        dynamicImprovements.push("Target copy is too verbose for rapid viewport scrolling. Trim the lower paragraphs by 15% to avoid reader drop-off.");
      } else if (length < 80) {
        dynamicImprovements.push("The draft is highly brief. Elaborate slightly or add a distinct single-sentence benefit to increase click/interaction depth.");
      }
      if (!textLower.includes('?')) {
        dynamicImprovements.push("No question detected. Add an algorithmic call-to-conversation (e.g. 'What is your take?') at the footer to boost comments by up to +35%.");
      }

      const mult = (calculatedScore / 30).toFixed(1);

      setViralityPredictionResult({
        tested: true,
        score: calculatedScore,
        momentumScale: calculatedScore > 85 ? 'High Exponential Pulse' : 'Steady organic stream',
        hookScore: `${Math.round(calculatedScore / 10)}/10`,
        engagementRatio: `${(calculatedScore / 18).toFixed(1)}% forecasted CTR`,
        predictedReachMultiplier: `${mult}x organic lift`,
        optimalPostingTimes: viralSelectedPlatform === 'linkedin' ? 'Tuesday 8:30 AM (EST)' : viralSelectedPlatform === 'x' ? 'Thursday 1:15 PM (EST)' : 'Wednesday 10:00 AM (EST)',
        positives: dynamicPositives,
        improvements: dynamicImprovements
      });
      setIsSimulatingVirality(false);
    }, 1100);
  };

  const handleSimulatePersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personaTestText.trim()) {
      alert("Please enter text before analyzing cohort alignment.");
      return;
    }
    setIsTestingPersona(true);
    setTimeout(() => {
      const activePer = personas.find(p => p.id === selectedPersonaId);
      const textLower = personaTestText.toLowerCase();
      
      let hitCount = 0;
      let resonanceTags: string[] = [];
      
      if (selectedPersonaId === 'per-1') { // Venture SaaS Founders
        const keywords = ['saas', 'founder', 'founders', 'mrr', 'growth', 'ads', 'impressions', 'b2b', 'funding', 'validate', 'metrics', 'scale', 'revenue', 'ctr'];
        keywords.forEach(kw => { if (textLower.includes(kw)) hitCount++; });
        resonanceTags = ['Startup Focus', 'Objective Numbers', 'High-contrast benefit'];
        if (hitCount > 2) resonanceTags.push('B2B Industry Fit');
      } else if (selectedPersonaId === 'per-2') { // Scaling Digital Agencies
        const keywords = ['agency', 'client', 'clients', 'workflow', 'white-label', 'schedule', 'report', 'reports', 'multi-channel', 'co-pilot', 'reach', 'mastery'];
        keywords.forEach(kw => { if (textLower.includes(kw)) hitCount++; });
        resonanceTags = ['Process workflow focus', 'Client deliverables', 'Retention benchmarks'];
        if (hitCount > 2) resonanceTags.push('Agency Master Class');
      } else { // SMB Marketing Directors
        const keywords = ['budget', 'small business', 'local', 'simple', 'tutorial', 'story', 'organic', 'directors', 'b2c', 'impressions', 'save', 'efficient'];
        keywords.forEach(kw => { if (textLower.includes(kw)) hitCount++; });
        resonanceTags = ['Budget optimization', 'Story-driven hook', 'Direct applicability'];
        if (hitCount > 2) resonanceTags.push('SMB Friendly Canvas');
      }

      let baseScore = 62;
      baseScore += Math.min(hitCount * 7, 28);
      if (personaTestText.length > 120 && personaTestText.length < 350) baseScore += 7;
      if (baseScore > 99) baseScore = 99;

      const dynamicGaps = [];
      if (hitCount < 2) {
        dynamicGaps.push(`The writing style misses industry-specific jargon matching the ${activePer?.name || 'target segment'}. Introduce 1-2 specialized vocabulary hooks.`);
      }
      if (personaTestText.length > 350) {
        dynamicGaps.push("This persona handles high daily workloads. Chop text length down or format utilizing scannable lists.");
      } else if (personaTestText.length < 80) {
        dynamicGaps.push("Increase text detail slightly to provide concrete value before calling them to action.");
      }

      setPersonaCompatibilityResult({
        tested: true,
        score: baseScore,
        segment: activePer?.name || 'Target Segment',
        sentimentAlignment: baseScore > 84 ? 'Highly Optimized (Assertive & Solution-oriented)' : 'Moderate Resonance (Needs segment adjustment)',
        resonanceTags: resonanceTags,
        gapOpportunities: dynamicGaps.length > 0 ? dynamicGaps : ['No serious gaps found. Beautiful tone density match.'],
        engagementMultiplier: `${(baseScore / 32).toFixed(1)}x predicted lift`
      });
      setIsTestingPersona(false);
    }, 1100);
  };

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !newCompStrategy.trim()) {
      alert("Please fill out competitor name and strategy.");
      return;
    }
    const newComp = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      platform: newCompPlatform,
      followers: newCompFollowers.trim() || '18,500',
      bestStrategy: newCompStrategy,
      successRate: `${Math.floor(Math.random() * 12) + 84}%`,
      activeGrowth: `+${(Math.random() * 7 + 4).toFixed(1)}% monthly`
    };
    setCompetitorList(prev => [newComp, ...prev]);
    setNewCompName('');
    setNewCompFollowers('');
    setNewCompStrategy('');
    alert(`✓ Successfully established real-time peer intelligence tracker query for "${newComp.name}"!`);
  };

  // Load saved campaign history
  useEffect(() => {
    const saved = localStorage.getItem('synapse_saved_campaigns');
    if (saved) {
      setSavedCampaigns(JSON.parse(saved));
    } else {
      const initialCampaigns = [
        {
          id: 'camp-1',
          title: 'Initial Multi-Channel Lift',
          rawText: PRELOADED_DRAFTS[1].text,
          channels: ['linkedin', 'x'],
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toLocaleDateString()
        }
      ];
      setSavedCampaigns(initialCampaigns);
      localStorage.setItem('synapse_saved_campaigns', JSON.stringify(initialCampaigns));
    }
  }, []);

  // Update starting visible result tab when user.connectedPlatforms shifts
  useEffect(() => {
    if (user && user.connectedPlatforms.length > 0 && !activeResultTab) {
      setActiveResultTab(user.connectedPlatforms[0]);
    }
  }, [user?.connectedPlatforms, activeResultTab]);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const doc = PRELOADED_DRAFTS.find(d => d.id === id);
    if (doc) {
      setCustomText(doc.text);
      setOptimizedOutputs(null);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedTemplate('custom');
    setCustomText(e.target.value);
    setOptimizedOutputs(null);
  };

  // Run simulated optimization
  const runOptimization = () => {
    if (!customText.trim() || !user) return;
    setIsProcessing(true);
    setOptimizedOutputs(null);

    const steps = [
      "Securing algorithm credentials...",
      "Extracting hooks tailored to platform rules...",
      "Analyzing tone scores & reach contours...",
      "Injecting optimal formatting and hashtags...",
      "Compiling optimized multichannel campaign copy board..."
    ];

    let currentStepIndex = 0;
    setProcessingStep(steps[currentStepIndex]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setProcessingStep(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        
        const results: ChannelOptimizationMap = {};
        const targets = user.connectedPlatforms.length > 0 ? user.connectedPlatforms : ['linkedin'];
        targets.forEach(chan => {
          results[chan] = generatePlatformOptimization(customText, chan);
        });

        setOptimizedOutputs(results);
        setIsProcessing(false);
        if (targets.length > 0) {
          setActiveResultTab(targets[0]);
        }
      }
    }, 300);
  };

  const handleSaveCampaign = () => {
    if (!customText.trim() || !user) return;
    
    const newCamp = {
      id: `camp-${Date.now()}`,
      title: customText.split('\n')[0].substring(0, 32) + '...',
      rawText: customText,
      channels: user.connectedPlatforms,
      createdAt: new Date().toLocaleDateString()
    };
    
    const updated = [newCamp, ...savedCampaigns];
    setSavedCampaigns(updated);
    localStorage.setItem('synapse_saved_campaigns', JSON.stringify(updated));
    alert("Campaign saved successfully to your Local Workspace Library!");
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = savedCampaigns.filter(c => c.id !== id);
    setSavedCampaigns(updated);
    localStorage.setItem('synapse_saved_campaigns', JSON.stringify(updated));
  };

  const copyToClipboard = (text: string, channelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [channelId]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [channelId]: false });
    }, 2000);
  };

  const handleUpdateWorkspaceName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkspaceNameInput.trim()) {
      updateWorkspaceName(newWorkspaceNameInput.trim());
      setEditWorkspaceSuccess(true);
      setTimeout(() => setEditWorkspaceSuccess(false), 3000);
    }
  };

  // Admin Dashboard Event Handlers
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword) {
      setPasswordError('Please specify your current active password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('The new passcode must be at least 6 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('The passcode confirmation field does not match.');
      return;
    }
    
    // Retrieve from mock db, make sure it matches
    const dbStr = localStorage.getItem('synapse_users_db');
    if (dbStr && user) {
      const db = JSON.parse(dbStr);
      const idx = db.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        if (db[idx].password && db[idx].password !== currentPassword) {
          setPasswordError('Existing security passcode is incorrect.');
          return;
        }
        db[idx].password = newPassword;
        localStorage.setItem('synapse_users_db', JSON.stringify(db));
      }
    }
    
    setPasswordSuccess('Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');
    setCardSuccess(false);

    if (!editCardholderName.trim() || !editCardNumber.trim() || !editCardExpiry.trim() || !editCardCvv.trim()) {
      setCardError('All billing credential fields are required.');
      return;
    }

    const unmasked = editCardNumber.replace(/[^0-9]/g, '');
    if (unmasked.length < 12) {
      setCardError('Please enter a valid credit card number.');
      return;
    }

    setCardholderName(editCardholderName);
    // Mask the card number
    setCardNumber(`•••• •••• •••• ${unmasked.substring(unmasked.length - 4)}`);
    setCardExpiry(editCardExpiry);
    setCardCvv(editCardCvv);
    setPostalCode(editPostalCode);
    
    setCardSuccess(true);
    setTimeout(() => setCardSuccess(false), 4000);
  };

  const handleDownloadInvoice = (invoiceId: string, amount: string) => {
    alert(`Downloading invoice receipt document for ${invoiceId} in PDF format. Total Charged: ${amount}. Thank you for subscribing to Synapse Sync!`);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    setTeamError('');
    setTeamSuccess('');

    if (!addMemberName.trim() || !addMemberEmail.trim()) {
      setTeamError('Please fill out both the Name and Email fields.');
      return;
    }

    if (!addMemberEmail.includes('@') || !addMemberEmail.includes('.')) {
      setTeamError('Please specify a valid email address.');
      return;
    }

    const emailExists = teamMembers.some(m => m.email.toLowerCase() === addMemberEmail.toLowerCase().trim());
    if (emailExists) {
      setTeamError('A team member with this email address already matches our workspace list.');
      return;
    }

    const newMember = {
      id: `team-${Date.now()}`,
      name: addMemberName.trim(),
      email: addMemberEmail.trim().toLowerCase(),
      role: addMemberRole,
      status: 'Active'
    };

    setTeamMembers(prev => [...prev, newMember]);
    setTeamSuccess(`Successfully invited and registered ${addMemberName} with role "${addMemberRole}" in this workspace!`);
    setAddMemberName('');
    setAddMemberEmail('');
  };

  const handleRemoveTeamMember = (id: string, name: string) => {
    if (id === 'team-owner') {
      alert('You are forbidden from removing the workspace administrator owner account.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${name} from your agency team workspace?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      setTeamSuccess(`Successfully removed ${name} from active team resources.`);
    }
  };

  const handleChangeMemberRole = (id: string, currentRole: string) => {
    if (id === 'team-owner') {
      alert('You are forbidden from changing the owner\'s role.');
      return;
    }
    const roles = ['Administrator (Admin)', 'Editor / Publisher', 'Analyst / Viewer'];
    const nextIdx = (roles.indexOf(currentRole) + 1) % roles.length;
    const nextRole = roles[nextIdx !== -1 ? nextIdx : 0];
    
    setTeamMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, role: nextRole };
      }
      return m;
    }));
    setTeamSuccess(`Role updated to ${nextRole} successfully.`);
  };

  const getChannelIcon = (id: string, sizeClass = "w-5 h-5") => {
    switch (id) {
      case 'linkedin': return <Linkedin className={sizeClass} />;
      case 'x': return <Twitter className={sizeClass} />;
      case 'facebook': return <Facebook className={sizeClass} />;
      case 'instagram': return <Instagram className={sizeClass} />;
      case 'wordpress': return <BookOpen className={sizeClass} />;
      case 'medium': return <PenTool className={sizeClass} />;
      case 'newsletter': return <Mail className={sizeClass} />;
      case 'video': return <Youtube className={sizeClass} />;
      default: return <Globe className={sizeClass} />;
    }
  };

  const allAvailablePlatformsList = [
    { id: 'linkedin', name: 'LinkedIn Professional', desc: 'B2B executive networks, authority building & professional stories' },
    { id: 'x', name: 'X / Twitter Feed', desc: 'SaaS hooks, rapid viral threads, and high-beta text updates' },
    { id: 'facebook', name: 'Facebook Community', desc: 'Client relationship nurturing, local updates & success stories' },
    { id: 'instagram', name: 'Instagram Caption Grid', desc: 'Aesthetic visual captions, story anchors & carousel prompts' },
    { id: 'wordpress', name: 'WordPress Blog Engine', desc: 'SEO-optimized articles, H1-H3 sections & search-intent structures' },
    { id: 'medium', name: 'Medium Publishing Hub', desc: 'Long-form thought essays, narrative stories & opinion guides' },
    { id: 'newsletter', name: 'Email Newsletter', desc: 'Editorial deep-dives, warm newsletters & personal sales pitches' },
    { id: 'video', name: 'YouTube Script/Shorts', desc: 'Immediate hook outlines, spoken narrative flows & visual prompts' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#F7F3EC] font-sans flex flex-col">
      
      {/* Top Premium Navbar */}
      <nav className="bg-[#0D1B2A] border-b border-[#444444] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#C9A84C] to-[#888888] text-[#0D1B2A] shadow-md">
              <Sparkles className="w-4.5 h-4.5 fill-current" />
            </div>
            <span className="font-display font-extrabold text-white tracking-tight text-base sm:text-lg">
              Synapse<span className="text-[#C9A84C]">Sync</span> Terminal
            </span>
          </div>

          {/* Connected Hub indicator */}
          <div className="hidden md:flex items-center gap-2 bg-[#444444]/25 border border-[#444444] px-4 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#888888] font-semibold">Workspace Profile:</span>
            <span className="text-white font-bold">{user.workspaceName}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={logOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#444444] text-[#888888] hover:text-[#F7F3EC] hover:bg-[#444444]/25 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mobile Navigation Rails (Shown only on small screens <lg) */}
        <div id="mobile-workspace-nav-bar" className="block lg:hidden w-full space-y-4">
          <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-3.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-3.5 font-mono">
              Workspace Scope
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
              <button
                id="mob-tab-dashboard"
                onClick={() => {
                  setActiveTab('dashboard');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                Overview
              </button>
              
              <button
                id="mob-tab-optimizer"
                onClick={() => {
                  setActiveTab('optimizer');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'optimizer'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                AI Optimizer
              </button>

              <button
                id="mob-tab-assets"
                onClick={() => {
                  setActiveTab('assets');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'assets'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Creative Hub
              </button>

              <button
                id="mob-tab-channels"
                onClick={() => {
                  setActiveTab('channels');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'channels'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                Linked Sync ({user.connectedPlatforms.length})
              </button>

              <button
                id="mob-tab-analytics"
                onClick={() => {
                  setActiveTab('analytics');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                Metrics Co-Pilot
              </button>

              <button
                id="mob-tab-admin"
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                    : 'bg-[#444444]/10 text-[#888888] hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Left Navigation Rails (Shown only on Desktop lg displays) */}
        <div id="desktop-workspace-sidebar" className="hidden lg:block lg:col-span-3 space-y-4">
          
          <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-3 font-mono">
              Workspace Scope
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <Compass className="w-4 h-4" />
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveTab('optimizer')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'optimizer'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <Sliders className="w-4 h-4" />
                AI Draft Optimizer
              </button>
              <button
                onClick={() => setActiveTab('assets')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'assets'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Asset Library & Repurposer
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'channels'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <Layers className="w-4 h-4" />
                Linked Connections ({user.connectedPlatforms.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Metrics Co-Pilot
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                    : 'text-[#888888] hover:text-white hover:bg-[#444444]/20'
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin Console & Settings
              </button>
            </div>
          </div>

          {/* Quick Metrics summary list */}
          <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-4 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-3.5 font-mono">
              Live Algorithmic Feed
            </span>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-[#444444]/10 p-2 rounded-lg gap-2">
                <span className="text-[#888888]">Connected Channels:</span>
                <span className="font-bold text-[#F7F3EC]">{user.connectedPlatforms.length} active</span>
              </div>
              <div className="flex justify-between items-center bg-[#444444]/10 p-2 rounded-lg gap-2">
                <span className="text-[#888888]">Predicted CTR Lift:</span>
                <span className="font-bold text-emerald-450 text-[#C9A84C]">+148% average</span>
              </div>
              <div className="flex justify-between items-center bg-[#444444]/10 p-2 rounded-lg gap-2">
                <span className="text-[#888888]">AI Writing Tone:</span>
                <span className="font-bold truncate max-w-[100px] text-[#F7F3EC] capitalize">{user.brandTone?.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Core Brand Channels currently online */}
          <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-4 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block mb-3 font-mono">
              Online Streams
            </span>
            {user.connectedPlatforms.length > 0 ? (
              <div className="space-y-2">
                {user.connectedPlatforms.map(p => (
                  <div key={p} className="flex items-center gap-2 bg-[#444444]/20 px-2.5 py-1.5 rounded-lg">
                    <span className="text-[#C9A84C]">{getChannelIcon(p, 'w-4 h-4')}</span>
                    <span className="capitalize font-semibold text-[#F7F3EC]">{p} Sync Queue</span>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[#888888]">
                No streams interconnected yet! Go to Linked Connections to bind portfolios.
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Inner Panel (Col-9) */}
        <div className="lg:col-span-9 space-y-8">
          
          {activeTab === 'assets' && (
            <AssetLibraryAndRepurposer 
              user={user}
              setCustomText={setCustomText}
              setActiveResultTab={setActiveResultTab}
              setActiveTab={setActiveTab}
              onSchedulePost={handleSchedulePost}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Premium Dashboard Header Card */}
              <div className="bg-gradient-to-tr from-[#0D1B2A] to-[#444444]/30 border border-[#444444] rounded-2xl p-6 relative">
                <div className="absolute top-4 right-4 text-[#C9A84C]/25">
                  <Compass className="w-16 h-16 stroke-[1]" />
                </div>
                <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest block mb-1 font-mono">
                  Master Control Console
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-2.5xl text-white">
                  {user.workspaceName || 'Synapse Sync'} Command Center
                </h2>
                <p className="text-[#888888] text-xs mt-1.5 max-w-xl">
                  Unified distribution co-pilot. Optimize and manage cross-channel publishing schedules, track real-time reach lifts, and instantly apply AI-recommended posting hours matching native social algorithms.
                </p>
              </div>

              {/* Aggregated Unified Analytics Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[#888888]">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Combined Impressions</span>
                    <BarChart3 className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-white font-mono block">384,240</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      ↑ +18.4% <span className="text-[#888888] font-normal font-mono">vs prev week</span>
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[#888888]">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Unified Click-Through</span>
                    <ArrowUpRight className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-white font-mono block">3.48%</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      ↑ +0.58% <span className="text-[#888888] font-normal font-mono">resonance gain</span>
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[#888888]">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Co-Pilot Reach Lift</span>
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-[#C9A84C] font-mono block">2.68x</span>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                      Average <span className="text-[#888888] font-normal font-mono">algorithmic boost</span>
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[#888888]">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Schedule Allocation</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-white font-mono block">
                      {contentQueue.filter(p => p.status === 'scheduled').length} / 10
                    </span>
                    <span className="text-[10px] text-[#C9A84C] font-mono block mt-0.5">
                      Optimal slots loaded
                    </span>
                  </div>
                </div>

              </div>

              {/* Main Split Layout: Content Board on Left, AI recommended posting on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT BLOCK: Scheduled & Published Content Board (Col-8) */}
                <div className="lg:col-span-8 bg-[#444444]/15 border border-[#444444]/85 rounded-2xl p-5 space-y-4">
                  
                  {/* Content Board Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#444444]/60">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Scheduled & Published Content</h3>
                      <p className="text-[10px] text-[#888888]">Real-time state overview of active campaigns & distributions</p>
                    </div>
                    
                    {/* Switcher Filters */}
                    <div className="flex rounded-lg bg-[#444444]/20 border border-[#444444]/60 p-1 self-start">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'scheduled', label: 'Scheduled' },
                        { id: 'published', label: 'Published' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setDashboardFilter(f.id as any)}
                          className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            dashboardFilter === f.id
                              ? 'bg-[#C9A84C] text-[#0D1B2A]'
                              : 'text-[#888888] hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Queue List items */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {(() => {
                      const filtered = contentQueue.filter(post => {
                        if (dashboardFilter === 'all') return true;
                        return post.status === dashboardFilter;
                      });
                      
                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-12 text-[#888888] border border-dashed border-[#444444]/85 rounded-xl text-xs space-y-2">
                            <span>No {dashboardFilter} items in your distribution system.</span>
                            {dashboardFilter !== 'published' && (
                              <button
                                onClick={() => setActiveTab('optimizer')}
                                className="block mx-auto text-[10px] text-[#C9A84C] font-bold hover:underline py-1 cursor-pointer"
                              >
                                Optimize a new draft now!
                              </button>
                            )}
                          </div>
                        );
                      }

                      return filtered.map(post => {
                        const isScheduled = post.status === 'scheduled';
                        const isLinked = user.connectedPlatforms.includes(post.platform);
                        
                        return (
                          <div 
                            key={post.id} 
                            className={`p-4 bg-[#444444]/10 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                              isScheduled 
                                ? 'border-[#444444] hover:border-[#888888]/40' 
                                : 'border-[#444444]/40 hover:border-[#C9A84C]/35'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2.5 bg-transparent">
                              {/* Left details */}
                              <div className="flex items-start gap-2.5">
                                <div className={`p-2 rounded-lg bg-[#444444]/25 shrink-0 ${
                                  post.platform === 'linkedin' ? 'text-blue-400' :
                                  post.platform === 'x' ? 'text-zinc-300' :
                                  post.platform === 'newsletter' ? 'text-emerald-400' :
                                  post.platform === 'video' ? 'text-red-400' : 'text-[#C9A84C]'
                                }`}>
                                  {getChannelIcon(post.platform, 'w-4 h-4')}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-extrabold text-white text-xs sm:text-sm capitalize tracking-tight leading-none">
                                      {post.title}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-wider font-bold text-[#C9A84C] px-2 py-0.5 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-full font-mono">
                                      {post.category || 'AI Optimized'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#888888] font-semibold flex items-center gap-1.5">
                                    <span>Platform Target:</span>
                                    <span className="uppercase text-[#F7F3EC] tracking-widest text-[9px] font-bold font-mono">
                                      {post.platform}
                                    </span>
                                    {!isLinked && (
                                      <span className="text-yellow-500 font-bold uppercase text-[8px] tracking-normal font-mono bg-yellow-500/5 border border-yellow-500/20 px-1 py-0.2 rounded">
                                        Not Linked Offline
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Status Badge right */}
                              <div className="flex items-center gap-2 self-start sm:self-center">
                                {isScheduled ? (
                                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold font-mono uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 px-2 py-1 rounded-full whitespace-nowrap">
                                    <Clock className="w-3 h-3 animate-spin" />
                                    Scheduled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full whitespace-nowrap">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Published
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Snippet Content Preview */}
                            <p className="text-[#888888] text-[11px] leading-relaxed line-clamp-2 bg-[#444444]/15 p-2 rounded-lg border border-[#444444]/30 font-sans mb-3 select-text select-none">
                              {post.snippet}
                            </p>

                            {/* Metrics & Actions Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-[#444444]/30 text-[10px]">
                              {/* Display specific stats based on state */}
                              {isScheduled ? (
                                <div className="flex flex-wrap items-center gap-2 text-[#888888] font-medium font-mono">
                                  <span>Slot Time:</span>
                                  <span className="text-[#F7F3EC] font-bold">{post.scheduledFor}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                  <span className="text-[#C9A84C] font-bold uppercase">Reach Boost: {post.metrics.predictedReach}</span>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-x-4 gap-y-1.5 text-[#888888] font-medium font-mono">
                                  <div className="flex items-center gap-1">
                                    <span>Impressions:</span>
                                    <span className="text-[#F7F3EC] font-bold">{post.metrics.impressions}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>Clicks:</span>
                                    <span className="text-white font-bold">{post.metrics.clicks}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>CTR:</span>
                                    <span className="text-[#C9A84C] font-bold">{post.metrics.ctr}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>Engage Rate:</span>
                                    <span className="text-emerald-400 font-bold">{post.metrics.engagement}</span>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Actions */}
                              <div className="flex items-center justify-end gap-2.5">
                                {isScheduled ? (
                                  <>
                                    <button
                                      onClick={() => handlePublishNow(post.id)}
                                      className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                      title="Publish instantly right now bypassing queue"
                                    >
                                      Publish Now
                                    </button>
                                    <button
                                      onClick={() => handleCancelPost(post.id)}
                                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                                      title="Unschedule & delete draft"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="text-[10px] text-[#888888] font-mono select-none">
                                    Published {post.publishedAt}
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Create New Draft Button Helper */}
                  <div className="pt-2 border-t border-[#444444]/40 flex justify-center">
                    <button
                      onClick={() => {
                        setCustomText('');
                        setActiveTab('optimizer');
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C9A84C] hover:text-white uppercase tracking-wider font-mono hover:underline py-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Rewrite & Schedule a new campaign copy board
                    </button>
                  </div>

                </div>

                {/* RIGHT BLOCK: AI-recommended posting times (Col-4) */}
                <div className="lg:col-span-4 bg-[#444444]/15 border border-[#444444]/85 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">AI-Optimized Schedule Co-Pilot</h3>
                    <p className="text-[10px] text-[#888888]">Algorithmic peak performance slots matching active platform rules</p>
                  </div>

                  {/* Slots vertical list */}
                  <div className="space-y-4">
                    {CHANNEL_METADATA.map(platform => {
                      const efficiencyMap: { [key: string]: string } = {
                        linkedin: '94%',
                        x: '97%',
                        facebook: '91%',
                        instagram: '95%',
                        wordpress: '89%',
                        medium: '93%',
                        newsletter: '92%',
                        video: '88%'
                      };
                      const isLinked = user.connectedPlatforms.includes(platform.id);
                      return (
                        <div key={platform.id} className="p-3.5 bg-[#444444]/10 rounded-xl border border-[#444444]/60 space-y-2 relative overflow-hidden group">
                          {/* Minimal glow on linked platforms */}
                          {isLinked && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full blur-xl pointer-events-none" />
                          )}
                          
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase font-mono tracking-tight">
                              <span className={platform.color}>
                                {getChannelIcon(platform.id, 'w-3.5 h-3.5')}
                              </span>
                              <span>{platform.name.split(' ')[0]}</span>
                            </div>
                            
                            {/* Efficiency badge */}
                            <span className="text-[8px] font-mono tracking-widest text-[#C9A84C] font-extrabold uppercase px-1.5 py-0.5 bg-[#C9A84C]/10 rounded border border-[#C9A84C]/25">
                              {efficiencyMap[platform.id] || '90%'} Match
                            </span>
                          </div>

                          {/* Time window display */}
                          <div className="bg-[#444444]/15 border border-[#444444]/40 rounded-lg p-2 flex items-center gap-2 animate-in fade-in">
                            <Clock className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span className="font-mono text-[11px] font-bold text-white tracking-tight">{platform.bestTime} (Optimal)</span>
                          </div>

                          {/* Rule description rationale */}
                          <p className="text-[10px] text-[#888888] leading-relaxed">
                            {platform.recommendation}
                          </p>

                          {/* Compose in slot action */}
                          <button
                            onClick={() => {
                              // prefill the workspace and active tab
                              const defaultDraft = PRELOADED_DRAFTS.find(d => d.id === 'template-startup')?.text || "";
                              setCustomText(defaultDraft);
                              setActiveResultTab(platform.id);
                              setActiveTab('optimizer');
                              window.scrollTo({ top: 120, behavior: 'smooth' });
                            }}
                            className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#444444]/25 hover:bg-[#C9A84C] text-[#888888] hover:text-[#0D1B2A] border border-[#444444]/60 hover:border-[#C9A84C] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Compose for this window
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommendation Insight info ticker */}
                  <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/25 rounded-xl text-[10px] text-[#888888] leading-relaxed space-y-1">
                    <span className="text-[#C9A84C] font-bold uppercase tracking-widest block font-mono text-[9px]">
                      Weekly Algorithmic Lock status:
                    </span>
                    <p>
                      Tuesday and Wednesday slots are currently reporting the highest engagement potential. Connect all target channels inside Settings to lock in real-time publishing queues.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === 'optimizer' && (
            <div className="space-y-6">
              
              {/* Composer Header Block */}
              <div className="bg-gradient-to-tr from-[#0D1B2A] to-[#444444]/30 border border-[#444444] rounded-2xl p-6 relative">
                <div className="absolute top-4 right-4 text-[#C9A84C]/25">
                  <Sliders className="w-16 h-16 stroke-[1]" />
                </div>
                <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest block mb-1 font-mono">
                  Operational Orchestrator
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  Intelligent Multi-Channel Mastery Center
                </h2>
                <p className="text-[#888888] text-xs mt-1.5 max-w-xl">
                  Insert raw copy, campaign objectives, or announcements. Click "Sync Distribution Queue" to rewrite algorithm-compliant drafts simultaneously for each linked channel.
                </p>
              </div>

              {/* Composer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Control Inputs (Col-5) */}
                <div className="lg:col-span-5 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-5 space-y-4">
                  
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-2 font-mono">
                      Pre-loaded Prompts
                    </span>
                    <div className="space-y-1.5">
                      {PRELOADED_DRAFTS.map(draft => (
                        <button
                          key={draft.id}
                          onClick={() => handleTemplateSelect(draft.id)}
                          className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all flex flex-col justify-between ${
                            selectedTemplate === draft.id
                              ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-white shadow-inner font-semibold'
                              : 'bg-[#444444]/10 border-[#444444] text-[#888888] hover:border-[#888888]/40 hover:text-[#F7F3EC]'
                          }`}
                        >
                          <span className="block">{draft.title}</span>
                          <span className="text-[9px] opacity-75 mt-0.5">Audience: {draft.audience}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-2 font-mono">
                      Raw Concept / Announcement Input
                    </span>
                    <textarea
                      value={customText}
                      onChange={handleCustomTextChange}
                      rows={5}
                      placeholder="Type raw ideas, pricing plans, launch hooks, or email content here..."
                      className="w-full p-3 bg-[#444444]/25 border border-[#444444] rounded-xl text-xs text-[#F7F3EC] focus:outline-none focus:border-[#C9A84C] placeholder-[#888888]/50 font-sans"
                    />
                  </div>

                  {user.connectedPlatforms.length === 0 ? (
                    <div className="p-3 bg-yellow-950/20 border border-yellow-500/30 rounded-xl text-xs text-yellow-300 flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>You have disconnected all platforms. Drafts will compile utilizing static fallbacks. Go to settings to join channels now!</span>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    <button
                      onClick={runOptimization}
                      disabled={isProcessing || !customText.trim()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing Queue...' : 'Sync Distribution Queue'}
                    </button>
                    <button
                      onClick={handleSaveCampaign}
                      disabled={!customText.trim()}
                      title="Save campaign copy block to your local history archive"
                      className="px-3 py-3 rounded-xl bg-[#444444]/20 border border-[#444444] hover:bg-[#444444]/40 text-[#F7F3EC] cursor-pointer"
                    >
                      Save
                    </button>
                  </div>

                </div>

                {/* Draft Results Output (Col-7) */}
                <div className="lg:col-span-7 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-5 min-h-[400px] flex flex-col justify-between">
                  
                  {isProcessing ? (
                    <div className="flex-1 py-16 flex flex-col items-center justify-center text-center animate-pulse">
                      <div className="relative w-14 h-14 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                        <div className="absolute inset-2 bg-[#C9A84C]/10 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                        </div>
                      </div>
                      <h4 className="font-display font-semibold text-white text-sm mb-1.5">Synapse Optimization Pipeline Live</h4>
                      <p className="text-[10px] text-[#C9A84C] font-mono uppercase tracking-widest">{processingStep}</p>
                    </div>
                  ) : optimizedOutputs ? (
                    <div className="space-y-4">
                      
                      {/* Platforms tab switcher */}
                      <div className="flex flex-wrap gap-1 border-b border-[#444444]/80 pb-2.5">
                        {user.connectedPlatforms.length > 0 ? (
                          user.connectedPlatforms.map(platformId => (
                            <button
                              key={platformId}
                              onClick={() => setActiveResultTab(platformId)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                activeResultTab === platformId
                                  ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold shadow-sm'
                                  : 'text-[#888888] hover:text-[#F7F3EC] hover:bg-[#444444]/20'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                {getChannelIcon(platformId, 'w-3.5 h-3.5')}
                                {platformId}
                              </span>
                            </button>
                          ))
                        ) : (
                          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C9A84C] text-[#0D1B2A] cursor-default">
                            LinkedIn Pro (Default fallback)
                          </button>
                        )}
                      </div>

                      {/* Display Selected Draft Output */}
                      {(() => {
                        const currentId = activeResultTab || (user.connectedPlatforms[0] || 'linkedin');
                        const r = optimizedOutputs[currentId];
                        if (!r) return <div className="text-center text-xs text-[#888888] py-8">Review template output inside active target tab above.</div>;
                        const copied = copiedStates[currentId];
                        return (
                          <div className="space-y-4">
                            
                            {/* Analytics predicted lift indicators */}
                            <div className="grid grid-cols-3 gap-2 text-center bg-[#444444]/10 p-2 border border-[#444444]/60 rounded-xl">
                              <div className="p-1 px-2 border-r border-[#444444]/60">
                                <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Hook Adapt</span>
                                <span className="text-xs font-bold text-white block mt-0.5">{r.hookType}</span>
                              </div>
                              <div className="p-1 px-2 border-r border-[#444444]/60">
                                <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Reach Boost</span>
                                <span className="text-xs font-mono font-bold text-[#C9A84C] block mt-0.5">{r.reachMultiplier}x Lift</span>
                              </div>
                              <div className="p-1 px-2">
                                <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Tone score</span>
                                <span className="text-xs font-mono font-bold text-[#F7F3EC] block mt-0.5">{r.toneScore}% Compliant</span>
                              </div>
                            </div>

                            {/* Main output text */}
                            <div className="relative">
                              <pre className="p-3.5 bg-[#444444]/25 text-[11px] text-[#F7F3EC] leading-relaxed rounded-xl whitespace-pre-wrap font-sans border border-[#444444]/50 select-text outline-none focus:ring-1 focus:ring-[#C9A84C]/45 max-h-[220px] overflow-y-auto">
                                {r.content}
                              </pre>
                              
                              <button
                                onClick={() => copyToClipboard(r.content, currentId)}
                                className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#444444] hover:bg-[#C9A84C] hover:text-[#0D1B2A] text-white transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] inline-flex items-center gap-1 leading-none shadow"
                              >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied' : 'Copy Draft'}
                              </button>
                            </div>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-1">
                              {r.hashtags.map((tag, tIdx) => (
                                <span key={tIdx} className="text-[9px] font-mono text-[#C9A84C] bg-[#C9A84C]/5 px-2 py-0.5 rounded-md border border-[#C9A84C]/20">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Schedule peak performance post */}
                            <button
                              onClick={() => handleSchedulePost(currentId, r.content, r.hookType, r.reachMultiplier)}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/25 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Schedule Peak Performance Post (AI Optimal Slot)
                            </button>

                            {/* Diagnostic Tips from AI */}
                            <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/35 rounded-xl p-3 text-[10px] text-[#F7F3EC] space-y-1.5">
                              <span className="block uppercase font-bold tracking-widest text-[#C9A84C] font-mono text-[9px]">
                                Co-Pilot Feed Diagnostics & Recommendations:
                              </span>
                              {r.tips.map((t, idx) => (
                                <p key={idx} className="flex items-start gap-1">
                                  <span className="text-[#C9A84C] font-bold shrink-0">✓</span>
                                  <span>{t}</span>
                                </p>
                              ))}
                            </div>

                          </div>
                        );
                      })()}

                    </div>
                  ) : (
                    <div className="flex-1 py-16 flex flex-col items-center justify-center text-center text-[#888888] space-y-3">
                      <Sparkles className="w-12 h-12 text-[#C9A84C]/40 stroke-[1.5]" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">Composer Ready</h4>
                        <p className="text-[11px] leading-relaxed max-w-sm mt-0.5">
                          Select one of our high-performing templates on the left or enter a custom post. Click generate to launch the multi-channel rewrite co-pilot!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Operational Footer Details */}
                  <div className="pt-3.5 border-t border-[#444444]/60 flex items-center justify-between text-[9px] text-[#888888] font-mono uppercase tracking-widest leading-none mt-4">
                    <span>Algorithm version: 4.8.2</span>
                    <span>Tonal configuration: {user.brandTone?.replace('-', ' ')}</span>
                  </div>

                </div>

              </div>
              
              {/* Workspace Saved Archive List */}
              <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm tracking-tight text-white block">
                    Local Campaign Library ({savedCampaigns.length})
                  </h3>
                  <span className="text-[9px] text-[#888888] uppercase tracking-wider font-mono">Persistent history archive</span>
                </div>
                
                {savedCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedCampaigns.map((camp) => (
                      <div key={camp.id} className="p-4 bg-[#444444]/10 border border-[#444444] rounded-xl text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 font-semibold">
                            <span className="truncate text-white max-w-[200px]">{camp.title}</span>
                            <span className="text-[10px] text-[#888888] font-mono">{camp.createdAt}</span>
                          </div>
                          <p className="text-[#888888] text-[11px] line-clamp-3 leading-relaxed mb-4">{camp.rawText}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2.5 border-t border-[#444444]/40">
                          <div className="flex gap-1.5">
                            {camp.channels?.map((c: string) => (
                              <span key={c} className="text-[8px] uppercase tracking-wider font-bold text-[#C9A84C] bg-[#C9A84C]/5 px-1.5 py-0.5 rounded border border-[#C9A84C]/25 font-mono">
                                {c}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCustomText(camp.rawText);
                                setSelectedTemplate('custom');
                                setOptimizedOutputs(null);
                                window.scrollTo({ top: 120, behavior: 'smooth' });
                              }}
                              className="text-[10px] text-[#C9A84C] font-semibold hover:underline"
                            >
                              Load
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(camp.id)}
                              className="text-[10px] text-red-400 font-semibold hover:underline"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-[#888888] border border-dashed border-[#444444] rounded-xl text-xs">
                    Workspace Campaign Library is currently empty! Click save button in composer to stash raw ideas permanently.
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
              
              {/* Premium Dashboard Header Card */}
              <div className="bg-gradient-to-tr from-[#0D1B2A] to-[#444444]/30 border border-[#444444] rounded-2xl p-6 relative">
                <div className="absolute top-4 right-4 text-[#C9A84C]/25">
                  <Settings className="w-16 h-16 stroke-[1]" />
                </div>
                <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest block mb-1 font-mono">
                  Administrative Center
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-2.5xl text-white">
                  Synapse Workspace Admin Control
                </h2>
                <p className="text-[#888888] text-xs mt-1.5 max-w-xl">
                  Configure subscription plans, manage security keys, tweak team member access control, and adjust notification alerts for your digital agency marketing team.
                </p>

                {/* Secondary Pill Sub-Tabs Navigation */}
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#444444]/50">
                  {[
                    { id: 'profile', label: 'Account & Workspace', icon: <Users className="w-3.5 h-3.5" /> },
                    { id: 'billing', label: 'Subscription & Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
                    { id: 'security', label: 'Passcode & Security', icon: <Lock className="w-3.5 h-3.5" /> },
                    { id: 'team', label: 'Team User Control', icon: <Shield className="w-3.5 h-3.5" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAdminSubTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        adminSubTab === tab.id
                          ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold'
                          : 'bg-[#444444]/20 text-[#888888] hover:text-white hover:bg-[#444444]/35 border border-[#444444]/60'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-tab: ACCOUNT PROFILE & NOTIFICATIONS */}
              {adminSubTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Workspace / Account Profile Settings Card (Col-6) */}
                  <div className="lg:col-span-6 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Workspace General Profile</h3>
                      <p className="text-[10px] text-[#888888]">Review key workspace identifiers for your content organization</p>
                    </div>

                    <form onSubmit={handleUpdateWorkspaceName} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-[#888888] tracking-wider block font-mono">
                          Registered Owner Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-3 py-2 bg-[#444444]/10 border border-[#444444]/50 rounded-lg text-xs font-mono text-[#888888] cursor-not-allowed"
                        />
                        <span className="text-[9px] text-[#888888] font-mono block">Owner credentials cannot be altered on the fly</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-wider block font-mono">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          value={newWorkspaceNameInput}
                          onChange={(e) => setNewWorkspaceNameInput(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                          placeholder="e.g. Acme Marketing Studio"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2 bg-[#C9A84C] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#C9A84C]/90 transition-all cursor-pointer"
                        >
                          Update Workspace Hub Name
                        </button>
                      </div>

                      {editWorkspaceSuccess && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400 font-semibold animate-pulse">
                          ✓ Workspace name was renamed to "{newWorkspaceNameInput}" in the local system database!
                        </div>
                      )}
                    </form>

                    <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl space-y-1">
                      <span className="text-[9px] text-[#C9A84C] font-extrabold uppercase font-mono tracking-widest block">AI Calibration Strategy</span>
                      <p className="text-[11px] text-[#888888] leading-relaxed">
                        Your workspace is calibrated to target the <span className="text-white font-bold capitalize">"{user.brandTone?.replace('-', ' ')}"</span> narrative loop. Changing connected platform queues will automatically re-index the timing recommendations.
                      </p>
                    </div>
                  </div>

                  {/* Notification Preferences Card (Col-6) */}
                  <div className="lg:col-span-6 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Notification Alert Engines</h3>
                      <p className="text-[10px] text-[#888888]">Enable real-time triggers to keep your publishing pipeline connected</p>
                    </div>

                    <form onSubmit={handleSavePreferences} className="space-y-4">
                      
                      {/* Checkbox 1 */}
                      <label className="flex items-start gap-3 p-3 bg-[#444444]/10 hover:bg-[#444444]/20 rounded-xl border border-[#444444]/40 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifyOptimalSlots}
                          onChange={(e) => setNotifyOptimalSlots(e.target.checked)}
                          className="mt-0.5 rounded border-[#444444] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D1B2A]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-white block">AI Optimal Slot Alerts</span>
                          <p className="text-[10px] text-[#888888] leading-normal">Pings when peak-performance distribution channels are open</p>
                        </div>
                      </label>

                      {/* Checkbox 2 */}
                      <label className="flex items-start gap-3 p-3 bg-[#444444]/10 hover:bg-[#444444]/20 rounded-xl border border-[#444444]/40 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifyWeeklySummary}
                          onChange={(e) => setNotifyWeeklySummary(e.target.checked)}
                          className="mt-0.5 rounded border-[#444444] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D1B2A]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-white block">Weekly Reach Digests</span>
                          <p className="text-[10px] text-[#888888] leading-normal">Send a summarized analytical progress report to team email</p>
                        </div>
                      </label>

                      {/* Checkbox 3 */}
                      <label className="flex items-start gap-3 p-3 bg-[#444444]/10 hover:bg-[#444444]/20 rounded-xl border border-[#444444]/40 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifySystemStatus}
                          onChange={(e) => setNotifySystemStatus(e.target.checked)}
                          className="mt-0.5 rounded border-[#444444] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D1B2A]"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-white block">Algorithmic Tectonic Shifts</span>
                          <p className="text-[10px] text-[#888888] leading-normal">Alert instantly if X or LinkedIn deploy code updates affecting CTR</p>
                        </div>
                      </label>

                      {/* Checkbox 4 (Slack Webhook) */}
                      <div className="space-y-2 p-3 bg-[#444444]/10 rounded-xl border border-[#444444]/40">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={notifyWebhook}
                            onChange={(e) => setNotifyWebhook(e.target.checked)}
                            className="mt-0.5 rounded border-[#444444] text-[#C9A84C] focus:ring-[#C9A84C] bg-[#0D1B2A]"
                            id="slack-alert-pref"
                          />
                          <label htmlFor="slack-alert-pref" className="space-y-0.5 cursor-pointer">
                            <span className="text-xs font-semibold text-white block">Slack Messaging Integration</span>
                            <p className="text-[10px] text-[#888888] leading-normal">Relay final hook predictions directly into corporate slack channels</p>
                          </label>
                        </div>
                        {notifyWebhook && (
                          <div className="pt-2">
                            <input
                              type="text"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-[10px] font-mono text-emerald-400 focus:outline-none"
                              placeholder="Slack Webhook Target URL"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-[#C9A84C]/15 border border-[#C9A84C]/35 hover:bg-[#C9A84C]/25 text-[#C9A84C] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Save Alerts Protocol
                        </button>
                      </div>

                      {prefSuccess && (
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400 font-semibold text-center animate-pulse">
                          ✓ Notification settings updated successfully.
                        </div>
                      )}

                    </form>
                  </div>

                </div>
              )}

              {/* Sub-tab: PLANS, TRIALS & BILLING DETAILS */}
              {adminSubTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Pricing Plans Split Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Starter Card */}
                    <div className={`p-6 rounded-2xl border transition-all ${
                      billingPlan === 'starter'
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]'
                        : 'bg-[#444444]/10 border-[#444444] opacity-80'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] tracking-widest font-mono font-bold uppercase text-[#888888] px-2 py-0.5 bg-[#444444]/40 border border-[#444444] rounded-full">
                            Starter Package
                          </span>
                          <h4 className="font-display font-black text-xl text-white mt-1.5">Launch Starter</h4>
                          <p className="text-[10px] text-[#888888] mt-0.5">Ideal for basic standalone creators</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-mono font-extrabold text-[#C9A84C] block">
                            ${billingCycle === 'monthly' ? '10' : '8'}
                            <span className="text-xs text-[#888888] font-normal font-sans">/mo</span>
                          </span>
                          {billingCycle === 'annual' && <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">Billed Annually (-20%)</span>}
                        </div>
                      </div>

                      <ul className="space-y-2.5 my-5 text-[11px] text-[#888888]">
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Up to 3 connected stream accounts
                        </li>
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Generative hook drafts structure validation
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-450/40" />
                          Basic priority timing (Standard)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-450/40" />
                          Single User / Workspace Account
                        </li>
                      </ul>

                      <button
                        onClick={() => setBillingPlan('starter')}
                        className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          billingPlan === 'starter'
                            ? 'bg-[#C9A84C] text-[#0D1B2A]'
                            : 'bg-[#444444]/20 hover:bg-[#444444]/35 text-white border border-[#444444]'
                        }`}
                      >
                        {billingPlan === 'starter' ? '✓ Registered Current Tier' : 'Downgrade to Starter'}
                      </button>
                    </div>

                    {/* Pro Card */}
                    <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
                      billingPlan === 'pro'
                        ? 'bg-gradient-to-br from-[#0D1B2A] to-[#C9A84C]/15 border-[#C9A84C]'
                        : 'bg-[#444444]/10 border-[#444444] opacity-85'
                    }`}>
                      <div className="absolute top-0 right-0 bg-[#C9A84C] text-[#0D1B2A] text-[8px] tracking-widest font-black uppercase font-mono px-3 py-1 rounded-bl">
                        Popular AI Copilot
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] tracking-widest font-mono font-black uppercase text-[#0D1B2A] px-2 py-0.5 bg-[#C9A84C] rounded-full">
                              Pro Mastery
                            </span>
                            <span className="text-[8px] tracking-widest font-mono font-black uppercase text-emerald-400 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full animate-pulse">
                              14-Day Free Trial
                            </span>
                          </div>
                          <h4 className="font-display font-black text-xl text-white mt-1.5">AI Co-Pilot Master</h4>
                          <p className="text-[10px] text-[#888888] mt-0.5">Optimal for agencies, creators & SMB digital hubs</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-mono font-extrabold text-[#C9A84C] block">
                            ${billingCycle === 'monthly' ? '100' : '80'}
                            <span className="text-xs text-[#888888] font-normal font-sans">/mo</span>
                          </span>
                          {billingCycle === 'annual' && <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">Billed Annually (-20%)</span>}
                        </div>
                      </div>

                      <ul className="space-y-2.5 my-5 text-[11px] text-[#888888]">
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
                          Unlimited connected active channel streams
                        </li>
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
                          Multi-factor tone profiles & algorithmic rules
                        </li>
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
                          Advanced predictive reach multipliers logs
                        </li>
                        <li className="flex items-center gap-2 text-white">
                          <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
                          Interactive user roster (Agency team management)
                        </li>
                      </ul>

                      <button
                        onClick={() => setBillingPlan('pro')}
                        className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          billingPlan === 'pro'
                            ? 'bg-[#C9A84C] text-[#0D1B2A]'
                            : 'bg-[#444444]/20 hover:bg-[#444444]/35 text-white border border-[#444444]'
                        }`}
                      >
                        {billingPlan === 'pro' ? '✓ Registered Current Tier' : 'Upgrade to Pro Master Plan'}
                      </button>
                    </div>

                  </div>

                  {/* Interactive toggle billing period */}
                  <div className="flex items-center justify-between bg-[#444444]/10 p-4 border border-[#444444]/75 rounded-2xl gap-4 flex-wrap">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block font-sans">Flexible Billing Cycle</span>
                      <p className="text-[10px] text-[#888888]">Switch to annual billing schedules to secure twenty percent overall saving indices.</p>
                    </div>
                    <div className="flex rounded-lg bg-[#444444]/20 border border-[#444444]/60 p-1 shrink-0">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          billingCycle === 'monthly' ? 'bg-[#C9A84C] text-[#0D1B2A]' : 'text-[#888888] hover:text-white'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          billingCycle === 'annual' ? 'bg-[#C9A84C] text-[#0D1B2A]' : 'text-[#888888] hover:text-white'
                        }`}
                      >
                        Annual (-20%)
                      </button>
                    </div>
                  </div>

                  {/* Free Trial Ticker Alert */}
                  {billingPlan === 'pro' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-xs font-bold text-white">Active Trial Sequence Registered</span>
                        </div>
                        <p className="text-[10px] text-[#888888] max-w-xl">
                          You are currently on the 14-day Pro subscription trial. Your configured credit card ending in {cardNumber.substring(cardNumber.length - 4)} will not be billed until the trial finishes on June 19, 2026.
                        </p>
                      </div>
                      <div className="bg-[#444444]/20 p-2.5 border border-[#444444] rounded-xl text-center shrink-0">
                        <h5 className="font-mono text-lg font-black text-amber-450 text-[#C9A84C]">12 Days</h5>
                        <p className="text-[9px] uppercase tracking-wider text-[#888888]">Trial Days Left</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Credit-Card details & Billing Updates */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Visual Card Display (Col-5) */}
                    <div className="lg:col-span-5 bg-[#444444]/15 border border-[#444444]/85 rounded-2xl p-6 flex flex-col justify-between space-y-8 relative overflow-hidden h-[240px]">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9A84C]/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start bg-transparent">
                        <div>
                          <span className="text-[8px] uppercase font-mono tracking-widest text-[#C9A84C] font-bold">Synapse Sync Master</span>
                          <span className="block text-sm font-semibold text-[#888888] mt-1">Payment Method</span>
                        </div>
                        <div className="p-1 px-2.5 bg-white/5 border border-white/10 rounded font-bold font-mono text-[9px] text-white">
                          SSL Secure
                        </div>
                      </div>

                      {/* Card Chip Visual */}
                      <div className="w-10 h-7 rounded bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center p-1.5 self-start">
                        <div className="w-full h-full border border-[#C9A84C]/25 rounded opacity-60 bg-transparent" />
                      </div>

                      <div className="space-y-3 pt-4 bg-transparent col-span-1">
                        <span className="block font-mono text-lg font-extrabold text-white tracking-widest">
                          {cardNumber}
                        </span>
                        
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#888888] font-mono bg-transparent">
                          <div>
                            <span className="block text-[7px] text-[#888888]">Card Holder</span>
                            <span className="font-bold text-white text-[10px] font-sans block mt-0.5 truncate max-w-[150px]">{cardholderName}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[7px] text-[#888888]">Expires</span>
                            <span className="font-bold text-white text-[10px] block mt-0.5">{cardExpiry}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card edit form (Col-7) */}
                    <div className="lg:col-span-7 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6">
                      <h4 className="font-display font-bold text-sm text-white mb-4">Update Card Details</h4>
                      
                      <form onSubmit={handleUpdateCard} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Cardholder Name</label>
                            <input
                              type="text"
                              value={editCardholderName}
                              onChange={(e) => setEditCardholderName(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none"
                              placeholder="Jane Doe"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Card number</label>
                            <input
                              type="text"
                              maxLength={16}
                              value={editCardNumber}
                              onChange={(e) => setEditCardNumber(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none"
                              placeholder="4242424242424242"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Expiry MM/YY</label>
                            <input
                              type="text"
                              placeholder="12/28"
                              maxLength={5}
                              value={editCardExpiry}
                              onChange={(e) => setEditCardExpiry(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">CVV Secure</label>
                            <input
                              type="text"
                              placeholder="321"
                              maxLength={3}
                              value={editCardCvv}
                              onChange={(e) => setEditCardCvv(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Billing Postcode</label>
                            <input
                              type="text"
                              placeholder="94105"
                              value={editPostalCode}
                              onChange={(e) => setEditPostalCode(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                        >
                          Update Billing Card Credentials
                        </button>

                        {cardSuccess && (
                          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400 font-semibold animate-pulse text-center">
                            ✓ Payment card credentials updated successfully! Changes reflected in visual credit-card dashboard.
                          </div>
                        )}

                        {cardError && (
                          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[11px] text-red-400 font-semibold text-center">
                            ⚠ {cardError}
                          </div>
                        )}
                      </form>
                    </div>

                  </div>

                  {/* Historic Invoices Data list */}
                  <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Receipts & Invoice Billing History</h3>
                      <p className="text-[10px] text-[#888888]">Retrieve historic PDF statements and subscription billing logs securely</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#444444]">
                            <th className="py-2.5 text-[#888888] font-mono uppercase tracking-wider text-[10px]">Invoice ID</th>
                            <th className="py-2.5 text-[#888888] font-mono uppercase tracking-wider text-[10px]">Settled Date</th>
                            <th className="py-2.5 text-[#888888] font-mono uppercase tracking-wider text-[10px]">Billing Description</th>
                            <th className="py-2.5 text-[#888888] font-mono uppercase tracking-wider text-[10px]">Amount Paid</th>
                            <th className="py-2.5 text-[#888888] font-mono uppercase tracking-wider text-[10px]">Status</th>
                            <th className="py-2.5 text-right text-[#888888] font-mono uppercase tracking-wider text-[10px]">Document Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#444444]/50">
                          {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-[#444444]/5">
                              <td className="py-3 text-white font-mono font-bold">{inv.id}</td>
                              <td className="py-3 text-[#F7F3EC]">{inv.date}</td>
                              <td className="py-3 text-[#888888] font-medium">{inv.plan}</td>
                              <td className="py-3 text-[#C9A84C] font-semibold font-mono">
                                {inv.id !== 'INV-2026-001' ? (billingPlan === 'pro' ? '$100.00' : '$10.00') : '$0.00'}
                              </td>
                              <td className="py-3 bg-transparent">
                                <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-3 text-right bg-transparent">
                                <button
                                  onClick={() => handleDownloadInvoice(inv.id, inv.id !== 'INV-2026-001' ? (billingPlan === 'pro' ? '$100.00' : '$10.00') : '$0.00')}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#C9A84C] hover:underline cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>PDF Receipt</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Sub-tab: SECURE PASSWORD CHANGES & 2FA ACCESS CONTROL */}
              {adminSubTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                  
                  {/* Password change form (Col-7) */}
                  <div className="lg:col-span-7 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4 font-sans">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Reset Security Access Passcode</h3>
                      <p className="text-[10px] text-[#888888]">Configure security settings and update key access tokens below</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Current passcode</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-2.5 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">New passcode</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-2.5 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                            placeholder="Min 6 characters"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Confirm new passcode</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-2.5 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-mono"
                      >
                        Reset Secured Passcode
                      </button>

                      {passwordSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-semibold text-center animate-pulse">
                          ✓ {passwordSuccess}
                        </div>
                      )}

                      {passwordError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-semibold text-center">
                          ⚠ {passwordError}
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Multi factor auth toggle panel (Col-5) */}
                  <div className="lg:col-span-5 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Multi-Factor Authenticator (2FA)</h3>
                      <p className="text-[10px] text-[#888888]">Secure your workspace from unauthorized dashboard access</p>
                    </div>

                    <div className="p-4 bg-[#444444]/10 rounded-xl border border-[#444444]/40 flex flex-col justify-between h-[180px]">
                      <div className="flex justify-between items-start bg-transparent">
                        <span className="text-[10px] font-mono tracking-wider text-[#888888] uppercase block">
                          Credential status
                        </span>
                        <span className={`text-[8px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                          enable2FA
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                            : 'text-[#888888] bg-[#444444]/30 border-[#444444]'
                        }`}>
                          {enable2FA ? 'Locked Secure' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#888888] leading-relaxed my-2 bg-transparent">
                        Enforce dual factor passcode verification on workspace log-ins to assure extreme compliance security.
                      </p>

                      <button
                        onClick={() => {
                          setEnable2FA(!enable2FA);
                          alert(enable2FA ? "Security warning: Multi-Factor Authentication deactivated." : "Success: 2FA protocol registered. Next log-ins will request pin validation.");
                        }}
                        className={`w-full py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          enable2FA
                            ? 'bg-[#444444]/30 hover:bg-[#444444]/45 text-white border border-[#444444]'
                            : 'bg-[#C9A84C]/15 border border-[#C9A84C]/35 hover:bg-[#C9A84C]/25 text-[#C9A84C]'
                        }`}
                      >
                        {enable2FA ? 'Deactivate 2FA Shield' : 'Enforce 2FA Shield'}
                      </button>
                    </div>

                    {/* API keys credentials reminder */}
                    <div className="p-3.5 bg-[#C9A84C]/5 border border-[#C9A84C]/25 rounded-xl text-[10px] text-[#888888] leading-relaxed space-y-1">
                      <span className="text-[#C9A84C] font-bold uppercase tracking-widest block font-mono text-[9px]">
                        Google Workspace Token Protection
                      </span>
                      <p>
                        All API proxies and JWT session identifiers are strictly ciphered in salt databases. Team session timeouts terminate after 12 hours of inactivity automatically.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Sub-tab: TEAM USER CONTROL / ROSTERS */}
              {adminSubTab === 'team' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Main roster visual box & Add Collaborator Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Active Workspace users (Col-8) */}
                    <div className="lg:col-span-8 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-sm text-white">Active Team Collaborators</h3>
                        <p className="text-[10px] text-[#888888]">Manage personnel authorized to view or edit this brand’s campaigns</p>
                      </div>

                      {/* Members card list */}
                      <div className="space-y-3">
                        {teamMembers.map(member => {
                          const isSelf = member.id === 'team-owner';
                          return (
                            <div key={member.id} className="p-4 bg-[#444444]/10 rounded-xl border border-[#444444]/50 flex items-center justify-between text-xs gap-4 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-3">
                                {/* Visual placeholder icon */}
                                <div className="w-9 h-9 rounded-full bg-[#444444]/30 border border-[#444444] text-[#C9A84C] flex items-center justify-center font-bold text-xs uppercase font-mono shrink-0">
                                  {member.name.substring(0, 2)}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-white truncate max-w-[150px]">{member.name}</span>
                                    {isSelf && (
                                      <span className="text-[8px] font-bold uppercase font-mono tracking-widest text-[#C9A84C] px-1.5 py-0.2 bg-[#C9A84C]/5 border border-[#C9A84C]/25 rounded">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#888888] font-mono truncate max-w-[180px]">{member.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-[10px] flex-wrap sm:flex-nowrap">
                                {/* Role status clicker */}
                                <div className="text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleChangeMemberRole(member.id, member.role)}
                                    disabled={isSelf}
                                    className={`font-semibold font-mono px-2 py-1 rounded border capitalize transition-all ${
                                      isSelf 
                                        ? 'text-white bg-[#444444]/20 border-white/10 cursor-default'
                                        : 'text-[#C9A84C] bg-[#C9A84C]/5 border-[#C9A84C]/20 hover:bg-[#C9A84C]/20 cursor-pointer'
                                    }`}
                                    title={isSelf ? "Owner privilege" : "Click to cycle role privilege settings"}
                                  >
                                    {member.role}
                                  </button>
                                  <span className="text-[8px] text-[#888888] block text-right mt-1 font-mono uppercase tracking-widest bg-transparent">
                                    {member.status} Status
                                  </span>
                                </div>

                                {/* Remove button action */}
                                {!isSelf && (
                                  <button
                                    onClick={() => handleRemoveTeamMember(member.id, member.name)}
                                    className="p-1 px-2.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    title="Revoke access immediately"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* Add team member (Col-4) */}
                    <div className="lg:col-span-4 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-sm text-white">Invite Team Personnel</h3>
                        <p className="text-[10px] text-[#888888]">Grant collaborators dashboard access immediately</p>
                      </div>

                      <form onSubmit={handleAddTeamMember} className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Full name</label>
                          <input
                            type="text"
                            required
                            value={addMemberName}
                            onChange={(e) => setAddMemberName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                            placeholder="e.g. Liam Sterling"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Work email address</label>
                          <input
                            type="email"
                            required
                            value={addMemberEmail}
                            onChange={(e) => setAddMemberEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                            placeholder="liam@acmeagency.com"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#888888] block font-mono">Authorized Role</label>
                          <select
                            value={addMemberRole}
                            onChange={(e) => setAddMemberRole(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#444444]/25 border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#C9A84C]"
                          >
                            <option value="Administrator (Admin)">Administrator (Admin)</option>
                            <option value="Editor / Publisher">Editor / Publisher</option>
                            <option value="Analyst / Viewer">Analyst / Viewer</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-mono flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4 shrink-0" />
                          Send Invitation Link
                        </button>

                        {teamSuccess && (
                          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-400 font-semibold text-center animate-pulse">
                            ✓ {teamSuccess}
                          </div>
                        )}

                        {teamError && (
                          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[11px] text-red-150 text-red-400 font-semibold text-center">
                            ⚠ {teamError}
                          </div>
                        )}
                      </form>

                      {/* Agency multi seat notice info box */}
                      <div className="p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl text-[10px] leading-relaxed text-[#888888] space-y-1.5">
                        <span className="text-[#F7F3EC] font-bold uppercase tracking-widest block font-mono text-[9px]">
                          Agency Seats Cap Index
                        </span>
                        <p>
                          Your active <span className="text-[#C9A84C] font-bold">Pro Package</span> supports up to 10 team seats simultaneously. Reach out to Synapse enterprise reps to unlock larger workspace allocations.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {activeTab === 'channels' && (
            <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-6">
              
              <div className="pb-4 border-b border-[#444444] flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">Central Connection Manager</h2>
                  <p className="text-[#888888] text-xs mt-1 leading-normal">
                    Link and synchronize distribution channels below to broaden Synapse Sync's AI co-pilot capability.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  All Systems Verified
                </span>
              </div>

              {/* Edit workspace name form */}
              <form onSubmit={handleUpdateWorkspaceName} className="p-4 bg-[#444444]/15 rounded-xl border border-[#444444] space-y-3 max-w-lg">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A84C] block font-mono">Rename Marketing Hub Workspace</span>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    value={newWorkspaceNameInput}
                    onChange={(e) => setNewWorkspaceNameInput(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs focus:outline-none focus:border-[#C9A84C]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C9A84C] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#C9A84C]/95 transition-all cursor-pointer"
                  >
                    Rename Hub
                  </button>
                </div>
                {editWorkspaceSuccess && (
                  <span className="text-[10px] text-emerald-400 block font-semibold animate-pulse">✓ Workspace successfully renamed locally.</span>
                )}
              </form>

              {/* Platforms matrix list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allAvailablePlatformsList.map((p) => {
                  const isConnected = user.connectedPlatforms.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
                        isConnected
                          ? 'bg-[#888888]/5 border-[#C9A84C]/40 text-white'
                          : 'bg-[#444444]/10 border-[#444444] text-[#888888]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isConnected ? 'text-[#C9A84C] bg-[#C9A84C]/5' : 'text-[#888888] bg-[#444444]/20'}`}>
                          {getChannelIcon(p.id)}
                        </div>
                        <div>
                          <span className={`font-semibold text-xs block ${isConnected ? 'text-[#F7F3EC]' : 'text-[#888888]'}`}>{p.name}</span>
                          <span className="text-[10px] text-[#888888] mt-0.5 block">{p.desc}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => isConnected ? disconnectPlatform(p.id) : connectPlatform(p.id)}
                        className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/25'
                            : 'bg-[#444444]/35 hover:bg-[#444444]/55 border-[#444444] text-[#F7F3EC]'
                        }`}
                      >
                        {isConnected ? 'Linked' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Tone Selection hub */}
              <div className="p-5 bg-[#444444]/10 border border-[#444444] rounded-2xl space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] font-mono block">
                  AI Copilot Tonal Profile Calibration
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: 'thought-leader', label: 'Thought Leader Positioning' },
                    { id: 'viral-growth', label: 'Hook & Viral Growth' },
                    { id: 'educator', label: 'Value-Dense Classroom' },
                    { id: 'conversational', label: 'Narrative Personal Warmth' }
                  ].map((t) => {
                    const isActive = user.brandTone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => updateBrandTone(t.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#C9A84C] text-[#0D1B2A] border-[#C9A84C] font-extrabold'
                            : 'bg-[#444444]/13 border-[#444444] text-[#888888] hover:text-[#F7F3EC]'
                        }`}
                      >
                        {t.label} {isActive && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-6 animate-in fade-in duration-300">
              
              <div className="pb-4 border-b border-[#444444] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">Central Analytics & AI Co-Pilot</h2>
                  <p className="text-[#888888] text-xs mt-1 leading-normal">
                    Foresight engines, competitive intelligence, and customer persona simulators tuned for professional content mastery.
                  </p>
                </div>

                {/* Sub-Tabs Selector */}
                <div className="bg-[#444444]/15 border border-[#444444]/65 p-1 rounded-xl flex gap-1 self-start font-mono text-[10px] uppercase tracking-wider font-bold">
                  <button
                    type="button"
                    onClick={() => setAnalyticsSubTab('overview')}
                    className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      analyticsSubTab === 'overview' ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold' : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsSubTab('virality')}
                    className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      analyticsSubTab === 'virality' ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold' : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Virality Engine
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsSubTab('personas')}
                    className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      analyticsSubTab === 'personas' ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold' : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Client Personas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsSubTab('competitors')}
                    className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      analyticsSubTab === 'competitors' ? 'bg-[#C9A84C] text-[#0D1B2A] font-extrabold' : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" /> Peer Intel
                  </button>
                </div>
              </div>

              {/* TAB CONTENT: OVERVIEW */}
              {analyticsSubTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Highlights cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#444444]/20 to-[#444444]/5 p-4 rounded-xl border border-[#444444]/80 flex flex-col justify-between h-[110px]">
                      <div className="flex items-center justify-between text-[#888888]">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Estimated Reach Lift</span>
                        <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-white">2.8x</span>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Predicted across active slots</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#444444]/20 to-[#444444]/5 p-4 rounded-xl border border-[#444444]/80 flex flex-col justify-between h-[110px]">
                      <div className="flex items-center justify-between text-[#888888]">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Hook Compliant Index</span>
                        <Sliders className="w-4 h-4 text-[#C9A84C]" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-[#C9A84C]">92%</span>
                        <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Optimal density spacing</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#444444]/20 to-[#444444]/5 p-4 rounded-xl border border-[#444444]/80 flex flex-col justify-between h-[110px]">
                      <div className="flex items-center justify-between text-[#888888]">
                        <span className="text-[10px] uppercase font-bold tracking-wider">AI Synapse Precision</span>
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-extrabold text-white">0.3s</span>
                        <p className="text-[10px] text-[#888888] font-semibold mt-0.5">Platform telemetry speed</p>
                      </div>
                    </div>
                  </div>

                  {/* Reach Multiplier Predictions */}
                  <div className="p-5 bg-[#444444]/10 border border-[#444444] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] font-mono block">
                        Channel-Specific Reach Multiplier Predictions
                      </span>
                      <span className="text-[9px] text-[#888888] tracking-wider uppercase font-mono bg-[#444444]/35 px-2 py-0.5 rounded border border-[#444444]">
                        Continuous AI predictive stream
                      </span>
                    </div>

                    <div className="space-y-4 pt-2">
                      {[
                        { id: 'linkedin', label: 'LinkedIn Pro Feed', scale: 80, val: '2.8x Lift' },
                        { id: 'x', label: 'X / Twitter Feed', scale: 95, val: '3.1x Lift' },
                        { id: 'newsletter', label: 'Editorial Newsletter', scale: 72, val: '2.2x Lift' },
                        { id: 'video', label: 'YouTube Media/Shorts', scale: 88, val: '2.6x Lift' },
                        { id: 'medium', label: 'Medium Blog Engine', scale: 65, val: '1.9x Lift' }
                      ].map((chan) => (
                        <div key={chan.id} className="space-y-1 text-xs">
                          <div className="flex justify-between items-center text-[#888888] font-medium animate-pulse">
                            <span className="text-white font-bold">{chan.label}</span>
                            <span className="font-mono text-[#C9A84C] font-semibold">{chan.val}</span>
                          </div>
                          <div className="w-full bg-[#444444]/25 h-2 rounded-full overflow-hidden border border-[#444444]/30">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/45 transition-all duration-500"
                              style={{ width: `${chan.scale}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data driven insights block */}
                  <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/35 rounded-xl text-xs space-y-2 text-[#F7F3EC]">
                    <div className="flex gap-2 text-[#C9A84C] font-semibold select-none font-sans">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                      <span>Recommendation Analysis Engine</span>
                    </div>
                    <p className="text-[#888888] text-xs leading-relaxed">
                      Based on connected portfolios, LinkedIn and X are producing peak predicted resonance indices. We strongly advise launching summaries formatted utilizing structured threads during Tuesday-Wednesday morning intervals to optimize B2B brand traction.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PREDICTIVE VIRALITY */}
              {analyticsSubTab === 'virality' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Dynamic simulator input-output matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Panel: Input tester (Col-5) */}
                    <form onSubmit={handleSimulateVirality} className="lg:col-span-5 bg-[#444444]/15 border border-[#444444] rounded-xl p-5 space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] font-mono block mb-2 border-b border-[#444444]/40 pb-2">
                        Predictive Draft Tester
                      </span>
                      <p className="text-[11px] text-[#888888] leading-normal font-sans">
                        Submit any copy draft sequence to project algorithmic resonance, estimated CTR, and check for high-resonance vocabulary match.
                      </p>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">
                          Destination Channel
                        </label>
                        <select
                          value={viralSelectedPlatform}
                          onChange={(e) => setViralSelectedPlatform(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#444444]/25 border border-[#444444]/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                        >
                          <option value="linkedin">LinkedIn Pro Feed</option>
                          <option value="x">X / Twitter Algorithmic Thread</option>
                          <option value="newsletter">Editorial Email Newsletter</option>
                          <option value="video">Short-form Video Caption</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">
                          Copywriting Draft Text
                        </label>
                        <textarea
                          rows={6}
                          value={viralDraftText}
                          onChange={(e) => setViralDraftText(e.target.value)}
                          placeholder="Paste your draft text writeup here..."
                          className="w-full p-3.5 bg-[#444444]/25 border border-[#444444]/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#C9A84C] resize-none"
                        />
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#888888]">
                          <span>{viralDraftText.length} characters</span>
                          <span>Fits standard feed previews</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSimulatingVirality}
                        className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#0D1B2A] font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer font-semibold font-mono disabled:opacity-50"
                      >
                        {isSimulatingVirality ? (
                          <>
                            <Activity className="w-3.5 h-3.5 animate-spin text-[#0D1B2A]" />
                            Synthesizing Algorithmic Weights...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Synthesize Virality Score
                          </>
                        )}
                      </button>
                    </form>

                    {/* Right Panel: Output foresight summary (Col-7) */}
                    <div className="lg:col-span-7 bg-[#444444]/10 border border-[#444444]/70 rounded-xl p-5 space-y-6">
                      
                      {viralityPredictionResult && (
                        <div className="space-y-6">
                          
                          {/* Score Header section */}
                          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#444445]/30 pb-5">
                            
                            {/* SVG circular progress ring for Score */}
                            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center bg-[#444444]/15 rounded-full border border-[#444444]/50">
                              <span className="absolute text-3xl font-black text-white font-mono">{viralityPredictionResult.score}</span>
                              <span className="absolute bottom-4 text-[8px] font-bold uppercase tracking-wider text-[#C9A84C] font-mono">Virality Index</span>
                              
                              {/* Glowing circle decoration */}
                              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#C9A84C]/35 animate-spin [animation-duration:15s]" />
                            </div>

                            <div className="space-y-1.5 text-center sm:text-left">
                              <h4 className="text-white text-md font-extrabold flex items-center gap-2 justify-center sm:justify-start">
                                Forecasted Reach Status: <span className="text-[#C9A84C] font-bold font-mono">{viralityPredictionResult.momentumScale}</span>
                              </h4>
                              <p className="text-xs text-[#888888] font-sans leading-relaxed">
                                Our neural simulator projections demonstrate this draft ranks in the top <span className="text-white font-bold font-mono">14%</span> of historical B2B creators uploads.
                              </p>
                              
                              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start pt-1">
                                <span className="text-[10px] font-mono uppercase bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] px-2.5 py-0.5 rounded font-bold">
                                  Hook Rating: {viralityPredictionResult.hookScore}
                                </span>
                                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-bold">
                                  {viralityPredictionResult.engagementRatio}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick details metrics list */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 bg-[#444444]/15 rounded-xl border border-[#444444]/40 font-sans space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-[#888888] font-bold font-mono block">Channel Growth Multiplier</span>
                              <span className="text-white font-extrabold text-sm block tracking-wide">{viralityPredictionResult.predictedReachMultiplier} Lift</span>
                            </div>
                            <div className="p-3 bg-[#444444]/15 rounded-xl border border-[#444444]/40 font-sans space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-[#888888] font-bold font-mono block">Optimal Pipeline Slot</span>
                              <span className="text-[#C9A84C] font-extrabold text-sm block tracking-wide font-mono">{viralityPredictionResult.optimalPostingTimes}</span>
                            </div>
                          </div>

                          {/* Positives vs Opportunities lists */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold font-mono block flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Algorithmic Strengths
                              </span>
                              <ul className="space-y-1.5 text-[11px] text-[#888888] pl-5 list-disc leading-relaxed font-sans">
                                {viralityPredictionResult.positives.map((pos: string, idx: number) => (
                                  <li key={idx}>
                                    <strong className="text-zinc-200">Point #{idx+1}: </strong>{pos}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2 border-t border-[#444444]/20 pt-4">
                              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono block flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> AI Copywriting Optimization Tweaks
                              </span>
                              <ul className="space-y-2 text-[11px] text-[#888888] leading-relaxed pl-5 list-decimal font-sans">
                                {viralityPredictionResult.improvements.map((imp: string, idx: number) => (
                                  <li key={idx}>
                                    <span className="text-[#C9A84C] font-bold font-mono">Tweak #{idx+1}: </span> {imp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* TAB CONTENT: AUDIENCE SEGMENTATION */}
              {analyticsSubTab === 'personas' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Interactive audience profile selector & tester */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    
                    {/* Left: Selected Persona Bios & Selection Cards (Col-5) */}
                    <div className="lg:col-span-5 space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block font-mono border-b border-[#444444]/30 pb-2">
                        Cohort Audience Segments
                      </span>

                      <div className="space-y-3.5">
                        {personas.map((persona) => {
                          const isSelected = selectedPersonaId === persona.id;
                          return (
                            <button
                              key={persona.id}
                              type="button"
                              onClick={() => setSelectedPersonaId(persona.id)}
                              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden group ${
                                isSelected 
                                  ? 'bg-[#444444]/25 border-[#C9A84C] text-white shadow-md' 
                                  : 'bg-[#444444]/10 border-[#444444] text-[#888888] hover:border-[#888888]/40 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm block tracking-tight font-sans">
                                  {persona.name}
                                </span>
                                <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded border ${
                                  isSelected ? 'border-[#C9A84C]/50 text-[#C9A84C]' : 'border-[#444444] text-[#888888]'
                                }`}>
                                  {persona.cohortSize}
                                </span>
                              </div>

                              <p className="text-[11px] leading-relaxed opacity-90 font-sans">
                                {persona.bio}
                              </p>

                              <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-[#444444]/40 font-mono">
                                <span>Slots: {persona.optimalSlots.split(' & ')[0]}</span>
                                <span className="text-[#C9A84C] font-semibold underline">Configure Tailor</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    </div>

                    {/* Right: Interactive Persona suitability testing analyzer (Col-7) */}
                    <div className="lg:col-span-7 bg-[#444444]/10 border border-[#444444]/60 rounded-2xl p-5 space-y-6">
                      
                      <div className="border-b border-[#444445]/20 pb-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] font-mono block mb-1">
                          Segment Alignment Simulation Simulator
                        </span>
                        <p className="text-[11px] text-[#888888] leading-relaxed">
                          Test copy resonance against the active persona segment to evaluate sentiment matching and isolate clarity gaps.
                        </p>
                      </div>

                      <form onSubmit={handleSimulatePersona} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">
                            Copy draft for segment validation
                          </label>
                          <textarea
                            rows={3.5}
                            value={personaTestText}
                            onChange={(e) => setPersonaTestText(e.target.value)}
                            className="w-full p-3 bg-[#444444]/25 border border-[#444444] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#C9A84C]"
                            placeholder="Write your draft..."
                          />
                        </div>

                        <div className="flex justify-between items-center bg-[#444444]/15 p-2.5 rounded-xl border border-[#444444]/40 text-[10px] text-[#888888]">
                          <span>Active Segment Profile: <strong>{personas.find(p => p.id === selectedPersonaId)?.name}</strong></span>
                          <span>{personaTestText.length} characters</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isTestingPersona}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono"
                        >
                          {isTestingPersona ? (
                            <>
                              <Activity className="w-3.5 h-3.5 animate-spin" />
                              Validating Vocabulary Semantics...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Simulate Audience Cohort Alignment
                            </>
                          )}
                        </button>
                      </form>

                      {/* Display alignment results inside same card */}
                      {personaCompatibilityResult && (
                        <div className="bg-[#444444]/10 border border-[#C9A84C]/20 p-4 rounded-xl space-y-4 animate-in fade-in duration-300">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4.5 border-b border-[#444444]/40 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 flex items-center justify-center">
                                <span className="text-xl font-black font-mono text-[#C9A84C]">{personaCompatibilityResult.score}%</span>
                              </div>
                              <div>
                                <span className="text-xs text-[#888888] font-bold uppercase tracking-wider block">Cohort Fitness Index</span>
                                <span className="text-white font-bold text-xs font-mono">{personaCompatibilityResult.sentimentAlignment}</span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right font-mono text-[10px]">
                              <span className="text-[#888888] block">Forecasted Lift</span>
                              <span className="text-emerald-400 font-extrabold text-sm">{personaCompatibilityResult.engagementMultiplier}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold font-mono block mb-1">Resonance Highlights</span>
                              <div className="flex flex-wrap gap-1.5">
                                {personaCompatibilityResult.resonanceTags.map((tag: string, i: number) => (
                                  <span key={i} className="text-[9.5px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                                    ✓ {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-[#444444]/20 pt-3 space-y-1">
                              <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-bold font-mono block">Opportunities To Optimize For {personaCompatibilityResult.segment}</span>
                              <ul className="text-[11px] text-[#888888] pl-5 list-disc leading-relaxed font-sans space-y-1">
                                {personaCompatibilityResult.gapOpportunities.map((gap: string, i: number) => (
                                  <li key={i}>{gap}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* TAB CONTENT: COMPETITOR ANALYSIS */}
              {analyticsSubTab === 'competitors' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Benchmarking intelligence readout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Panel: Active Benchmarked Competitors (Col-7) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#444444]/40 pb-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] font-mono block">
                            Peer Performance & Strategy Matrix
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#888888]">{competitorList.length} Accounts Monitored</span>
                      </div>

                      <div className="space-y-3.5">
                        {competitorList.map((comp) => (
                          <div 
                            key={comp.id} 
                            className="bg-[#444444]/15 border border-[#444444] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden group hover:border-[#888888]/30 transition-all select-none"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white text-sm tracking-tight">{comp.name}</span>
                                <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold bg-[#444444]/25 text-[#888888] font-mono border border-[#444444]/30">
                                  {comp.platform}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#888888] leading-relaxed">
                                Best Performing Approach: <strong className="text-zinc-200">"{comp.bestStrategy}"</strong>
                              </p>
                              
                              <div className="flex items-center gap-3 text-[10px] font-mono text-[#888888] pt-1">
                                <span>Cohort Reach: <strong className="text-zinc-300 font-bold">{comp.followers || comp.subscribers}</strong></span>
                                <span>•</span>
                                <span>Resonance Rate: <strong className="text-[#C9A84C] font-bold">{comp.successRate}</strong></span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center font-mono gap-1 shrink-0">
                              <span className="text-[9px] text-[#888888] uppercase block font-bold">Dynamic Pulse</span>
                              <span className="text-emerald-450 font-bold text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                {comp.activeGrowth}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Right Panel: Insert Competitor URL/Keyword Query Form (Col-5) */}
                    <div className="lg:col-span-5 bg-[#444444]/10 border border-[#444444]/80 rounded-2xl p-5 space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] block font-mono border-b border-[#444444]/30 pb-2">
                        Configure Competitor Trackers
                      </span>
                      <p className="text-[11px] text-[#888888] leading-relaxed font-sans">
                        Input details below to query public RSS feeds or scrape corporate posts dynamically using Synapse.
                      </p>

                      <form onSubmit={handleAddCompetitor} className="space-y-3.5">
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">Competitor Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Acme Agency Corp"
                            value={newCompName}
                            onChange={(e) => setNewCompName(e.target.value)}
                            className="w-full px-3 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C9A84C] text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">Platform Monitor</label>
                            <select
                              value={newCompPlatform}
                              onChange={(e) => setNewCompPlatform(e.target.value)}
                              className="w-full px-2 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                            >
                              <option value="linkedin">LinkedIn</option>
                              <option value="x">X / Twitter</option>
                              <option value="newsletter">Email</option>
                              <option value="video">YouTube</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">Followers/Subs</label>
                            <input
                              type="text"
                              placeholder="e.g. 54k"
                              value={newCompFollowers}
                              onChange={(e) => setNewCompFollowers(e.target.value)}
                              className="w-full px-3 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C9A84C] text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase tracking-wider text-[#888888] font-bold font-mono">Observed High-Performing Strategy</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Interactive code posts, bi-weekly shorts"
                            value={newCompStrategy}
                            onChange={(e) => setNewCompStrategy(e.target.value)}
                            className="w-full px-3 py-2 bg-[#444444]/25 border border-[#444444] rounded-lg text-xs font-semibold focus:outline-none focus:border-[#C9A84C] text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#0D1B2A] font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 font-mono font-bold"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#0D1B2A]" /> Initialize Peer Live Benchmarking
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Workspace Footer details */}
      <footer className="border-t border-[#444444]/60 bg-[#0D1B2A] py-8 text-center text-xs text-[#888888] font-mono uppercase tracking-widest mt-12">
        <span>© {new Date().getFullYear()} Synapse Sync Inc. Unified Multichannel Control. All rights reserved.</span>
      </footer>

    </div>
  );
}
