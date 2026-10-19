import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Check, Plus, Trash2, 
  ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, 
  BarChart3, RefreshCw, Eye
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { getMediaUrl } from '../../utils/mediaUrl';

export interface StatItem {
  id: string;
  value: string;
  label: string;
  labelAr: string;
}

interface HeroSettingsData {
  heroText: string;
  heroTextAr?: string;
  bio: string;
  bioAr?: string;
  ctaText: string;
  ctaTextAr?: string;
  availability: string;
  availabilityAr?: string;
  typewriterWords: string;
  typewriterWordsAr?: string;
  profilePhoto?: string;
  heroStats?: string;
  heroStatsAr?: string;
}

const DEFAULT_STATS: StatItem[] = [
  { id: 'stat-1', value: '+4', label: 'Years Experience', labelAr: 'سنوات خبرة' },
  { id: 'stat-2', value: '+35', label: 'Completed Projects', labelAr: 'مشاريع منجزة' },
  { id: 'stat-3', value: '100%', label: 'Client Satisfaction', labelAr: 'رضا العملاء' },
  { id: 'stat-4', value: '99.9%', label: 'Code Quality', labelAr: 'جودة الكود' },
];

const parseListToInput = (val: any): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch {}
    }
    return val;
  }
  return String(val);
};

