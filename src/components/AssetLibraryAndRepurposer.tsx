import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Filter, 
  Sparkles, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  FileText, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Send, 
  Save, 
  BookOpen, 
  PenTool, 
  Mail, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Globe, 
  Tag, 
  ExternalLink, 
  Maximize2, 
  Eye, 
  Sliders, 
  ArrowUpRight,
  Info,
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  Settings,
  Download,
  Layout,
  Lock,
  Unlock,
  Layers,
  Palette
} from 'lucide-react';
import { CHANNEL_METADATA, generatePlatformOptimization } from '../templates';

// TS Interfaces
export interface Asset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'text';
  category: string;
  tags: string[];
  content: string; // The text content or asset description
  mediaUrl?: string; // If image, simulated preview. If video, preview details.
  dimensions?: string; // E.g., "1200 x 628 px"
  fileSize?: string; // E.g., "342 KB"
  duration?: string; // For videos: e.g., "0:45"
  createdAt: string;
}

interface AssetLibraryAndRepurposerProps {
  user: any;
  setCustomText: (text: string) => void;
  setActiveResultTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  onSchedulePost: (platformId: string, content: string, hookType: string, multiplier: number) => void;
}

export default function AssetLibraryAndRepurposer({
  user,
  setCustomText,
  setActiveResultTab,
  setActiveTab,
  onSchedulePost
}: AssetLibraryAndRepurposerProps) {
  
  // Library State
  const [assets, setAssets] = useState<Asset[]>(() => {
    const cached = localStorage.getItem('synapse_assets_library');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: 'asset-1',
        title: 'SaaS Growth Analytics Dashboard Metric Grid',
        type: 'image',
        category: 'Product Assets',
        tags: ['Product Preview', 'Feature Launch', 'B2B Promo'],
        content: 'High-contrast dashboard preview featuring multi-channel reach graphs, performance indices, and 148% lift indicators.',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        dimensions: '1200 x 630 px (Landscape)',
        fileSize: '412 KB',
        createdAt: '2 days ago'
      },
      {
        id: 'asset-2',
        title: 'Organic SMB Case Study Headline Hook',
        type: 'text',
        category: 'Marketing Proof',
        tags: ['Client Growth', 'Storytelling', 'SMB Playbook'],
        content: 'We helped an organic soap business go from 2k impressions/mo to 45k impressions/mo without spending a single dollar on ads. The secret? We turned their standard product pages into mini educational visual stories tailored specifically for each channel.',
        createdAt: '3 days ago'
      },
      {
        id: 'asset-3',
        title: 'High-Engagement Video Intro: Cross-Posting Trap',
        type: 'video',
        category: 'Short Video Scripts',
        tags: ['Shorts Hook', 'Algorithm Tips', 'Educational'],
        content: '[Scene: High-speed swipe over spreadsheets] "If you are copy-pasting the exact same social posts onto LinkedIn, X, and Facebook, you are destroying your marketing. Let me explain why."',
        duration: '0:35 seconds',
        fileSize: '18.4 MB (HD)',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
        createdAt: '1 week ago'
      },
      {
        id: 'asset-4',
        title: 'Agency Customer Onboarding Pitch Sequence',
        type: 'text',
        category: 'Sales Templates',
        tags: ['Newsletter Pitch', 'Core Values', 'Agency Lead'],
        content: 'Stop scheduling blind. True digital performance is not about calendar frequency—it is about algorithm resonance. Treat LinkedIn, YouTube, and Newsletters as separate subcultures. That is the Synapse Sync absolute mandate.',
        createdAt: '4 days ago'
      },
      {
        id: 'asset-5',
        title: 'Workplace Creative Studio Team Candid Photo',
        type: 'image',
        category: 'Brand Culture',
        tags: ['Behind the Scenes', 'Agency Culture', 'Organic Touch'],
        content: 'Our core marketing squad huddled at the drawing board crafting custom distribution models for our active digital creator clients.',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        dimensions: '1080 x 1080 px (Square)',
        fileSize: '618 KB',
        createdAt: '5 days ago'
      }
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('synapse_assets_library', JSON.stringify(assets));
  }, [assets]);

  // Asset Creation Modal/Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState<'image' | 'video' | 'text'>('text');
  const [assetCategory, setAssetCategory] = useState('General Assets');
  const [assetTagsStr, setAssetTagsStr] = useState('');
  const [assetContent, setAssetContent] = useState('');
  const [assetMediaPreset, setAssetMediaPreset] = useState('charts');
  const [assetDuration, setAssetDuration] = useState('0:30');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'text'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Selected Asset for Repurposer Flow
  const [repurposeSourceText, setRepurposeSourceText] = useState('');
  const [repurposeSourceTitle, setRepurposeSourceTitle] = useState('Custom Prompt');
  const [targetPlatform, setTargetPlatform] = useState('linkedin');
  const [targetAudience, setTargetAudience] = useState('saas-founders');
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [repurposedResult, setRepurposedResult] = useState<any | null>(null);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const [editRepurposedCopy, setEditRepurposedCopy] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Active Sub-panel tab ('library' | 'repurposer' | 'integrations')
  const [activePanel, setActivePanel] = useState<'library' | 'repurposer' | 'integrations'>('library');

  // Third-party Connection States
  const [canvaConnected, setCanvaConnected] = useState<boolean>(() => {
    return localStorage.getItem('synapse_canva_connected') === 'true';
  });
  const [jasperConnected, setJasperConnected] = useState<boolean>(() => {
    return localStorage.getItem('synapse_jasper_connected') === 'true';
  });
  const [canvaKey, setCanvaKey] = useState(() => localStorage.getItem('synapse_canva_key') || '');
  const [jasperKey, setJasperKey] = useState(() => localStorage.getItem('synapse_jasper_key') || '');
  
  // Connections loaders & triggers
  const [isConnectingCanva, setIsConnectingCanva] = useState(false);
  const [isConnectingJasper, setIsConnectingJasper] = useState(false);
  const [showCanvaSecret, setShowCanvaSecret] = useState(false);
  const [showJasperSecret, setShowJasperSecret] = useState(false);
  const [connectionSuccessMsg, setConnectionSuccessMsg] = useState('');

  // Toast inside integrations panel
  const [integrationToast, setIntegrationToast] = useState('');

  // Canva Interactive Catalog
  const [canvaDesigns, setCanvaDesigns] = useState([
    {
      id: 'canva-design-1',
      title: 'Venture Metrics Infographic Layout',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      description: 'A visually rich infographics layout highlighting SaaS growth, pipeline conversions, and reach performance statistics.',
      dimensions: '1200 x 630 px',
      category: 'Product Assets'
    },
    {
      id: 'canva-design-2',
      title: 'Minimalist Workspace Brand Cover',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
      description: 'A professional black and gold corporate hero image with empty copy space for custom newsletter headers.',
      dimensions: '1920 x 1080 px',
      category: 'Social Banners'
    },
    {
      id: 'canva-design-3',
      title: 'Modern Instagram Product Showcase',
      thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80',
      description: 'A sleek card-style square layout showcasing premium dashboard features with glowing highlights and feedback ratings.',
      dimensions: '1080 x 1080 px',
      category: 'Client Promos'
    }
  ]);

  // Jasper Interactive Catalog
  const [jasperDocs, setJasperDocs] = useState([
    {
      id: 'jasper-doc-1',
      title: 'B2B Client Growth Secret Thread',
      content: 'Unpopular opinion: Stop trying to be everywhere with the exact same social posts. A single piece of content written specifically for LinkedIn will outperform a template cross-posted on 5 channels by 300%. Optimize for demographics, not schedules.',
      category: 'B2B Social Copilot'
    },
    {
      id: 'jasper-doc-2',
      title: 'Email Case Study: Breaking High-Volume Constraints',
      content: 'Hey target team, we helped a creative agency automate their distribution workflow and scale client reach from 2k views per post to over 45k impressions. The core asset was simple: tailoring the visual story hook for LinkedIn professionals versus casual X readers.',
      category: 'Email Newsletters'
    },
    {
      id: 'jasper-doc-3',
      title: 'Ultimate Channel Distribution Advice',
      content: 'True performance is about algorithm resonance. Treat LinkedIn, X, and Email as entirely distinct societies. Do not copy paste blindly. Feed your raw ideas to Synapse Sync, let the AI co-pilot tailor the optimal layout.',
      category: 'Product Campaigns'
    }
  ]);

  // Extract Unique Categories for Filter
  const categories = Array.from(new Set(assets.map(a => a.category)));

  // Media Presets
  const PRESET_MOCK_PHOTOS: { [key: string]: string } = {
    charts: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    lifestyle: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    marketing: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
  };

  // Add Asset Handler
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!assetTitle.trim() || !assetContent.trim()) {
      setErrorMsg('Asset Title and Content / Description are required.');
      return;
    }

    const tags = assetTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    let mediaUrl = undefined;
    let dimensions = undefined;
    let fileSize = '120 KB';
    let duration = undefined;

    if (assetType === 'image') {
      mediaUrl = PRESET_MOCK_PHOTOS[assetMediaPreset] || PRESET_MOCK_PHOTOS.charts;
      dimensions = assetMediaPreset === 'team' || assetMediaPreset === 'marketing' ? '1080 x 1080 px (Square)' : '1200 x 630 px (Landscape)';
      fileSize = assetMediaPreset === 'lifestyle' ? '452 KB' : '289 KB';
    } else if (assetType === 'video') {
      mediaUrl = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80';
      duration = assetDuration ? `${assetDuration} seconds` : '0:30 seconds';
      fileSize = '14.2 MB (HD)';
    }

    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      title: assetTitle.trim(),
      type: assetType,
      category: assetCategory.trim() || 'General Assets',
      tags: tags.length > 0 ? tags : ['Creative Asset'],
      content: assetContent.trim(),
      mediaUrl,
      dimensions,
      fileSize,
      duration,
      createdAt: 'Just now'
    };

    setAssets(prev => [newAsset, ...prev]);
    setSuccessMsg('Asset registered successfully in your local hub!');
    
    // Reset inputs
    setAssetTitle('');
    setAssetContent('');
    setAssetTagsStr('');
    setAssetCategory('General Assets');
    setShowAddForm(false);

    // Timeout alert success
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteAsset = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}" from your marketing assets catalog?`)) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  // Push to Optimizer Handler
  const handlePushToOptimizer = (text: string) => {
    setCustomText(text);
    setActiveTab('optimizer');
    // Scroll to the active draft optimizer viewport
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // select asset for repurposing
  const handleSelectForRepurpose = (asset: Asset) => {
    setRepurposeSourceText(asset.content);
    setRepurposeSourceTitle(asset.title);
    setRepurposedResult(null); // Reset previous repurpose
    setActivePanel('repurposer');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Clear repurpose state or select customized preloaded drafts
  const handleSelectPresetForRepurpose = (draftText: string, label: string) => {
    setRepurposeSourceText(draftText);
    setRepurposeSourceTitle(label);
    setRepurposedResult(null);
  };

  // Perform Simulated AI Content Repurposing based on channel/audience
  const handleRunRepurposer = () => {
    if (!repurposeSourceText.trim()) {
      alert('Please specify some source content to repurpose first!');
      return;
    }

    setIsRepurposing(true);
    setRepurposedResult(null);

    // Simulate multi-platform rewrite delays
    setTimeout(() => {
      const optimization = generatePlatformOptimization(repurposeSourceText, targetPlatform);
      
      const audienceNames: { [key: string]: string } = {
        'saas-founders': 'Tech Founders & SaaS Solopreneurs',
        'c-level': 'C-Level Corporate Executives',
        'freelancers': 'Growth Partners & Marketing Agencies',
        'smb-owners': 'Small-Medium Business Managers',
        'gen-consumers': 'General Public Consumer Market'
      };

      // Custom adjustments based on Target Audience selected
      const selectedAudLabel = audienceNames[targetAudience] || 'Target Audience';
      let adaptedContent = optimization.content;
      let targetInsights = [
        `Highly calibrated for ${selectedAudLabel} user psychographics.`,
        "Focuses on immediate work-life efficiency ROI.",
        "Employs platform-native spacing with premium vocabulary layout."
      ];

      if (targetAudience === 'saas-founders') {
        adaptedContent = `[SaaS Blueprint Edit] ⚡️ Founder Insights\n\n` + adaptedContent.replace('Most marketing', 'Most high-growth SaaS tools');
        targetInsights = [
          "Optimized for tech startup builder psychology (metrics & leverage).",
          "Injected high-growth terminology (SaaS, compound loops, MRR-focused vectors).",
          "Includes strong CTA motivating direct utility testing."
        ];
      } else if (targetAudience === 'c-level') {
        adaptedContent = `[Executive Summary] 🏛️ High-Fidelity Professional Mandate\n\n` + adaptedContent
          .replace('Unpopular opinion', 'Strategic Assessment')
          .replace('burnt out', 'managing labor constraints')
          .replace('crickets', 'sub-optimal performance indices');
        targetInsights = [
          "Tone shifted to a clean, authoritative executive registry (zero hype limits).",
          "Substituted informal slang for professional B2B operational terminology.",
          "Emphasized scalability, corporate-level risk avoidance, and systemic efficiency."
        ];
      } else if (targetAudience === 'freelancers') {
        adaptedContent = `[Partner Notice] 🤝 Digital Agency & Freelance Blueprint\n\n` + adaptedContent;
        targetInsights = [
          "Calibrated for high-velocity client management portfolios.",
          "Showcases margin multiplier indicators for recurring agencies.",
          "Provides immediate strategic proof statements to justify high-ticket service plans."
        ];
      } else if (targetAudience === 'smb-owners') {
        adaptedContent = `[SMB Playbook] 🏡 Main Street Owner-Operator Insight\n\n` + adaptedContent;
        targetInsights = [
          "Optimized for small-business proprietors focused on direct labor hours saved.",
          "Avoids complex high-density corporate jargon in favor of direct organic traffic strategies.",
          "Provides reassuring, straightforward advice to build local brand assets easily."
        ];
      }

      setRepurposedResult({
        adaptedText: adaptedContent,
        insights: targetInsights,
        predictedReachScore: Math.floor(optimization.reachMultiplier * 100),
        multiplier: optimization.reachMultiplier,
        hashtags: optimization.hashtags,
        copilotAdvice: optimization.keyChangeDescription,
        tips: optimization.tips,
        audienceLabel: selectedAudLabel,
        platformLabel: CHANNEL_METADATA.find(c => c.id === targetPlatform)?.name || targetPlatform
      });

      setEditRepurposedCopy(adaptedContent);
      setIsRepurposing(false);
    }, 1200);
  };

  const handleCopyRepurposed = () => {
    navigator.clipboard.writeText(editRepurposedCopy);
    setIsCopySuccess(true);
    setTimeout(() => setIsCopySuccess(false), 2000);
  };

  const handleSaveRepurposedToLibrary = () => {
    if (!editRepurposedCopy.trim()) return;

    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      title: `AI Repurposed: ${repurposeSourceTitle.substring(0, 30)}... (${repurposedResult?.platformLabel})`,
      type: 'text',
      category: 'Repurposed Outputs',
      tags: ['AI Repurposed', repurposedResult?.platformLabel.split(' ')[0] || 'Social', 'Custom Output'],
      content: editRepurposedCopy,
      createdAt: 'Just now'
    };

    setAssets(prev => [newAsset, ...prev]);
    setSaveSuccessMsg('✓ Saved successfully back as a Text Asset in your library!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Canva connection flow
  const handleConnectCanva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canvaKey.trim()) {
      alert('Please enter your Canva Integration Key or API access string.');
      return;
    }
    setIsConnectingCanva(true);
    setTimeout(() => {
      setCanvaConnected(true);
      localStorage.setItem('synapse_canva_connected', 'true');
      localStorage.setItem('synapse_canva_key', canvaKey);
      setIsConnectingCanva(false);
      setConnectionSuccessMsg('Successfully connected your Canva Corporate API Workspace!');
      showToast('Connected Canva Workspace Successfully!');
      setTimeout(() => setConnectionSuccessMsg(''), 4000);
    }, 1200);
  };

  const handleDisconnectCanva = () => {
    if (confirm('Are you sure you want to log out of your connected Canva professional team?')) {
      setCanvaConnected(false);
      setCanvaKey('');
      localStorage.removeItem('synapse_canva_connected');
      localStorage.removeItem('synapse_canva_key');
      showToast('Canva account disconnected.');
    }
  };

  // Jasper connection flow
  const handleConnectJasper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jasperKey.trim()) {
      alert('Please enter your Jasper workspace API bearer token.');
      return;
    }
    setIsConnectingJasper(true);
    setTimeout(() => {
      setJasperConnected(true);
      localStorage.setItem('synapse_jasper_connected', 'true');
      localStorage.setItem('synapse_jasper_key', jasperKey);
      setIsConnectingJasper(false);
      setConnectionSuccessMsg('Successfully authorized Jasper Workspace access token!');
      showToast('Connected Jasper Workspace Successfully!');
      setTimeout(() => setConnectionSuccessMsg(''), 4000);
    }, 1200);
  };

  const handleDisconnectJasper = () => {
    if (confirm('Are you sure you want to disconnect Synapse Sync from your Jasper AI seat?')) {
      setJasperConnected(false);
      setJasperKey('');
      localStorage.removeItem('synapse_jasper_connected');
      localStorage.removeItem('synapse_jasper_key');
      showToast('Jasper Workspace disconnected.');
    }
  };

  const showToast = (msg: string) => {
    setIntegrationToast(msg);
    setTimeout(() => setIntegrationToast(''), 4000);
  };

  // Import Canva design layout
  const handleImportCanvaDesign = (design: any, autoAdapt: boolean = false) => {
    if (assets.some(a => a.title === design.title)) {
      alert('This Canva design has already been imported to your Digital Assets library.');
      return;
    }

    const newAsset: Asset = {
      id: `canva-${design.id}-${Date.now()}`,
      title: design.title,
      type: 'image',
      category: 'Canva Design Hub',
      tags: ['Canva', 'Imported', design.category],
      content: design.description,
      mediaUrl: design.thumbnail,
      dimensions: design.dimensions + ' (Landscape)',
      fileSize: '382 KB',
      createdAt: 'Just imported'
    };

    setAssets(prev => [newAsset, ...prev]);
    showToast(`✓ Safely imported "${design.title}" from Canva!`);

    if (autoAdapt) {
      setRepurposeSourceText(design.description);
      setRepurposeSourceTitle(design.title);
      setRepurposedResult(null);
      setActivePanel('repurposer');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Import Jasper document draft
  const handleImportJasperDoc = (doc: any, autoAdapt: boolean = false) => {
    if (assets.some(a => a.title === doc.title)) {
      alert('This Jasper copy outline has already been imported inside your workspace.');
      return;
    }

    const newAsset: Asset = {
      id: `jasper-${doc.id}-${Date.now()}`,
      title: doc.title,
      type: 'text',
      category: 'Jasper AI Drafts',
      tags: ['JasperAI', 'Imported', 'AI Draft'],
      content: doc.content,
      createdAt: 'Just imported'
    };

    setAssets(prev => [newAsset, ...prev]);
    showToast(`✓ Safely imported draft "${doc.title}" from Jasper!`);

    if (autoAdapt) {
      setRepurposeSourceText(doc.content);
      setRepurposeSourceTitle(doc.title);
      setRepurposedResult(null);
      setActivePanel('repurposer');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Filter Assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
                        
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Feature Header Card */}
      <div className="bg-gradient-to-tr from-[#0D1B2A] to-[#444444]/30 border border-[#444444] rounded-2xl p-6 relative">
        <div className="absolute top-4 right-4 text-[#C9A84C]/25">
          <BookOpen className="w-16 h-16 stroke-[1]" />
        </div>
        <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest block mb-1 font-mono">
          Creative Library & Adaptation Co-Pilot
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-2.5xl text-white">
          Asset Manager & AI Content Repurposer
        </h2>
        <p className="text-[#888888] text-xs mt-1.5 max-w-2xl leading-relaxed">
          Centralize your agency visual creative assets, text snippets, and videos in our native repository. 
          Use the AI co-pilot below to instantly repurpose and tailor any asset for different networks and audiences to secure maximum organic cross-platform reach.
        </p>

        {/* Premium Access tabs inside Main Feature Banner */}
        <div className="flex flex-wrap items-center gap-4 mt-5 text-[11px] font-bold uppercase tracking-widest border-t border-[#444444]/45 pt-4 font-mono select-none">
          <button
            type="button"
            onClick={() => setActivePanel('library')}
            className={`flex items-center gap-1.5 transition-all cursor-pointer ${
              activePanel === 'library' ? 'text-[#C9A84C] font-extrabold pb-0.5 border-b-2 border-[#C9A84C]' : 'text-[#888888] hover:text-white'
            }`}
          >
            <FolderIndicator className="w-3.5 h-3.5" /> Core Workspace Library ({filteredAssets.length})
          </button>
          <span className="text-[#444444] hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => setActivePanel('repurposer')}
            className={`flex items-center gap-1.5 transition-all cursor-pointer ${
              activePanel === 'repurposer' ? 'text-[#C9A84C] font-extrabold pb-0.5 border-b-2 border-[#C9A84C]' : 'text-[#888888] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> AI Adaptation Co-Pilot
          </button>
          <span className="text-[#444444] hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => setActivePanel('integrations')}
            className={`flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activePanel === 'integrations' ? 'text-[#C9A84C] font-extrabold pb-0.5 border-b-2 border-[#C9A84C]' : 'text-[#888888] hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-indigo-400" /> Connected Creator Suites (Canva & Jasper)
            {(canvaConnected || jasperConnected) && (
              <span className="absolute -top-1.5 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-[#0D1B2A]" />
            )}
          </button>
        </div>
      </div>

      {/* Grid: Assets Catalog Left (Col-7) + Asset Creator Right (Col-5) */}
      {activePanel === 'library' && (
        <section id="assets-catalog-section" className="space-y-6 pt-2 select-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <FolderIndicator className="w-5 h-5 text-[#C9A84C]" />
              Digital Asset Repository
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">Filter, search, delete, or send stored credentials to the optimizer queue.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C9A84C] text-[#0D1B2A] hover:bg-[#C9A84C]/90 transition-all cursor-pointer"
            >
              {showAddForm ? 'Hide Creator' : <><Plus className="w-4 h-4 text-slate-900 stroke-[2.5]" /> Store New Asset</>}
            </button>
          </div>
        </div>

        {/* Inline Asset Creator Form */}
        {showAddForm && (
          <div className="bg-[#444444]/10 border border-[#C9A84C]/45 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-[#444444]/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="font-semibold text-white text-sm">Add New Creative Asset to Studio</span>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-[#888888] hover:text-white text-xs">Cancel</button>
            </div>

            <form onSubmit={handleCreateAsset} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Asset Type */}
              <div className="md:col-span-4">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">Asset Type</label>
                <div className="grid grid-cols-3 gap-1 bg-[#444444]/25 p-1 rounded-xl border border-[#444444]">
                  {[
                    { id: 'text', label: 'Text', icon: <FileText className="w-3 h-3" /> },
                    { id: 'image', label: 'Image', icon: <ImageIcon className="w-3 h-3" /> },
                    { id: 'video', label: 'Video', icon: <VideoIcon className="w-3 h-3" /> }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAssetType(t.id as any)}
                      className={`flex items-center gap-1 justify-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                        assetType === t.id
                          ? 'bg-[#C9A84C] text-[#0D1B2A]'
                          : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="md:col-span-8">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">Asset Title / Human Label</label>
                <input
                  type="text"
                  placeholder="e.g., Q3 Brand Launch Promo Banner Outline"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                  required
                />
              </div>

              {/* Class category */}
              <div className="md:col-span-4">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">Category Layer</label>
                <input
                  type="text"
                  placeholder="e.g., Campaign Proof, Product Assets"
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Tags comma string */}
              <div className="md:col-span-8">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., SaaS Launch, B2B Story, Growth"
                  value={assetTagsStr}
                  onChange={(e) => setAssetTagsStr(e.target.value)}
                  className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Conditional Image preset selection */}
              {assetType === 'image' && (
                <div className="md:col-span-12 bg-[#444444]/10 p-3 rounded-xl border border-[#444444] space-y-2">
                  <span className="block text-[10px] uppercase font-bold text-[#888888] font-mono">Choose Simulated Creative Asset Template</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'charts', label: 'Metric Analytics Chart' },
                      { id: 'team', label: 'Collaborative Studio Photo' },
                      { id: 'lifestyle', label: 'Modern Home-Office Laptop' },
                      { id: 'marketing', label: 'Color Contrast Mobile App UI' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAssetMediaPreset(p.id)}
                        className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                          assetMediaPreset === p.id
                            ? 'bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C] font-semibold'
                            : 'bg-[#444444]/15 border-[#444444] text-[#888888] hover:border-[#888888]/50 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Video script timing details */}
              {assetType === 'video' && (
                <div className="md:col-span-12">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">Planned Script Timing (Duration SECONDS)</label>
                  <input
                    type="text"
                    placeholder="e.g., 0:30, 0:45, 1:00"
                    value={assetDuration}
                    onChange={(e) => setAssetDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C] max-w-xs"
                  />
                </div>
              )}

              {/* Central text content representation */}
              <div className="md:col-span-12">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-1.5 font-mono">
                  {assetType === 'text' ? 'Text Snippet Copy' : 'Visual Graphic Description / Script Hook Text'}
                </label>
                <textarea
                  placeholder={
                    assetType === 'text' 
                      ? "Paste code snippets, raw blog arguments, cold email text, or testimonials here..."
                      : "Describe what the creative looks like, or capture video voiceover scripts with cues in brackets..."
                  }
                  value={assetContent}
                  onChange={(e) => setAssetContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C] font-mono resize-y"
                  required
                />
              </div>

              {/* Submit panel */}
              <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#888888] hover:text-white hover:bg-[#444444]/25 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C9A84C] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#C9A84C]/95 transition-all cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Global Catalog Filter Bars */}
        <div className="bg-[#444444]/10 border border-[#444444] rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Keyword Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-[#888888]" />
            <input
              type="text"
              placeholder="Search assets by title, content, or specific tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A2E44]/20 border border-[#444444] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by Type */}
            <div className="flex items-center bg-[#444444]/15 rounded-xl p-1 border border-[#444444]">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'text', label: 'Copy' },
                { id: 'image', label: 'Images' },
                { id: 'video', label: 'Videos' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTypeFilter(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    typeFilter === opt.id
                      ? 'bg-[#C9A84C] text-[#0D1B2A]'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Filter by Category list */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#444444]/15 border border-[#444444] rounded-xl text-xs px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="all">📁 All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Assets Render Map (Responsive Bento Grid) */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12 bg-[#444444]/5 border border-[#444444]/60 border-dashed rounded-2xl">
            <FolderIndicator className="w-10 h-10 text-[#444444] mx-auto mb-3" />
            <h4 className="text-white font-bold text-sm">No creative assets match your query</h4>
            <p className="text-[#888888] text-xs mt-1">Try resetting the media filter or create your own custom asset above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssets.map(asset => (
              <div 
                key={asset.id} 
                className="bg-[#444444]/15 border border-[#444444] hover:border-[#888888]/45 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group relative animate-in fade-in h-full"
              >
                {/* Image asset preview gradient or header */}
                {asset.type === 'image' && asset.mediaUrl && (
                  <div className="h-36 w-full relative overflow-hidden bg-slate-900 border-b border-[#444444]">
                    <img 
                      src={asset.mediaUrl} 
                      alt={asset.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[9px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <ImageIcon className="w-2.5 h-2.5 text-[#C9A84C]" />
                      IMAGE SOURCE
                    </div>
                    {asset.dimensions && (
                      <span className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[8px] font-mono text-[#888888]">
                        {asset.dimensions}
                      </span>
                    )}
                  </div>
                )}

                {/* Video asset preview banner */}
                {asset.type === 'video' && asset.mediaUrl && (
                  <div className="h-36 w-full relative overflow-hidden bg-zinc-950/90 border-b border-[#444444] flex items-center justify-center">
                    <img 
                      src={asset.mediaUrl} 
                      alt={asset.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md border border-white/15 text-white font-mono text-[9px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <VideoIcon className="w-2.5 h-2.5 text-red-400" />
                      VIDEO LAYOUT
                    </div>
                    <div className="absolute p-2 bg-[#C9A84C] text-slate-950 rounded-full shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                      <PlaySymbol className="w-4 h-4 fill-current" />
                    </div>
                    <div className="absolute bottom-2 left-2.5 flex items-center gap-2">
                      <span className="bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-[#C9A84C] font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {asset.duration}
                      </span>
                    </div>
                  </div>
                )}

                {/* Text asset spacing header */}
                {asset.type === 'text' && (
                  <div className="p-3 bg-[#444444]/10 border-b border-[#444444]/50 flex items-center justify-between">
                    <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] font-mono text-[9px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      TEXT SNIPPET
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">
                      {asset.content.length} chars
                    </span>
                  </div>
                )}

                {/* Content body descriptors */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* Category Label */}
                    <div className="flex items-center gap-1 text-[10px] text-[#C9A84C] font-mono font-bold tracking-tight">
                      <Tag className="w-3 h-3" />
                      <span>{asset.category}</span>
                    </div>
                    
                    <h4 className="text-white font-bold text-sm tracking-tight line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
                      {asset.title}
                    </h4>

                    {/* Description or Text Content preview */}
                    <p className={`text-zinc-300 text-xs leading-normal font-sans ${asset.type === 'text' ? 'line-clamp-4 font-mono select-all bg-[#444444]/10 p-2.5 rounded-xl border border-[#444444]/40 text-[11px]' : 'line-clamp-2'}`}>
                      {asset.content}
                    </p>
                  </div>

                  {/* Tags cluster */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {asset.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#444444]/20 text-[#888888] text-[9px] px-1.5 py-0.5 rounded font-medium border border-[#444444]/40">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Options Footer */}
                <div className="px-4 py-3 bg-[#444444]/15 border-t border-[#444444] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDeleteAsset(asset.id, asset.title)}
                    className="text-[#888888] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Creative Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Repurpose Trigger */}
                    <button
                      onClick={() => handleSelectForRepurpose(asset)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      title="Load into AI repurposing generator tool"
                    >
                      <Sparkles className="w-3 h-3" />
                      Repurpose
                    </button>

                    {/* Optimize Direct Trigger */}
                    <button
                      onClick={() => handlePushToOptimizer(asset.content)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] bg-slate-800 text-[#888888] hover:text-white hover:bg-slate-750 transition-all font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      title="Send as active copy to original multi-draft optimizer tab"
                    >
                      <ArrowUpRight className="w-3 h-3 text-[#C9A84C]" />
                      To Optimizer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>)}

      {/* Feature Section: AI PLATFORM REPURPOSING DECK */}
      {activePanel === 'repurposer' && (
        <section id="ai-repurposing-section" className="space-y-6 select-none">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Content Repurposing Engine</h3>
                <p className="text-xs text-[#888888] mt-0.5">Adapt image text descriptions, media hooks, or core text snippets for tailored channel niches instantly.</p>
              </div>
            </div>
          </div>

        {/* Selection Input & Generation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Inputs Panel (Col-5) */}
          <div className="lg:col-span-5 bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-5 space-y-4">
            
            {/* Quick pre-populate links */}
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] mb-2 font-mono">
                Source Hook Presets
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'SaaS Launch Concept', text: 'We solved multi-channel scheduling overhead by making an AI co-pilot Synapse Sync that rewrites content for each channel natively.' },
                  { label: 'Client Case Study', text: 'We helped a local merchant grow organically from 2k views to 45k impressions. The key was re-structuring product lists to educational story arcs.' },
                  { label: 'Platform Warning', text: 'Copy-pasting structural posts blindly drains retention. Each platform algorithm values native formatting.' }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPresetForRepurpose(p.text, p.label)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#444444]/60 bg-[#444444]/10 hover:border-[#888888]/40 text-xs transition-all flex items-center justify-between text-zinc-300 group"
                  >
                    <span className="truncate max-w-[200px] font-semibold text-white group-hover:text-[#C9A84C] font-mono">{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-[#888888] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Source Content Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] font-mono">
                  Source Content to Adapt
                </label>
                {repurposeSourceTitle !== 'Custom Prompt' && (
                  <span className="text-[10px] text-[#C9A84C] font-semibold bg-[#C9A84C]/5 border border-[#C9A84C]/20 px-2 py-0.5 rounded-lg max-w-[220px] truncate">
                    📌 {repurposeSourceTitle}
                  </span>
                )}
              </div>
              <textarea
                placeholder="Type or paste the raw content draft, campaign concept, or choose an asset from your repository above..."
                value={repurposeSourceText}
                onChange={(e) => {
                  setRepurposeSourceText(e.target.value);
                  setRepurposeSourceTitle('Custom Prompt');
                }}
                rows={5}
                className="w-full px-3.5 py-2.5 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C] font-mono resize-y"
              />
              <div className="text-right">
                <span className="text-[10px] text-[#888888] font-mono">{repurposeSourceText.length} characters</span>
              </div>
            </div>

            {/* Target Platform Setup */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] font-mono">Target Channel Adaptor</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C]"
              >
                {CHANNEL_METADATA.map(meta => (
                  <option key={meta.id} value={meta.id}>
                    Customize for {meta.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience Angle Setup */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] font-mono">Target Audience Personality</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 bg-[#444444]/20 border border-[#444444] rounded-xl text-white text-xs focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="saas-founders">⚡️ Venture Builders, SaaS Tech Founders & Solopreneurs</option>
                <option value="c-level">🏛️ B2B Executives, Directors, and High-Ticket Agencies</option>
                <option value="freelancers">💼 Digital Marketing Partners & Creative Operators</option>
                <option value="smb-owners">🏡 Main Street Owners, Retailers & SMB Social Managers</option>
                <option value="gen-consumers">✨ General Digital Creators, Enthusiasts & Readers</option>
              </select>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleRunRepurposer}
              disabled={isRepurposing || !repurposeSourceText.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/95 text-[#0D1B2A] hover:opacity-95 disabled:opacity-50 transition-all font-sans cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isRepurposing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Synapse Rewriting Platform Vectors...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current text-slate-900" />
                  Repurpose Content with AI co-pilot
                </>
              )}
            </button>

          </div>

          {/* Outputs / Results Panel (Col-7) */}
          <div className="lg:col-span-7 bg-[#444444]/10 border border-[#444444]/60 rounded-2xl p-5 min-h-[420px] flex flex-col justify-between">
            {repurposedResult ? (
              <div className="space-y-5 animate-in fade-in duration-350">
                
                {/* Score & Adaptive Info Header */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-[#444444]/40 pb-4">
                  
                  {/* Target Match Metric */}
                  <div className="bg-[#444444]/15 border border-[#444444]/60 p-3 rounded-xl">
                    <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Organic Reach Multiplier</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-[#C9A84C]">+{repurposedResult.predictedReachScore}%</span>
                      <span className="text-[10px] text-emerald-450 font-bold">({repurposedResult.multiplier}x)</span>
                    </div>
                  </div>

                  {/* Adapted For Tag */}
                  <div className="bg-[#444444]/15 border border-[#444444]/60 p-3 rounded-xl">
                    <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Niche Segment</span>
                    <div className="text-white font-bold text-[11px] mt-1.5 truncate">
                      {repurposedResult.audienceLabel.split(' ')[0]} {repurposedResult.audienceLabel.split(' ').slice(1).join(' ').substring(0, 15)}...
                    </div>
                  </div>

                  {/* Channel Selection */}
                  <div className="bg-[#444444]/15 border border-[#444444]/60 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider text-[#888888] font-mono">Algorithmic Target</span>
                      <span className="text-white font-extrabold text-xs block mt-1.5">{repurposedResult.platformLabel}</span>
                    </div>
                    <span className="text-[#C9A84C] bg-[#C9A84C]/5 p-1 rounded-lg">
                      {getChannelIcon(targetPlatform, 'w-4.5 h-4.5')}
                    </span>
                  </div>

                </div>

                {/* AI Advice Explanation */}
                <div className="bg-[#1A2E44]/20 border border-[#444444]/80 p-3.5 rounded-xl space-y-1.5 text-xs text-zinc-300">
                  <span className="text-[10px] uppercase font-bold text-[#C9A84C] flex items-center gap-1 font-mono">
                    <Info className="w-3.5 h-3.5" /> Co-Pilot Adaptation Playbook advice
                  </span>
                  <p className="leading-relaxed italic pl-1.5 border-l border-[#C9A84C]/35">
                    "{repurposedResult.copilotAdvice}"
                  </p>
                </div>

                {/* Draft Container with Editor Mode */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#888888] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
                      Tailored Draft Copy Outlines
                    </span>
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="text-zinc-300 hover:text-white hover:bg-[#444444]/30 px-2 py-0.5 rounded transition-all text-[11px]"
                    >
                      {isEditMode ? '✓ Done Editing' : '✎ Edit Inline'}
                    </button>
                  </div>

                  <div className="relative">
                    {isEditMode ? (
                      <textarea
                        value={editRepurposedCopy}
                        onChange={(e) => setEditRepurposedCopy(e.target.value)}
                        rows={8}
                        className="w-full bg-[#1A1A1A] text-white border border-[#C9A84C] rounded-xl p-3.5 font-mono text-xs focus:outline-none resize-y shadow-inner"
                      />
                    ) : (
                      <div className="bg-zinc-950/65 border border-[#444444] rounded-xl p-3.5 font-mono text-xs leading-relaxed text-slate-100 max-h-72 overflow-y-auto whitespace-pre-wrap select-all selection:bg-[#C9A84C]/30 selection:text-white">
                        {editRepurposedCopy}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specific Action items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Tips & Tricks list */}
                  <div className="bg-[#444444]/5 border border-[#444444]/40 p-3 rounded-xl space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-white tracking-wide block font-mono">💡 Channel Tactics</span>
                    <ul className="text-[11px] text-[#888888] space-y-1 pl-1 list-disc list-inside">
                      {repurposedResult.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="line-clamp-2">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Psychographics segments */}
                  <div className="bg-[#444444]/5 border border-[#444444]/40 p-3 rounded-xl space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-white tracking-wide block font-mono">🎯 Psychographic Hooks</span>
                    <ul className="text-[11px] text-[#888888] space-y-1 pl-1 list-none">
                      {repurposedResult.insights.map((ins: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-450 text-[#C9A84C] select-none shrink-0">✓</span> <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Platform Action Tray */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#444444]/40">
                  <div className="flex gap-2">
                    {/* Schedule directly */}
                    <button
                      onClick={() => {
                        onSchedulePost(targetPlatform, editRepurposedCopy, 'AI Repurposed Hook', repurposedResult.multiplier);
                        alert(`✓ Repurposed copy committed! Scheduled to your direct ${repurposedResult.platformLabel} Sync queue for the optimal slot.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Commit to Sync Queue
                    </button>

                    {/* Copy to system Clipboard */}
                    <button
                      onClick={handleCopyRepurposed}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-[#444444]/20 border border-[#444444] text-zinc-300 hover:text-white transition-all cursor-pointer"
                    >
                      {isCopySuccess ? <><Check className="w-3.5 h-3.5 text-emerald-455" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Draft</>}
                    </button>
                  </div>

                  {/* Export as new Text Snippet asset */}
                  <div className="flex items-center gap-2">
                    {saveSuccessMsg && (
                      <span className="text-[11px] text-[#C9A84C] font-semibold animate-pulse">{saveSuccessMsg}</span>
                    )}
                    <button
                      onClick={handleSaveRepurposedToLibrary}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider text-[#888888] hover:text-white transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-[#C9A84C]" /> Export to Asset Library
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                {isRepurposing ? (
                  <div className="space-y-4 max-w-sm">
                    {/* Simulated progressive bar */}
                    <div className="w-12 h-12 rounded-full border-4 border-[#C9A84C]/10 border-t-[#C9A84C] animate-spin mx-auto" />
                    <h4 className="text-white font-bold text-sm">Synchronizing Platform Persona Vectors...</h4>
                    <p className="text-xs text-[#888888]">
                      Scanning platform algorithms, checking {targetPlatform} timeline constraints, and modeling tone scripts for maximum click-through rates.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <Sparkles className="w-10 h-10 text-[#444444] mx-auto mb-1 stroke-[1.5]" />
                    <h4 className="text-white font-bold text-sm">Repurposed Preview Panel</h4>
                    <p className="text-xs text-[#888888] leading-relaxed">
                      Select an existing creative asset from the catalog above and click <strong>"Repurpose"</strong>, or type custom text on the left to generate algorithmic plans.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>)}

      {/* 🔌 Partner Studio Integrations Panel */}
      {activePanel === 'integrations' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Integration Toast Banner */}
          {integrationToast && (
            <div className="bg-[#C9A84C] text-[#0D1B2A] text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-between shadow-lg animate-bounce select-none">
              <span>{integrationToast}</span>
              <button onClick={() => setIntegrationToast('')} className="text-[#0D1B2A]/70 hover:text-[#0D1B2A] font-extrabold cursor-pointer">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Canva connection & sandbox left (Col-6) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />
                
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-[#444444]/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg select-none font-sans">
                      C
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-base flex items-center gap-2">
                        Canva Studio Hub
                      </h3>
                      <p className="text-[11px] text-[#888888] font-mono uppercase tracking-wider text-[9px]">Creator Visual Suite</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {canvaConnected ? (
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse animate-pulse" />
                      Live Connected
                    </span>
                  ) : (
                    <span className="bg-[#444444]/25 border border-[#444444]/50 text-[#888888] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                      Unlinked
                    </span>
                  )}
                </div>

                {/* Connection Form or Success */}
                {!canvaConnected ? (
                  <form onSubmit={handleConnectCanva} className="space-y-4">
                    <div className="bg-[#444444]/5 border border-[#444444]/40 p-4 rounded-xl space-y-2 text-xs text-[#888888] leading-relaxed">
                      <span className="font-bold text-white block uppercase tracking-wider text-[10px] font-mono">Setup Canva Connect</span>
                      To import visuals directly from Canva, configure your Canva Developer Access Token or Application Client Credentials below. 
                      <a href="https://dev.canva.com/docs" target="_blank" rel="noreferrer" className="text-[#C9A84C] hover:underline inline-flex items-center gap-0.5 ml-1 font-semibold">
                        View Canva Developer Console <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] font-mono">
                        Developer API Key / Authentication Code
                      </label>
                      <div className="relative">
                        <input
                          type={showCanvaSecret ? "text" : "password"}
                          placeholder="canva_live_xxxxx..."
                          value={canvaKey}
                          onChange={(e) => setCanvaKey(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#444444]/15 border border-[#444444] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCanvaSecret(!showCanvaSecret)}
                          className="absolute right-3 top-2.5 text-[#888888] hover:text-white p-1 text-[10px] font-bold"
                        >
                          {showCanvaSecret ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isConnectingCanva}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center font-mono"
                    >
                      {isConnectingCanva ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Authorizing with Canva Connect...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3.5 h-3.5" />
                          Establish Canva Link
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    {/* Success Notice */}
                    <div className="bg-emerald-550/5 border border-emerald-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed bg-emerald-555/5">
                      <span className="text-emerald-450 text-base font-bold">✓</span>
                      <div>
                        <span className="font-bold text-white block font-sans">Client Sync Active</span>
                        Authenticated using Key: <span className="font-mono text-[10px] text-zinc-400">Canva_Hub_{canvaKey.substring(0, 4)}***</span>. Synapse Sync is now integrated and authorized to call Canva template delivery APIs.
                      </div>
                    </div>

                    {/* Disconnect trigger */}
                    <div className="flex justify-between items-center bg-[#444444]/10 p-2.5 rounded-xl border border-[#444444]/40">
                      <span className="text-[10px] font-mono text-[#888888]">Connected Team ID: TX-Creative-Global</span>
                      <button
                        type="button"
                        onClick={handleDisconnectCanva}
                        className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                      >
                        Disconnect Link
                      </button>
                    </div>

                    {/* LIVE IMPORT CONSOLE (Canva) */}
                    <div className="space-y-3.5 border-t border-[#444444]/30 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 select-none">
                          <Layers className="w-4 h-4 text-indigo-400" /> Live Design File Feed
                        </span>
                        <span className="text-[10px] text-[#888888] font-mono">3 formats ready</span>
                      </div>

                      <div className="space-y-3">
                        {canvaDesigns.map((design) => (
                          <div
                            key={design.id}
                            className="bg-[#444444]/10 border border-[#444444]/50 hover:border-indigo-500/40 rounded-xl p-3 flex gap-3.5 items-center transition-all group/item select-none"
                          >
                            <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-[#444444] overflow-hidden shrink-0 relative">
                              <img src={design.thumbnail} alt={design.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[7px] font-mono text-center py-0.5 text-[#C9A84C] font-semibold truncate">
                                {design.dimensions}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center">
                                <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded font-mono">
                                  {design.category}
                                </span>
                              </div>
                              <h4 className="text-white text-xs font-bold truncate group-hover/item:text-indigo-400 transition-colors">
                                {design.title}
                              </h4>
                              <p className="text-[10px] text-[#888888] line-clamp-1 leading-normal italic font-sans">
                                "{design.description}"
                              </p>
                            </div>

                            {/* Actions panel */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleImportCanvaDesign(design, false)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[9.5px] text-zinc-300 font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Add to Asset Repository"
                              >
                                <Download className="w-3 h-3 text-[#C9A84C]" /> Import
                              </button>
                              <button
                                type="button"
                                onClick={() => handleImportCanvaDesign(design, true)}
                                className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded text-[9.5px] font-bold transition-all cursor-pointer flex items-center gap-1 font-mono uppercase"
                                title="Import and instantly adapt"
                              >
                                <Sparkles className="w-3 h-3" /> Adapt
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Jasper connection & sandbox right (Col-6) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#444444]/15 border border-[#444444]/80 rounded-2xl p-6 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all" />

                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-[#444444]/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-lg select-none font-sans">
                      J
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-base flex items-center gap-2">
                        Jasper Copy Desk
                      </h3>
                      <p className="text-[11px] text-[#888888] font-mono uppercase tracking-wider text-[9px]">Enterprise AI Text Seat</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {jasperConnected ? (
                    <span className="bg-purple-500/15 border border-purple-500/35 text-purple-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 bg-purple-500/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      Token Verified
                    </span>
                  ) : (
                    <span className="bg-[#444444]/25 border border-[#444444]/50 text-[#888888] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                      Unlinked
                    </span>
                  )}
                </div>

                {/* Connection Form or Success */}
                {!jasperConnected ? (
                  <form onSubmit={handleConnectJasper} className="space-y-4">
                    <div className="bg-[#444444]/5 border border-[#444444]/40 p-4 rounded-xl space-y-2 text-xs text-[#888888] leading-relaxed">
                      <span className="font-bold text-white block uppercase tracking-wider text-[10px] font-mono">Jasper Workspace Auth</span>
                      Input your Jasper API Personal Access Token or Developer JWT to query generated template content live from your team's marketing campaigns.
                      <a href="https://developers.jasper.ai" target="_blank" rel="noreferrer" className="text-[#C9A84C] hover:underline inline-flex items-center gap-0.5 ml-1 font-semibold">
                        Developers Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-[#888888] font-mono">
                        Jasper Personal Access Token (Bearer Key)
                      </label>
                      <div className="relative">
                        <input
                          type={showJasperSecret ? "text" : "password"}
                          placeholder="JASPER_JWT_BEARER_TOKEN_xxxxx..."
                          value={jasperKey}
                          onChange={(e) => setJasperKey(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#444444]/15 border border-[#444444] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowJasperSecret(!showJasperSecret)}
                          className="absolute right-3 top-2.5 text-[#888888] hover:text-white p-1 text-[10px] font-bold font-mono"
                        >
                          {showJasperSecret ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isConnectingJasper}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono"
                    >
                      {isConnectingJasper ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Authenticating Token Protocol...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3.5 h-3.5" />
                          Verify Jasper Token
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    {/* Success Notice */}
                    <div className="bg-purple-500/5 border border-purple-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <span className="text-purple-400 text-base font-bold">✓</span>
                      <div>
                        <span className="font-bold text-white block">Jasper Workspace Connected</span>
                        Authorized using token: <span className="font-mono text-[10px] text-zinc-400">Jasper_Live_Auth_Token_{jasperKey.substring(0, 4)}***</span>. Fully synced with <strong>Workspace Team #4 (SaaS marketing desk)</strong>.
                      </div>
                    </div>

                    {/* Disconnect trigger */}
                    <div className="flex justify-between items-center bg-[#444444]/10 p-2.5 rounded-xl border border-[#444444]/40">
                      <span className="text-[10px] font-mono text-[#888888]">Synchronized Seat: Creator Pro Tier #1</span>
                      <button
                        type="button"
                        onClick={handleDisconnectJasper}
                        className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                      >
                        Disconnect Link
                      </button>
                    </div>

                    {/* LIVE IMPORT CONSOLE (Jasper) */}
                    <div className="space-y-3.5 border-t border-[#444444]/30 pt-4">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 select-none font-mono">
                          <Palette className="w-4 h-4 text-purple-400" /> Enterprise Copy Catalog
                        </span>
                        <span className="text-[10px] text-[#888888]">3 generated pieces</span>
                      </div>

                      <div className="space-y-3">
                        {jasperDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-[#444444]/10 border border-[#444444]/50 hover:border-purple-500/40 rounded-xl p-3.5 flex flex-col gap-2 transition-all group/item select-none relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase tracking-wider bg-purple-550/10 border border-purple-500/20 text-purple-400 font-bold px-1.5 py-0.5 rounded font-mono bg-purple-500/10">
                                {doc.category}
                              </span>
                              
                              {/* Direct action buttons */}
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleImportJasperDoc(doc, false)}
                                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-705 text-zinc-300 hover:text-white rounded text-[9.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Add to Creative Catalog"
                                >
                                  <Download className="w-2.5 h-2.5 text-[#C9A84C]" /> Import
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleImportJasperDoc(doc, true)}
                                  className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-550 text-purple-400 hover:text-white rounded text-[9.5px] font-bold transition-all flex items-center gap-1 cursor-pointer font-mono uppercase"
                                  title="Import and adapt live with AI"
                                >
                                  <Sparkles className="w-2.5 h-2.5" /> Tailor
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-white text-xs font-bold group-hover/item:text-purple-400 transition-colors">
                                {doc.title}
                              </h4>
                              <p className="text-[10px] text-[#888888] line-clamp-2 leading-relaxed bg-black/35 p-2 rounded-lg font-mono italic">
                                "{doc.content}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick instructions guide */}
          <div className="bg-[#444444]/5 border border-[#444444]/60 p-5 rounded-2xl flex items-start gap-4 text-xs text-zinc-300 leading-relaxed">
            <Settings className="w-6 h-6 text-[#C9A84C] shrink-0 stroke-[1.5]" />
            <div className="space-y-1.5">
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[10px] block">Streamlining Digital Agency & SMB Workflows</span>
              <p>
                Connecting popular content engines like <strong>Canva</strong> and <strong>Jasper</strong> empowers marketing directors or scaling creators to skip standard system file-export/import friction. Establish secure live keys above to pull vector frames, custom cover templates, and enterprise copy documents directly into your <strong>Synapse Sync Library</strong> in real-time, instantly ready for cross-platform optimization.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

// Private sub helper icons to stay modular and self-contained
function FolderIndicator(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlaySymbol(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function getChannelIcon(id: string, className: string) {
  switch (id) {
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'x':
      return <Twitter className={className} />;
    case 'wordpress':
      return <BookOpen className={className} />;
    case 'medium':
      return <PenTool className={className} />;
    case 'newsletter':
      return <Mail className={className} />;
    case 'video':
      return <Youtube className={className} />;
    default:
      return <Globe className={className} />;
  }
}
