import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Plus, Trash2, Check, Image as ImageIcon, 
  Palette, Type, LayoutGrid, Sparkles, Eye
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { applyCustomFonts } from '../../utils/fontLoader';
import { getMediaUrl } from '../../utils/mediaUrl';
import { THEME_COLOR_OPTIONS, applyThemePalette } from '../../utils/themeEngine';

interface PortfolioSettings {
  name: string;
  nameAr?: string;
  bio: string;
  bioAr?: string;
  heroText: string;
  heroTextAr?: string;
  ctaText: string;
  ctaTextAr?: string;
  location: string;
  locationAr?: string;
  availability: string;
  availabilityAr?: string;
  email: string;
  profilePhoto?: string;
  typewriterWords?: string;
  typewriterWordsAr?: string;
  whatsappNumber?: string;
  footerText?: string;
  footerTextAr?: string;

  // Hero Stats & Metrics
  heroStats?: string;
  heroStatsAr?: string;

  // Theme & UI Customization
  primaryThemeColor?: string;
  fontFamilyEn?: string;
  fontUrlEn?: string;
  fontFamilyAr?: string;
  fontUrlAr?: string;
  cardStyle?: string;
  enableGlow?: boolean;
  backgroundPattern?: string;

  // Section Badges, Headings & Subtitles (EN & AR)
  workflowBadge?: string;
  workflowBadgeAr?: string;
  workflowTitle?: string;
  workflowTitleAr?: string;
  workflowSubtitle?: string;
  workflowSubtitleAr?: string;

  projectsBadge?: string;
  projectsBadgeAr?: string;
  projectsTitle?: string;
  projectsTitleAr?: string;
  projectsSubtitle?: string;
  projectsSubtitleAr?: string;

  skillsBadge?: string;
  skillsBadgeAr?: string;
  skillsTitle?: string;
  skillsTitleAr?: string;
  skillsDescription?: string;
  skillsDescriptionAr?: string;
  skillsParagraph1?: string;
  skillsParagraph1Ar?: string;
  skillsParagraph2?: string;
  skillsParagraph2Ar?: string;
  skillsPoint1Title?: string;
  skillsPoint1TitleAr?: string;
  skillsPoint1Text?: string;
  skillsPoint1TextAr?: string;
  skillsPoint2Title?: string;
  skillsPoint2TitleAr?: string;
  skillsPoint2Text?: string;
  skillsPoint2TextAr?: string;

  experienceBadge?: string;
  experienceBadgeAr?: string;
  experienceTitle?: string;
  experienceTitleAr?: string;
  experienceSubtitle?: string;
  experienceSubtitleAr?: string;

  servicesBadge?: string;
  servicesBadgeAr?: string;
  servicesTitle?: string;
  servicesTitleAr?: string;
  servicesSubtitle?: string;
  servicesSubtitleAr?: string;

  faqBadge?: string;
  faqBadgeAr?: string;
  faqTitle?: string;
  faqTitleAr?: string;
  faqSubtitle?: string;
  faqSubtitleAr?: string;