const AdminHero = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Hero Fields
  const [heroData, setHeroData] = useState<HeroSettingsData>({
    heroText: '',
    heroTextAr: '',
    bio: '',
    bioAr: '',
    ctaText: '',
    ctaTextAr: '',
    availability: '',
    availabilityAr: '',
    typewriterWords: '',
    typewriterWordsAr: '',
    profilePhoto: '',
    heroStats: '',
    heroStatsAr: '',
  });

  // Hero Stats list
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data?.data) {
        const data = res.data.data;
        setHeroData({
          heroText: data.heroText || '',
          heroTextAr: data.heroTextAr || '',
          bio: data.bio || '',
          bioAr: data.bioAr || '',
          ctaText: data.ctaText || 'See My Work',
          ctaTextAr: data.ctaTextAr || 'شاهد أعمالي',
          availability: data.availability || 'Available for Freelance & Consulting',
          availabilityAr: data.availabilityAr || 'متاح للمشاريع الحرة والاستشارات',
          typewriterWords: parseListToInput(data.typewriterWords),
          typewriterWordsAr: parseListToInput(data.typewriterWordsAr),
          profilePhoto: data.profilePhoto || '',
          heroStats: data.heroStats || '',
          heroStatsAr: data.heroStatsAr || '',
        });

        // Parse stats from JSON
        let enList: Array<{ value?: string; label?: string }> = [];
        let arList: Array<{ value?: string; label?: string }> = [];

        if (data.heroStats) {
          try {
            const parsed = typeof data.heroStats === 'string' ? JSON.parse(data.heroStats) : data.heroStats;
            if (Array.isArray(parsed)) enList = parsed;
          } catch (e) {
            console.error('Error parsing heroStats:', e);
          }
        }

        if (data.heroStatsAr) {
          try {
            const parsed = typeof data.heroStatsAr === 'string' ? JSON.parse(data.heroStatsAr) : data.heroStatsAr;
            if (Array.isArray(parsed)) arList = parsed;
          } catch (e) {
            console.error('Error parsing heroStatsAr:', e);
          }
        }

        const maxCount = Math.max(enList.length, arList.length);
        if (maxCount > 0) {
          const merged: StatItem[] = [];
          for (let i = 0; i < maxCount; i++) {
            const enItem = enList[i] || {};
            const arItem = arList[i] || {};
            merged.push({
              id: `stat-${i + 1}-${Date.now()}`,
              value: enItem.value || arItem.value || '+0',
              label: enItem.label || '',
              labelAr: arItem.label || enItem.label || '',
            });
          }
          setStats(merged);
        } else {
          setStats(DEFAULT_STATS);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      showToast('Failed to load hero settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const toSave: Record<string, any> = { ...heroData };

      // Format typewriterWords as JSON strings
      if (typeof toSave.typewriterWords === 'string') {
        const trimmed = toSave.typewriterWords.trim();
        if (!trimmed.startsWith('[')) {
          const arr = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
          toSave.typewriterWords = JSON.stringify(arr);
        }
      }
      if (typeof toSave.typewriterWordsAr === 'string') {
        const trimmed = toSave.typewriterWordsAr.trim();
        if (!trimmed.startsWith('[')) {
          const arr = trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
          toSave.typewriterWordsAr = JSON.stringify(arr);
        }
      }

      // Serialize Stats to heroStats and heroStatsAr
      const enStatsJson = JSON.stringify(
        stats.map(s => ({
          value: s.value.trim(),
          label: s.label.trim() || s.labelAr.trim() || 'Metric',
        }))
      );
      const arStatsJson = JSON.stringify(
        stats.map(s => ({
          value: s.value.trim(),
          label: s.labelAr.trim() || s.label.trim() || 'إحصائية',
        }))
      );

      toSave.heroStats = enStatsJson;
      toSave.heroStatsAr = arStatsJson;

      const res = await api.put('/settings', toSave);
      if (res.data?.data) {
        const returned = res.data.data;
        setHeroData(prev => ({
          ...prev,
          ...returned,
          typewriterWords: parseListToInput(returned.typewriterWords),
          typewriterWordsAr: parseListToInput(returned.typewriterWordsAr),
        }));

        try {
          localStorage.setItem('portfolio_settings', JSON.stringify(returned));
          window.dispatchEvent(new Event('portfolio_settings_updated'));
        } catch {}

        showToast('Hero section & statistics saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save hero settings:', error);
      showToast('Failed to save hero settings', 'error');
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
      const updated = { ...heroData, profilePhoto: photoUrl };
      setHeroData(updated);
      await api.put('/settings', { profilePhoto: photoUrl });
      try {
        const local = JSON.parse(localStorage.getItem('portfolio_settings') || '{}');
        local.profilePhoto = photoUrl;
        localStorage.setItem('portfolio_settings', JSON.stringify(local));
        window.dispatchEvent(new Event('portfolio_settings_updated'));
      } catch {}
      showToast('Profile photo updated successfully!');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      const msg = error.response?.data?.message || 'Failed to upload image';
      showToast(msg, 'error');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // Stats operations
  const handleAddStat = () => {
    const newStat: StatItem = {
      id: `stat-${Date.now()}`,
      value: '+10',
      label: 'New Metric',
      labelAr: 'إحصائية جديدة',
    };
    setStats([...stats, newStat]);
  };

  const handleUpdateStat = (id: string, field: keyof StatItem, val: string) => {
    setStats(stats.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleDeleteStat = (id: string) => {
    setStats(stats.filter(s => s.id !== id));
  };

  const handleMoveStat = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stats.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...stats];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setStats(copy);
  };

  const handleResetDefaultStats = () => {
    setStats(DEFAULT_STATS);
    showToast('Reset to default statistics preset');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      <Helmet>
        <title>Hero Section & Statistics | Admin Dashboard</title>
      </Helmet>

      {/* Floating Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles size={20} />
            </span>
            <h1 className="text-3xl font-bold tracking-tight">Hero Section & Statistics</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Complete bilingual control over your Homepage Hero, Headline, Bio, Call to Action, Specialties, and Stats bar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => handleSave()} disabled={saving} className="min-w-[140px]">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields (Headline, Bio, CTA, Specialties) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Hero Main Copywriting */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="border-b border-border pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Hero Text & Copywriting</h2>
                <p className="text-sm text-muted-foreground">Main headline, intro bio, and action button displayed in the hero section.</p>
              </div>
            </div>

            {/* Headline EN & AR */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Headline (English)</label>
                <Textarea 
                  value={heroData.heroText || ''} 
                  onChange={e => setHeroData({ ...heroData, heroText: e.target.value })}
                  rows={2} 
                  placeholder="End-to-End Web Development & Software Engineering"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">عنوان الهيرو الرئيسي (بالعربية)</label>
                <Textarea 
                  value={heroData.heroTextAr || ''} 
                  onChange={e => setHeroData({ ...heroData, heroTextAr: e.target.value })}
                  rows={2}
                  dir="rtl"
                  placeholder="تطوير برمجيات متكاملة وهندسة حلول الويب"
                />
              </div>
            </div>

            {/* Biography EN & AR */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Intro Biography (English)</label>
                <Textarea 
                  value={heroData.bio || ''} 
                  onChange={e => setHeroData({ ...heroData, bio: e.target.value })}
                  rows={4} 
                  placeholder="Building scalable web applications, custom CRM systems, and high-performance APIs..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">النبذة التعريفية (بالعربية)</label>
                <Textarea 
                  value={heroData.bioAr || ''} 
                  onChange={e => setHeroData({ ...heroData, bioAr: e.target.value })}
                  rows={4}
                  dir="rtl"
                  placeholder="تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات..."
                />
              </div>
            </div>

            {/* CTA Button Text EN & AR */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">CTA Button Text (English)</label>
                <Input 
                  value={heroData.ctaText || ''} 
                  onChange={e => setHeroData({ ...heroData, ctaText: e.target.value })}
                  placeholder="See My Work" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">نص زر الدعوة للعمل (بالعربية)</label>
                <Input 
                  value={heroData.ctaTextAr || ''} 
                  onChange={e => setHeroData({ ...heroData, ctaTextAr: e.target.value })}
                  placeholder="شاهد أعمالي"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Availability Status Badge EN & AR */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability Badge (English)</label>
                <Input 
                  value={heroData.availability || ''} 
                  onChange={e => setHeroData({ ...heroData, availability: e.target.value })}
                  placeholder="Available for Freelance & Consulting" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">شارة التفرغ والجاهزية (بالعربية)</label>
                <Input 
                  value={heroData.availabilityAr || ''} 
                  onChange={e => setHeroData({ ...heroData, availabilityAr: e.target.value })}
                  placeholder="متاح للمشاريع الحرة والاستشارات"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Roles / Specialties (Typewriter Marquee) */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-bold">Hero Specialties & Typewriter Roles</h2>
              <p className="text-sm text-muted-foreground">Animated rotating roles displayed near your photo/headline (separated by commas).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialties (English, comma-separated)</label>
                <Input 
                  value={heroData.typewriterWords || ''} 
                  onChange={e => setHeroData({ ...heroData, typewriterWords: e.target.value })}
                  placeholder="Computer Engineer, Full-Stack Developer, UI/UX Designer" 
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {heroData.typewriterWords?.split(',').map((w, idx) => w.trim() && (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border border-border/50">
                      {w.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">التخصصات (بالعربية، مفصولة بفواصل)</label>
                <Input 
                  value={heroData.typewriterWordsAr || ''} 
                  onChange={e => setHeroData({ ...heroData, typewriterWordsAr: e.target.value })}
                  placeholder="مهندس حاسوب, مطور ويب شامل, مصمم واجهات"
                  dir="rtl"
                />
                <div className="flex flex-wrap gap-1.5 mt-2" dir="rtl">
                  {heroData.typewriterWordsAr?.split(',').map((w, idx) => w.trim() && (
                    <span key={idx} className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border border-border/50">
                      {w.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 📊 HERO STATISTICS & METRICS (The User's specific request!) */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" size={20} />
                  <h2 className="text-lg font-bold">Hero Statistics Bar (إحصائيات الهيرو)</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Full control over the stat counters shown at the bottom of the hero section.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleResetDefaultStats} title="Reset to standard stats">
                  <RefreshCw size={13} className="mr-1.5" /> Defaults
                </Button>
                <Button size="sm" onClick={handleAddStat}>
                  <Plus size={14} className="mr-1.5" /> Add Stat
                </Button>
              </div>
            </div>

            {stats.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-3">No stats added yet. Add your first statistic to showcase your achievements.</p>
                <Button size="sm" onClick={handleAddStat}>
                  <Plus size={14} className="mr-1.5" /> Add First Stat
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div 
                    key={stat.id} 
                    className="p-4 rounded-xl border border-border/70 bg-background hover:border-emerald-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Stat Item
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStat(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStat(idx, 'down')}
                          disabled={idx === stats.length - 1}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStat(stat.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-1"
                          title="Delete Stat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Numerical / Percentage Value */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Value / الرقم
                        </label>
                        <Input
                          value={stat.value}
                          onChange={e => handleUpdateStat(stat.id, 'value', e.target.value)}
                          placeholder="+4 or 100%"
                          className="font-mono font-bold text-base"
                        />
                      </div>

                      {/* English Label */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Label (English)
                        </label>
                        <Input
                          value={stat.label}
                          onChange={e => handleUpdateStat(stat.id, 'label', e.target.value)}
                          placeholder="Years Experience"
                        />
                      </div>

                      {/* Arabic Label */}
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          التسمية (بالعربية)
                        </label>
                        <Input
                          value={stat.labelAr}
                          onChange={e => handleUpdateStat(stat.id, 'labelAr', e.target.value)}
                          placeholder="سنوات خبرة"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Profile Photo + Live Preview */}
        <div className="space-y-6">

          {/* Profile Photo Card */}
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
            <h2 className="text-lg font-bold">Profile Photo</h2>
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-border/80 shadow-md group bg-muted">
              {heroData.profilePhoto ? (
                <img 
                  src={getMediaUrl(heroData.profilePhoto)} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>

            <label className="cursor-pointer inline-block">
              <Button variant="outline" size="sm" asChild disabled={uploadingPhoto}>
                <span>
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Change Profile Photo'
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground">Recommended square format (WEBP, PNG, JPG).</p>
          </div>

          {/* Interactive Live Preview of Hero & Stats */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-emerald-500" />
                <h3 className="font-bold text-sm">Live Hero Preview</h3>
              </div>
              <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    previewLang === 'en' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('ar')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    previewLang === 'ar' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
                  }`}
                >
                  عربي
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-lg bg-background border border-border/60 space-y-3 ${previewLang === 'ar' ? 'text-right' : 'text-left'}`} dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
              {/* Availability */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{previewLang === 'ar' ? (heroData.availabilityAr || heroData.availability) : heroData.availability}</span>
              </div>

              {/* Headline */}
              <h4 className="text-base font-extrabold tracking-tight leading-snug">
                {previewLang === 'ar' ? (heroData.heroTextAr || heroData.heroText) : heroData.heroText}
              </h4>

              {/* Bio snippet */}
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {previewLang === 'ar' ? (heroData.bioAr || heroData.bio) : heroData.bio}
              </p>

              {/* CTA button */}
              <div className="pt-1">
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-bold shadow-xs">
                  {previewLang === 'ar' ? (heroData.ctaTextAr || heroData.ctaText) : heroData.ctaText}
                </span>
              </div>

              {/* Stats Bar Preview */}
              <div className="pt-3 border-t border-border/40 mt-3">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                  {previewLang === 'ar' ? 'معاينة شريط الإحصائيات' : 'Stats Bar Preview'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {stats.map((s, i) => (
                    <div key={i} className="p-2 rounded-md bg-muted/40 border border-border/40">
                      <div className="font-mono font-extrabold text-sm text-foreground">
                        {s.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {previewLang === 'ar' ? (s.labelAr || s.label) : s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={() => handleSave()} disabled={saving} className="w-full">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save All Hero Changes
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminHero;