  contactBadge?: string;
  contactBadgeAr?: string;
  contactTitle?: string;
  contactTitleAr?: string;
  contactSubtitle?: string;
  contactSubtitleAr?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

const THEME_COLORS = THEME_COLOR_OPTIONS;

const CARD_STYLES = [
  { id: 'glassmorphic', name: 'Glassmorphic Translucent', desc: 'Backdrop blur with delicate translucent glass border.' },
  { id: 'minimal-border', name: 'Minimal Border', desc: 'Crisp subtle border with solid dark background.' },
  { id: 'deep-obsidian', name: 'Deep Obsidian', desc: 'Ultra-deep dark midnight luxury appearance.' },
  { id: 'frosted', name: 'Frosted Glow', desc: 'Soft frosted blur with dynamic border reflection.' },
];

const PATTERNS = [
  { id: 'subtle-grid', name: 'Subtle Grid (Default)' },
  { id: 'dots', name: 'Radial Star Dots' },
  { id: 'none', name: 'Clean Solid (No Pattern)' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'sections' | 'appearance'>('profile');
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: '',
    bio: '',
    heroText: '',
    ctaText: '',
    location: '',
    availability: '',
    email: '',
    profilePhoto: '',
    primaryThemeColor: 'emerald',
    fontFamilyEn: 'Geist',
    fontUrlEn: '',
    fontFamilyAr: 'Cairo',
    fontUrlAr: '',
    cardStyle: 'glassmorphic',
    enableGlow: true,
    backgroundPattern: 'subtle-grid',
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, linksRes] = await Promise.all([
          api.get('/settings'),
          api.get('/social-links')
        ]);
        if (settingsRes.data.data) {
          setSettings(prev => ({ ...prev, ...settingsRes.data.data }));
          if (settingsRes.data.data.primaryThemeColor) {
            applyThemePalette(settingsRes.data.data.primaryThemeColor);
          }
        }
        setSocialLinks(linksRes.data.data || []);
      } catch (error) {
        showToast("Failed to fetch settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyCustomFonts({
      fontFamilyEn: settings.fontFamilyEn,
      fontUrlEn: settings.fontUrlEn,
      fontFamilyAr: settings.fontFamilyAr,
      fontUrlAr: settings.fontUrlAr,
    });
  }, [settings.fontFamilyEn, settings.fontUrlEn, settings.fontFamilyAr, settings.fontUrlAr]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data.data);
      if (res.data.data?.primaryThemeColor) {
        applyThemePalette(res.data.data.primaryThemeColor);
      }
      try {
        localStorage.setItem('portfolio_settings', JSON.stringify(res.data.data));
        window.dispatchEvent(new Event('portfolio_settings_updated'));
      } catch {}
      showToast("Settings and appearance saved successfully!");
    } catch (error) {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingPhoto(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const photoUrl = res.data.url;
      const updated = { ...settings, profilePhoto: photoUrl };
      setSettings(updated);
      await api.put('/settings', updated);
      showToast("Profile photo uploaded and saved");
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      const msg = error.response?.data?.message || "Failed to upload image";
      showToast(msg, "error");
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleAddLink = async () => {
    try {
      const res = await api.post('/social-links', { platform: 'New Platform', url: 'https://', order: socialLinks.length });
      setSocialLinks([...socialLinks, res.data.data]);
    } catch (error) {
      showToast("Failed to add link", "error");
    }
  };

  const handleUpdateLink = async (id: string, field: string, value: string) => {
    const link = socialLinks.find(l => l.id === id);
    if (!link) return;
    const updated = { ...link, [field]: value };
    setSocialLinks(socialLinks.map(l => l.id === id ? updated : l));
    
    try {
      await api.put(`/social-links/${id}`, updated);
    } catch (error) {}
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await api.delete(`/social-links/${id}`);
      setSocialLinks(socialLinks.filter(l => l.id !== id));
      showToast("Link removed");
    } catch (error) {
      showToast("Failed to remove link", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <Helmet>
        <title>Settings & UI Appearance | Admin Dashboard</title>
      </Helmet>

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Portfolio Settings & UI Control</h1>
          <p className="text-muted-foreground text-sm">Full control over texts, bilingual content, themes, typography, and card appearances.</p>
        </div>
        <Button onClick={() => handleSaveSettings()} disabled={saving} className="min-w-[140px]">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Settings</>}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile & Hero
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sections'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Section Copywriting (EN & AR)
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'appearance'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles size={15} className="text-emerald-500" />
          Appearance & UI Styling
        </button>
      </div>

      {/* TAB 1: Profile & Hero */}
      {activeTab === 'profile' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-card border border-border rounded-xl overflow-hidden space-y-6 p-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-lg font-bold">General Information & Hero</h2>
                <p className="text-sm text-muted-foreground">Provide information in English and Arabic for complete bilingual control.</p>
              </div>

              {/* Display Name EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name (English)</label>
                  <Input 
                    value={settings.name || ''} 
                    onChange={e => setSettings({...settings, name: e.target.value})} 
                    placeholder="Yusuf Ayoubi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم الكامل (بالعربية)</label>
                  <Input 
                    value={settings.nameAr || ''} 
                    onChange={e => setSettings({...settings, nameAr: e.target.value})} 
                    placeholder="يوسف الأيوبي"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Email & Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input 
                    type="email"
                    value={settings.email || ''} 
                    onChange={e => setSettings({...settings, email: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    value={settings.location || ''} 
                    onChange={e => setSettings({...settings, location: e.target.value})} 
                  />
                </div>
              </div>

              {/* Availability EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability Status (English)</label>
                  <Input 
                    value={settings.availability || ''} 
                    onChange={e => setSettings({...settings, availability: e.target.value})}
                    placeholder="Available for Freelance & Consulting" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة التوفر (بالعربية)</label>
                  <Input 
                    value={settings.availabilityAr || ''} 
                    onChange={e => setSettings({...settings, availabilityAr: e.target.value})}
                    placeholder="متاح للمشاريع الحرة والاستشارات"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Hero Headline EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Headline (English)</label>
                  <Textarea 
                    value={settings.heroText || ''} 
                    onChange={e => setSettings({...settings, heroText: e.target.value})}
                    rows={2} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان الهيرو الرئيسي (بالعربية)</label>
                  <Textarea 
                    value={settings.heroTextAr || ''} 
                    onChange={e => setSettings({...settings, heroTextAr: e.target.value})}
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Biography EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Biography (English)</label>
                  <Textarea 
                    value={settings.bio || ''} 
                    onChange={e => setSettings({...settings, bio: e.target.value})}
                    rows={4} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">النبذة التعريفية (بالعربية)</label>
                  <Textarea 
                    value={settings.bioAr || ''} 
                    onChange={e => setSettings({...settings, bioAr: e.target.value})}
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* CTA Button Text EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Button Text (English)</label>
                  <Input 
                    value={settings.ctaText || ''} 
                    onChange={e => setSettings({...settings, ctaText: e.target.value})}
                    placeholder="See My Work" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نص زر الدعوة للعمل (بالعربية)</label>
                  <Input 
                    value={settings.ctaTextAr || ''} 
                    onChange={e => setSettings({...settings, ctaTextAr: e.target.value})}
                    placeholder="شاهد أعمالي"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Typewriter Roles EN & AR */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Typewriter Roles (English, comma-separated)</label>
                  <Input 
                    value={settings.typewriterWords || ''} 
                    onChange={e => setSettings({...settings, typewriterWords: e.target.value})}
                    placeholder="Full-Stack Developer, Software Developer, React Expert" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">كلمات التايب رايتر (بالعربية، مفصولة بفواصل)</label>
                  <Input 
                    value={settings.typewriterWordsAr || ''} 
                    onChange={e => setSettings({...settings, typewriterWordsAr: e.target.value})}
                    placeholder="مطور تطبيقات ويب متكامل, مهندس برمجيات ونظم, خبير React"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* WhatsApp & Footer */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">WhatsApp Number (e.g. +90 555 123 4567)</label>
                  <Input 
                    value={settings.whatsappNumber || ''} 
                    onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Footer Text (Arabic)</label>
                  <Input 
                    value={settings.footerTextAr || ''} 
                    onChange={e => setSettings({...settings, footerTextAr: e.target.value})}
                    placeholder="مهندس برمجيات متكامل يطور حلولاً رقمية وتطبيقات ويب سريعة وموثوقة."
                    dir="rtl"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Photo & Social Links Column */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden p-6 text-center">
              <h2 className="text-lg font-bold mb-4">Profile Photo</h2>
              <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border group bg-muted">
                {settings.profilePhoto ? (
                  <img src={getMediaUrl(settings.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild disabled={uploadingPhoto}>
                  <span>
                    {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">WEBP, PNG or JPG.</p>
            </div>

            {/* Social Links Card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h2 className="text-lg font-bold">Social Links</h2>
                <Button size="sm" variant="outline" onClick={handleAddLink}>
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
              {socialLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No social links added.</p>
              ) : (
                socialLinks.map(link => (
                  <div key={link.id} className="p-3 border border-border/50 rounded-lg bg-background relative group space-y-2">
                    <button 
                      onClick={() => handleDeleteLink(link.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">Platform</label>
                      <input 
                        className="w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 outline-none" 
                        value={link.platform} 
                        onChange={(e) => handleUpdateLink(link.id, 'platform', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-semibold uppercase">URL</label>
                      <input 
                        className="w-full bg-transparent border-none p-0 text-xs text-muted-foreground focus:ring-0 outline-none" 
                        value={link.url} 
                        onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Section Copywriting (Bilingual EN & AR) */}
      {activeTab === 'sections' && (
        <div className="space-y-8 max-w-5xl">
          {/* Projects Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">Projects Section (قسم المشاريع)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
                <Input
                  value={settings.projectsBadge ?? 'Featured Case Studies'}
                  onChange={e => setSettings({ ...settings, projectsBadge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
                <Input
                  value={settings.projectsBadgeAr ?? 'أعمال مختارة ودراسات حالة'}
                  onChange={e => setSettings({ ...settings, projectsBadgeAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Title (EN)</label>
                <Input
                  value={settings.projectsTitle ?? 'Selected Work.'}
                  onChange={e => setSettings({ ...settings, projectsTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
                <Input
                  value={settings.projectsTitleAr ?? 'المشاريع المميزة.'}
                  onChange={e => setSettings({ ...settings, projectsTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Subtitle (EN)</label>
                <Input
                  value={settings.projectsSubtitle ?? ''}
                  onChange={e => setSettings({ ...settings, projectsSubtitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف الفرعي (AR)</label>
                <Input
                  value={settings.projectsSubtitleAr ?? ''}
                  onChange={e => setSettings({ ...settings, projectsSubtitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Workflow Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">Workflow Section (قسم سير العمل)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
                <Input
                  value={settings.workflowBadge ?? 'Workflow & Methodology'}
                  onChange={e => setSettings({ ...settings, workflowBadge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
                <Input
                  value={settings.workflowBadgeAr ?? 'منهجية وسير العمل'}
                  onChange={e => setSettings({ ...settings, workflowBadgeAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Title (EN)</label>
                <Input
                  value={settings.workflowTitle ?? 'How I Engineer Digital Products'}
                  onChange={e => setSettings({ ...settings, workflowTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
                <Input
                  value={settings.workflowTitleAr ?? 'كيف أطور وأبني الحلول الرقمية'}
                  onChange={e => setSettings({ ...settings, workflowTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">Skills Section (قسم المهارات)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
                <Input
                  value={settings.skillsBadge ?? 'SKILLS & EXPERTISE'}
                  onChange={e => setSettings({ ...settings, skillsBadge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
                <Input
                  value={settings.skillsBadgeAr ?? 'المهارات والقدرات التقنية'}
                  onChange={e => setSettings({ ...settings, skillsBadgeAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Title (EN)</label>
                <Input
                  value={settings.skillsTitle ?? 'Engineered Core Capabilities'}
                  onChange={e => setSettings({ ...settings, skillsTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
                <Input
                  value={settings.skillsTitleAr ?? 'القدرات الهندسية الأساسية'}
                  onChange={e => setSettings({ ...settings, skillsTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Paragraph 1 (EN)</label>
                <Textarea
                  value={settings.skillsParagraph1 ?? ''}
                  onChange={e => setSettings({ ...settings, skillsParagraph1: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">الفقرة 1 (AR)</label>
                <Textarea
                  value={settings.skillsParagraph1Ar ?? ''}
                  onChange={e => setSettings({ ...settings, skillsParagraph1Ar: e.target.value })}
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">Experience Section (قسم الخبرات)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
                <Input
                  value={settings.experienceBadge ?? 'Career History & Academic Journey'}
                  onChange={e => setSettings({ ...settings, experienceBadge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
                <Input
                  value={settings.experienceBadgeAr ?? 'المسيرة المهنية والمحطات'}
                  onChange={e => setSettings({ ...settings, experienceBadgeAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Title (EN)</label>
                <Input
                  value={settings.experienceTitle ?? 'Experience.'}
                  onChange={e => setSettings({ ...settings, experienceTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
                <Input
                  value={settings.experienceTitleAr ?? 'الخبرات والمؤهلات.'}
                  onChange={e => setSettings({ ...settings, experienceTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">Services Section (قسم الخدمات)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
                <Input
                  value={settings.servicesBadge ?? 'Consulting & Offerings'}
                  onChange={e => setSettings({ ...settings, servicesBadge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
                <Input
                  value={settings.servicesBadgeAr ?? 'الخدمات والاستشارات'}
                  onChange={e => setSettings({ ...settings, servicesBadgeAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Title (EN)</label>
                <Input
                  value={settings.servicesTitle ?? 'Services.'}
                  onChange={e => setSettings({ ...settings, servicesTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
                <Input
                  value={settings.servicesTitleAr ?? 'ما الذي أقدمه لك.'}
                  onChange={e => setSettings({ ...settings, servicesTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* FAQ & Contact Section */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-bold text-foreground">FAQ & Contact Headings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">FAQ Title (EN)</label>
                <Input
                  value={settings.faqTitle ?? 'Common Questions.'}
                  onChange={e => setSettings({ ...settings, faqTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">عنوان الأسئلة الشائعة (AR)</label>
                <Input
                  value={settings.faqTitleAr ?? 'الأسئلة الأكثر شيوعاً.'}
                  onChange={e => setSettings({ ...settings, faqTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Contact Title (EN)</label>
                <Input
                  value={settings.contactTitle ?? "Have an idea? Let's talk."}
                  onChange={e => setSettings({ ...settings, contactTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">عنوان التواصل (AR)</label>
                <Input
                  value={settings.contactTitleAr ?? 'لديك فكرة أو مشروع؟ دعنا نتحدث.'}
                  onChange={e => setSettings({ ...settings, contactTitleAr: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={() => handleSaveSettings()} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save All Settings</>}
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: Appearance & UI Styling (الثيمات والمظهر والـ UI) */}
      {activeTab === 'appearance' && (
        <div className="space-y-8 max-w-5xl">
          {/* Primary Theme Color Picker */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="text-emerald-500 w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Primary Accent Color (لون الثيم الرئيسي)</h2>
                <p className="text-xs text-muted-foreground">Controls ambient glowing orbs, button glows, and interactive accent highlights across the website.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 pt-2">
              {THEME_COLORS.map(color => {
                const isSelected = (settings.primaryThemeColor || 'emerald').toLowerCase() === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      setSettings({ ...settings, primaryThemeColor: color.id });
                      applyThemePalette(color.id);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'border-border bg-card/60 hover:bg-muted'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center shadow-md`}>
                      {isSelected && <Check size={16} className="text-white" />}
                    </span>
                    <span className="text-xs font-semibold">{color.nameAr || color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography / Manual Font Configuration */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-6">
            <div className="flex items-center gap-2">
              <Type className="text-emerald-500 w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Custom Typography & Fonts (تخصيص الخطوط)</h2>
                <p className="text-xs text-muted-foreground">
                  خصص الخطوط المستقلة لكل من واجهة الموقع العربية والإنجليزية. اختر من الخطوط الجاهزة بنقرة واحدة أو اكتب اسم أي خط من Google Fonts ليتم تطبيقه فوراً.
                </p>
              </div>
            </div>

            {/* Language Font Distinction Alert */}
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-muted-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span>الموقع يمتلك خطين مستقلين: خط للواجهة العربية (RTL) وخط للواجهة الإنجليزية (LTR).</span>
              </div>
              <span className="text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-semibold">
                اللغة الافتراضية الحالية للموقع: العربية (Cairo)
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Arabic Font Configuration (Placed First for RTL priority) */}
              <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    خط الواجهة العربية (Arabic Font)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    {settings.fontFamilyAr || 'Cairo'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      اختر خطاً سريعاً (Popular Arabic Fonts):
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {[
                        'Cairo', 'Tajawal', 'Alexandria', 'Almarai', 
                        'Readex Pro', 'Amiri', 'IBM Plex Sans Arabic', 'Changa', 'Noto Sans Arabic'
                      ].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSettings({ ...settings, fontFamilyAr: f })}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                            (settings.fontFamilyAr || 'Cairo') === f
                              ? 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-sm'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      اسم الخط العربي (أو اكتب أي خط يدوي)
                    </label>
                    <Input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: Cairo, Tajawal, Alexandria, Almarai..."
                      value={settings.fontFamilyAr || ''}
                      onChange={e => setSettings({ ...settings, fontFamilyAr: e.target.value })}
                      className="bg-background text-sm text-right font-medium"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 text-right">
                      هذا هو الخط الذي يظهر على الموقع بالكامل عند التصفح باللغة العربية.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      رابط ملف الخط الخارجي (اختياري - Custom CDN / Webfont URL)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://fonts.googleapis.com/... أو رابط CDN خارجي"
                      value={settings.fontUrlAr || ''}
                      onChange={e => setSettings({ ...settings, fontUrlAr: e.target.value })}
                      className="bg-background text-sm font-mono text-xs"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 text-right">
                      اتركه فارغاً لجلب الخط تلقائياً من Google Fonts فور كتابة اسمه.
                    </p>
                  </div>
                </div>

                {/* Arabic Live Font Preview */}
                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      معاينة حية للخط العربي (Live Preview)
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">مباشر</span>
                  </div>
                  <div
                    dir="rtl"
                    className="p-4 rounded-lg bg-background border border-border space-y-2 text-right transition-all shadow-sm"
                    style={{ fontFamily: settings.fontFamilyAr ? `'${settings.fontFamilyAr}', system-ui, sans-serif` : "'Cairo', system-ui, sans-serif" }}
                  >
                    <p className="text-lg font-bold text-foreground leading-tight">
                      تصميم وتطوير تجارب رقمية وهندسية متكاملة
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      أبجد هوز حطي كلمن صعفض قرشت ثخذ ضظغ — ٠١٢٣٤٥٦٧٨٩ — المظهر الحالي لخط الموقع بالعربية.
                    </p>
                  </div>
                </div>
              </div>

              {/* English Font Configuration */}
              <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    English Font (الخط الإنجليزي)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    {settings.fontFamilyEn || 'Geist'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      Quick Pick (Popular Latin Fonts):
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {[
                        'Geist', 'Plus Jakarta Sans', 'Inter', 'Outfit', 
                        'Vollkorn', 'Poppins', 'Montserrat', 'Playfair Display', 'Lora', 'Roboto'
                      ].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSettings({ ...settings, fontFamilyEn: f })}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                            (settings.fontFamilyEn || 'Geist') === f
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      Font Family Name (اسم الخط)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Plus Jakarta Sans, Vollkorn, Inter, Outfit..."
                      value={settings.fontFamilyEn || ''}
                      onChange={e => setSettings({ ...settings, fontFamilyEn: e.target.value })}
                      className="bg-background text-sm font-medium"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      يُطبق عند تصفح الموقع باللغة الإنجليزية (LTR).
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                      Custom Webfont / CDN URL (اختياري - رابط ملف الخط)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://fonts.googleapis.com/... or custom CDN"
                      value={settings.fontUrlEn || ''}
                      onChange={e => setSettings({ ...settings, fontUrlEn: e.target.value })}
                      className="bg-background text-sm font-mono text-xs"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      اتركه فارغاً ليتم توليد واستدعاء رابط Google Fonts تلقائياً بحسب الاسم.
                    </p>
                  </div>
                </div>

                {/* English Live Font Preview */}
                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Live Preview (معاينة حية)
                    </span>
                    <span className="text-[10px] text-blue-500 font-medium">Live</span>
                  </div>
                  <div
                    className="p-4 rounded-lg bg-background border border-border space-y-2 transition-all shadow-sm"
                    style={{ fontFamily: settings.fontFamilyEn ? `'${settings.fontFamilyEn}', system-ui, sans-serif` : "'Geist', system-ui, sans-serif" }}
                  >
                    <p className="text-lg font-bold text-foreground leading-tight">
                      Crafting Exceptional Digital Solutions
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The quick brown fox jumps over the lazy dog. 0123456789 — Aa Bb Cc Dd Ee Ff Gg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Styles & Background Options */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="text-emerald-500 w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Card Styles & Background Atmosphere</h2>
                <p className="text-xs text-muted-foreground">Select how project cards, service cards, and UI containers appear.</p>
              </div>
            </div>

            {/* Card Style Selectors */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {CARD_STYLES.map(style => {
                const isSelected = (settings.cardStyle || 'glassmorphic') === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, cardStyle: style.id })}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected ? 'border-primary bg-accent/15 ring-2 ring-primary/40' : 'border-border bg-card/60 hover:bg-muted'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-foreground">{style.name}</span>
                        {isSelected && <Check size={15} className="text-emerald-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{style.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Background Pattern & Glow Toggle */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Background Pattern Overlay</label>
                <div className="grid grid-cols-1 gap-2">
                  {PATTERNS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, backgroundPattern: p.id })}
                      className={`p-3 rounded-lg border text-left text-sm transition-all flex justify-between items-center cursor-pointer ${
                        (settings.backgroundPattern || 'subtle-grid') === p.id
                          ? 'border-primary bg-accent/15 font-bold text-foreground'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{p.name}</span>
                      {(settings.backgroundPattern || 'subtle-grid') === p.id && <Check size={16} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Glow Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Ambient Glow Lighting (التوهج المحيطي)</label>
                <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">Enable Atmospheric Glowing Orbs</p>
                      <p className="text-xs text-muted-foreground">Deep GPU-composited glowing atmosphere behind the page.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableGlow !== false}
                      onChange={e => setSettings({ ...settings, enableGlow: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live UI Preview Card */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="text-emerald-500 w-5 h-5" />
              <h2 className="text-lg font-bold text-foreground">Live UI Component Preview (معاينة حية للمظهر)</h2>
            </div>
            <div className="p-8 rounded-2xl bg-background border border-border flex flex-col sm:flex-row gap-6 items-center justify-center">
              <div className={`p-6 rounded-2xl max-w-sm w-full border ${
                settings.cardStyle === 'deep-obsidian'
                  ? 'card-deep-obsidian'
                  : settings.cardStyle === 'minimal-border'
                  ? 'card-minimal-border'
                  : settings.cardStyle === 'frosted'
                  ? 'card-frosted'
                  : 'glass-card'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">Sample Card Preview</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Modern Digital Solution</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  This preview dynamically reflects your chosen theme color ({settings.primaryThemeColor || 'emerald'}), card style ({settings.cardStyle || 'glassmorphic'}), and font choices.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs font-mono font-bold text-emerald-400">Status: Active</span>
                  <Button size="sm">Explore →</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={() => handleSaveSettings()} disabled={saving} className="min-w-[160px]">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Appearance</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
