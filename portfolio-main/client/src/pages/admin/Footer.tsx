import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Save, Loader2, Check, Plus, Trash2,
  RefreshCw, Mail, MapPin, Phone,
  ArrowUpRight, CheckCircle2,
  Share2
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface QuickLinkItem {
  id: string;
  label: string;
  labelAr: string;
  url: string;
  isEnabled: boolean;
  order: number;
}

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  isEnabled: boolean;
}

interface FooterData {
  brandName: string;
  brandNameAr: string;
  brandRole: string;
  brandRoleAr: string;
  brandDescription: string;
  brandDescriptionAr: string;
  showSocialLinks: boolean;
  customSocialLinks: SocialLinkItem[];

  servicesTitle: string;
  servicesTitleAr: string;
  servicesLinkText: string;
  servicesLinkTextAr: string;
  servicesLinkUrl: string;
  servicesLimit: number;
  showServicesCol: boolean;

  quickLinksTitle: string;
  quickLinksTitleAr: string;
  quickLinks: QuickLinkItem[];
  showQuickLinksCol: boolean;

  contactTitle: string;
  contactTitleAr: string;
  contactEmail: string;
  contactLocation: string;
  contactLocationAr: string;
  contactPhone: string;
  showContactCol: boolean;

  copyrightText: string;
  copyrightTextAr: string;
  secondaryBadge: string;
  secondaryBadgeAr: string;
  showBackToTop: boolean;
}

const defaultFooter: FooterData = {
  brandName: 'Yousef Ayoubi',
  brandNameAr: 'يوسف الأيوبي',
  brandRole: 'Software Engineer',
  brandRoleAr: 'هندسة برمجيات',
  brandDescription: 'Architecting scalable digital products & high-performance software systems.',
  brandDescriptionAr: 'مهندس برمجيات متخصص في بناء وتطوير الأنظمة البرمجية المتقدمة والتطبيقات السحابية وحلول الذكاء الاصطناعي بأعلى المعايير العالمية.',
  showSocialLinks: true,
  customSocialLinks: [
    { id: '1', platform: 'GitHub', url: 'https://github.com', isEnabled: true },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', isEnabled: true },
    { id: '3', platform: 'Instagram', url: 'https://instagram.com', isEnabled: true },
    { id: '4', platform: 'X', url: 'https://x.com', isEnabled: true },
  ],

  servicesTitle: 'Services',
  servicesTitleAr: 'خدماتي',
  servicesLinkText: 'All Services',
  servicesLinkTextAr: 'جميع الخدمات',
  servicesLinkUrl: '#services',
  servicesLimit: 4,
  showServicesCol: true,

  quickLinksTitle: 'Quick Links',
  quickLinksTitleAr: 'روابط سريعة',
  quickLinks: [
    { id: '1', label: 'About Me', labelAr: 'من أنا ورؤيتي', url: '#about', isEnabled: true, order: 1 },
    { id: '2', label: 'Featured Projects', labelAr: 'أعمالي ومشاريعي', url: '#projects', isEnabled: true, order: 2 },
    { id: '3', label: 'Skills & Stack', labelAr: 'المهارات والخبرات', url: '#skills', isEnabled: true, order: 3 },
    { id: '4', label: 'Experience & Career', labelAr: 'المسيرة المهنية', url: '#experience', isEnabled: true, order: 4 },
    { id: '5', label: 'Contact Me', labelAr: 'تواصل معي', url: '#contact', isEnabled: true, order: 5 },
  ],
  showQuickLinksCol: true,

  contactTitle: 'Support & Contact',
  contactTitleAr: 'الدعم والتواصل',
  contactEmail: 'yosof2005a@gmail.com',
  contactLocation: 'Istanbul, Turkey',
  contactLocationAr: 'إسطنبول، تركيا',
  contactPhone: '+905519412068',
  showContactCol: true,

  copyrightText: `All rights reserved © ${new Date().getFullYear()} Yousef Ayoubi.`,
  copyrightTextAr: `جميع الحقوق محفوظة © ${new Date().getFullYear()} يوسف الأيوبي.`,
  secondaryBadge: 'Clean Code • High Performance',
  secondaryBadgeAr: 'كود نظيف • أداء فائق',
  showBackToTop: true,
};

const AdminFooter = () => {
  const [data, setData] = useState<FooterData>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'en'>('ar');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const res = await api.get('/footer');
      if (res.data?.data) {
        const fetched = res.data.data;
        let parsedQuickLinks = defaultFooter.quickLinks;
        if (fetched.quickLinks) {
          try {
            const parsed = typeof fetched.quickLinks === 'string' ? JSON.parse(fetched.quickLinks) : fetched.quickLinks;
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsedQuickLinks = parsed;
            }
          } catch {}
        }

        let parsedSocialLinks = defaultFooter.customSocialLinks;
        if (fetched.customSocialLinks) {
          try {
            const parsed = typeof fetched.customSocialLinks === 'string' ? JSON.parse(fetched.customSocialLinks) : fetched.customSocialLinks;
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsedSocialLinks = parsed;
            }
          } catch {}
        }

        setData({
          brandName: fetched.brandName || defaultFooter.brandName,
          brandNameAr: fetched.brandNameAr || defaultFooter.brandNameAr,
          brandRole: fetched.brandRole || defaultFooter.brandRole,
          brandRoleAr: fetched.brandRoleAr || defaultFooter.brandRoleAr,
          brandDescription: fetched.brandDescription || defaultFooter.brandDescription,
          brandDescriptionAr: fetched.brandDescriptionAr || defaultFooter.brandDescriptionAr,
          showSocialLinks: fetched.showSocialLinks ?? defaultFooter.showSocialLinks,
          customSocialLinks: parsedSocialLinks,

          servicesTitle: fetched.servicesTitle || defaultFooter.servicesTitle,
          servicesTitleAr: fetched.servicesTitleAr || defaultFooter.servicesTitleAr,
          servicesLinkText: fetched.servicesLinkText || defaultFooter.servicesLinkText,
          servicesLinkTextAr: fetched.servicesLinkTextAr || defaultFooter.servicesLinkTextAr,
          servicesLinkUrl: fetched.servicesLinkUrl || defaultFooter.servicesLinkUrl,
          servicesLimit: fetched.servicesLimit || defaultFooter.servicesLimit,
          showServicesCol: fetched.showServicesCol ?? defaultFooter.showServicesCol,

          quickLinksTitle: fetched.quickLinksTitle || defaultFooter.quickLinksTitle,
          quickLinksTitleAr: fetched.quickLinksTitleAr || defaultFooter.quickLinksTitleAr,
          quickLinks: parsedQuickLinks,
          showQuickLinksCol: fetched.showQuickLinksCol ?? defaultFooter.showQuickLinksCol,

          contactTitle: fetched.contactTitle || defaultFooter.contactTitle,
          contactTitleAr: fetched.contactTitleAr || defaultFooter.contactTitleAr,
          contactEmail: fetched.contactEmail || defaultFooter.contactEmail,
          contactLocation: fetched.contactLocation || defaultFooter.contactLocation,
          contactLocationAr: fetched.contactLocationAr || defaultFooter.contactLocationAr,
          contactPhone: fetched.contactPhone || defaultFooter.contactPhone,
          showContactCol: fetched.showContactCol ?? defaultFooter.showContactCol,

          copyrightText: fetched.copyrightText || defaultFooter.copyrightText,
          copyrightTextAr: fetched.copyrightTextAr || defaultFooter.copyrightTextAr,
          secondaryBadge: fetched.secondaryBadge || defaultFooter.secondaryBadge,
          secondaryBadgeAr: fetched.secondaryBadgeAr || defaultFooter.secondaryBadgeAr,
          showBackToTop: fetched.showBackToTop ?? defaultFooter.showBackToTop,
        });
      }
    } catch {
      showToast('Failed to load footer settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/footer', data);

      // Trigger local storage and event updates
      try {
        localStorage.removeItem('portfolio_footer_cache');
        window.dispatchEvent(new CustomEvent('portfolio_footer_updated'));
      } catch {}

      showToast('Footer settings saved successfully!');
    } catch {
      showToast('Failed to save footer settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuickLink = () => {
    const newLink: QuickLinkItem = {
      id: String(Date.now()),
      label: 'New Link',
      labelAr: 'رابط جديد',
      url: '#',
      isEnabled: true,
      order: data.quickLinks.length + 1,
    };
    setData({
      ...data,
      quickLinks: [...data.quickLinks, newLink],
    });
  };

  const handleUpdateQuickLink = (id: string, field: keyof QuickLinkItem, value: any) => {
    setData({
      ...data,
      quickLinks: data.quickLinks.map(l => l.id === id ? { ...l, [field]: value } : l),
    });
  };

  const handleDeleteQuickLink = (id: string) => {
    setData({
      ...data,
      quickLinks: data.quickLinks.filter(l => l.id !== id),
    });
  };

  const handleAddSocialLink = () => {
    const newSocial: SocialLinkItem = {
      id: String(Date.now()),
      platform: 'Instagram',
      url: 'https://instagram.com/',
      isEnabled: true,
    };
    setData({
      ...data,
      customSocialLinks: [...(data.customSocialLinks || []), newSocial],
    });
  };

  const handleUpdateSocialLink = (id: string, field: keyof SocialLinkItem, value: any) => {
    setData({
      ...data,
      customSocialLinks: (data.customSocialLinks || []).map(s => s.id === id ? { ...s, [field]: value } : s),
    });
  };

  const handleDeleteSocialLink = (id: string) => {
    setData({
      ...data,
      customSocialLinks: (data.customSocialLinks || []).filter(s => s.id !== id),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
          <p className="text-xs text-muted-foreground font-mono">Loading Footer configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Footer Section CMS | Yusuf Admin</title>
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : null}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">إدارة الفوتر (Footer CMS)</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                4 أعمدة ديناميكية
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              تحكم كامل في جميع أعمدة الفوتر، خدماتك، الروابط السريعة، معلومات التواصل، وحقوق النشر بدون أي تعديل بالكود.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFooter}
              disabled={loading || saving}
              className="text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تحديث
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-xs gap-2 min-w-[130px] font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  حفظ التعديلات
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex items-center justify-between gap-3 p-1.5 bg-muted/40 rounded-xl border border-border/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveLangTab('ar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeLangTab === 'ar'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base leading-none">🇸🇦</span>
              <span>المحتوى العربي (الأساسي)</span>
            </button>
            <button
              onClick={() => setActiveLangTab('en')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeLangTab === 'en'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-base leading-none">🇬🇧</span>
              <span>English Content</span>
            </button>
          </div>
        </div>

        {/* CARD 1: Brand & Bio (Column 1) */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  01
                </span>
                <h2 className="text-sm font-bold tracking-tight">العمود الأول: الهوية والنبذة (Brand & Identity)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                اللوغو يظهر تلقائياً بدون إطار بحجم مناسب، مع الاسم والنبذة التعبيرية عن خبراتك وأزرار السوشيال ميديا.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={data.showSocialLinks}
                onChange={(e) => setData({ ...data, showSocialLinks: e.target.checked })}
                className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <span>إظهار أزرار السوشيال</span>
            </label>
          </div>

          {activeLangTab === 'ar' ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">الاسم / اسم المنصة (عربي)</label>
                  <Input
                    value={data.brandNameAr}
                    onChange={(e) => setData({ ...data, brandNameAr: e.target.value })}
                    placeholder="يوسف الأيوبي"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">المسمى المهني / الشارة (عربي)</label>
                  <Input
                    value={data.brandRoleAr}
                    onChange={(e) => setData({ ...data, brandRoleAr: e.target.value })}
                    placeholder="هندسة برمجيات"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">نبذة الفوتر التعريفية (عربي)</label>
                <Textarea
                  value={data.brandDescriptionAr}
                  onChange={(e) => setData({ ...data, brandDescriptionAr: e.target.value })}
                  rows={3}
                  placeholder="اكتب النبذة التي تظهر أسفل اللوغو..."
                  dir="rtl"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Brand Name (English)</label>
                  <Input
                    value={data.brandName}
                    onChange={(e) => setData({ ...data, brandName: e.target.value })}
                    placeholder="Yousef Ayoubi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Role / Badge (English)</label>
                  <Input
                    value={data.brandRole}
                    onChange={(e) => setData({ ...data, brandRole: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Footer Description / Bio (English)</label>
                <Textarea
                  value={data.brandDescription}
                  onChange={(e) => setData({ ...data, brandDescription: e.target.value })}
                  rows={3}
                  placeholder="Enter the brief bio displayed under the logo..."
                />
              </div>
            </div>
          )}

          {/* Social Links CMS Manager */}
          <div className="pt-6 border-t border-border/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>روابط منصات التواصل الاجتماعي (Social Media Links)</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  تحكم كامل في منصات التواصل الظاهرة في الفوتر (انستغرام، لينكدإن، جيت هاب، إكس...). يمكنك إضافة وتعديل وحذف وتفعيل أي منصة.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocialLink}
                className="text-xs gap-1.5 border-dashed shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة منصة جديدة</span>
              </Button>
            </div>

            {/* List of social links */}
            <div className="space-y-2.5">
              {(data.customSocialLinks || []).map((social, idx) => (
                <div
                  key={social.id || idx}
                  className="p-3 rounded-xl border border-border/50 bg-background/50 flex flex-col sm:flex-row items-center gap-3 transition-colors hover:border-border"
                >
                  <span className="w-6 text-center font-mono text-xs text-muted-foreground shrink-0">
                    #{idx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 w-full items-center">
                    {/* Platform Select */}
                    <div className="sm:col-span-4">
                      <span className="text-[10px] text-muted-foreground block mb-0.5">المنصة (Platform)</span>
                      <select
                        value={social.platform}
                        onChange={(e) => handleUpdateSocialLink(social.id, 'platform', e.target.value)}
                        className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                      >
                        <option value="Instagram">Instagram (انستغرام)</option>
                        <option value="LinkedIn">LinkedIn (لينكدإن)</option>
                        <option value="GitHub">GitHub (جيت هاب)</option>
                        <option value="X">X (Twitter / إكس)</option>
                        <option value="WhatsApp">WhatsApp (واتساب)</option>
                        <option value="Telegram">Telegram (تلغرام)</option>
                        <option value="Facebook">Facebook (فيسبوك)</option>
                        <option value="Email">Email (البريد)</option>
                        <option value="Website">Website / Other (رابط آخر)</option>
                      </select>
                    </div>

                    {/* URL Input */}
                    <div className="sm:col-span-8">
                      <span className="text-[10px] text-muted-foreground block mb-0.5">رابط الحساب (Profile / Channel URL)</span>
                      <Input
                        value={social.url}
                        onChange={(e) => handleUpdateSocialLink(social.id, 'url', e.target.value)}
                        placeholder="https://instagram.com/username"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={social.isEnabled}
                        onChange={(e) => handleUpdateSocialLink(social.id, 'isEnabled', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-border text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>مفعل</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(social.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                      title="حذف المنصة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {(!data.customSocialLinks || data.customSocialLinks.length === 0) && (
                <div className="p-4 rounded-xl border border-dashed border-border/60 text-center space-y-2">
                  <p className="text-xs text-muted-foreground">لا توجد منصات تواصل مضافة حالياً.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                    className="text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة منصة (انستغرام، لينكدإن...)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: Services Column (Column 2 - Replaces Masarat) */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  02
                </span>
                <h2 className="text-sm font-bold tracking-tight">العمود الثاني: خدماتي (Services Column)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                بديل المسارات التخصصية بالصورة. يعرض خدماتك الحالية تلقائياً من قاعدة البيانات مع زر &quot;جميع الخدمات ←&quot;.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={data.showServicesCol}
                onChange={(e) => setData({ ...data, showServicesCol: e.target.checked })}
                className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <span>تفعيل العمود</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {activeLangTab === 'ar' ? 'عنوان العمود (عربي)' : 'Column Title (English)'}
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.servicesTitleAr : data.servicesTitle}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'servicesTitleAr' : 'servicesTitle']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'خدماتي' : 'Services'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {activeLangTab === 'ar' ? 'نص زر المزيد (عربي)' : 'Action Link Text (English)'}
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.servicesLinkTextAr : data.servicesLinkText}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'servicesLinkTextAr' : 'servicesLinkText']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'جميع الخدمات ←' : 'All Services →'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">عدد الخدمات المعروضة</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={data.servicesLimit}
                onChange={(e) => setData({ ...data, servicesLimit: parseInt(e.target.value, 10) || 4 })}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                الخدمات تُجلب آلياً وبشكل مترجم من قسم <strong>الخدمات (Services)</strong> في لوحة التحكم.
              </span>
            </div>
            <a
              href="/admin/services"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>تعديل قائمة الخدمات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* CARD 3: Quick Links (Column 3) */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                  03
                </span>
                <h2 className="text-sm font-bold tracking-tight">العمود الثالث: روابط سريعة (Quick Links Column)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                قائمة روابط للتنقل السريع بين أقسام الموقع. يمكنك إضافة، تعديل، حذف وتفعيل أي رابط.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={data.showQuickLinksCol}
                  onChange={(e) => setData({ ...data, showQuickLinksCol: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
                <span>تفعيل العمود</span>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddQuickLink}
                className="text-xs gap-1.5 border-dashed"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة رابط
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 max-w-sm">
            <label className="text-xs font-semibold text-foreground/80">
              {activeLangTab === 'ar' ? 'عنوان العمود (عربي)' : 'Column Title (English)'}
            </label>
            <Input
              value={activeLangTab === 'ar' ? data.quickLinksTitleAr : data.quickLinksTitle}
              onChange={(e) => setData({
                ...data,
                [activeLangTab === 'ar' ? 'quickLinksTitleAr' : 'quickLinksTitle']: e.target.value
              })}
              placeholder={activeLangTab === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Quick Links List */}
          <div className="space-y-2 pt-2">
            {data.quickLinks.map((link, idx) => (
              <div
                key={link.id || idx}
                className="p-3 rounded-xl border border-border/50 bg-background/50 flex flex-col md:flex-row items-center gap-3"
              >
                <span className="w-6 text-center font-mono text-xs text-muted-foreground shrink-0">
                  #{idx + 1}
                </span>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-0.5">النص بالعربية</span>
                    <Input
                      value={link.labelAr}
                      onChange={(e) => handleUpdateQuickLink(link.id, 'labelAr', e.target.value)}
                      placeholder="من أنا ورؤيتي"
                      dir="rtl"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-0.5">Label (English)</span>
                    <Input
                      value={link.label}
                      onChange={(e) => handleUpdateQuickLink(link.id, 'label', e.target.value)}
                      placeholder="About Me"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-0.5">الرابط / القسم Anchor</span>
                    <Input
                      value={link.url}
                      onChange={(e) => handleUpdateQuickLink(link.id, 'url', e.target.value)}
                      placeholder="#about"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.isEnabled}
                      onChange={(e) => handleUpdateQuickLink(link.id, 'isEnabled', e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>مفعل</span>
                  </label>

                  <button
                    onClick={() => handleDeleteQuickLink(link.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                    title="حذف الرابط"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: Support & Contact (Column 4) */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  04
                </span>
                <h2 className="text-sm font-bold tracking-tight">العمود الرابع: الدعم والتواصل (Support & Contact)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                معلومات التواصل المباشرة مرتبة: البريد الإلكتروني، رقم الهاتف، والموقع الجغرافي بالسطر الأخير.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={data.showContactCol}
                onChange={(e) => setData({ ...data, showContactCol: e.target.checked })}
                className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <span>تفعيل العمود</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-foreground/80">
                {activeLangTab === 'ar' ? 'عنوان العمود (عربي)' : 'Column Title (English)'}
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.contactTitleAr : data.contactTitle}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'contactTitleAr' : 'contactTitle']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'الدعم والتواصل' : 'Support & Contact'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* 1. Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span>البريد الإلكتروني (Email)</span>
              </label>
              <Input
                type="email"
                value={data.contactEmail}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                placeholder="yosof2005a@gmail.com"
              />
            </div>

            {/* 2. Phone / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span>رقم الهاتف / واتساب (Phone / WhatsApp)</span>
              </label>
              <Input
                value={data.contactPhone}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                placeholder="+905519412068"
              />
            </div>

            {/* 3. Location / Address - MUST BE THE LAST ITEM */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  {activeLangTab === 'ar' ? 'الموقع الجغرافي / العنوان (السطر الأخير بالعمود)' : 'Location / Address (Last Line in Column)'}
                </span>
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.contactLocationAr : data.contactLocation}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'contactLocationAr' : 'contactLocation']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'إسطنبول، تركيا' : 'Istanbul, Turkey'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        {/* CARD 5: Bottom Bar & Copyright */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                  05
                </span>
                <h2 className="text-sm font-bold tracking-tight">الشريط السفلي وحقوق النشر (Bottom Bar)</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                حقوق الملكية مع إبراز السنة واسم المنصة باللون الذهبي كما في التصميم، مع استبعاد روابط الخصوصية والشروط بناءً على طلبك.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={data.showBackToTop}
                onChange={(e) => setData({ ...data, showBackToTop: e.target.checked })}
                className="w-4 h-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <span>زر العودة للأعلى ↑</span>
            </label>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {activeLangTab === 'ar' ? 'نص حقوق النشر (عربي)' : 'Copyright Text (English)'}
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.copyrightTextAr : data.copyrightText}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'copyrightTextAr' : 'copyrightText']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'جميع الحقوق محفوظة © 2026 يوسف الأيوبي.' : 'All rights reserved © 2026 Yousef Ayoubi.'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {activeLangTab === 'ar' ? 'الشعار الإضافي / عبارة الجودة (عربي)' : 'Secondary Tagline (English)'}
              </label>
              <Input
                value={activeLangTab === 'ar' ? data.secondaryBadgeAr : data.secondaryBadge}
                onChange={(e) => setData({
                  ...data,
                  [activeLangTab === 'ar' ? 'secondaryBadgeAr' : 'secondaryBadge']: e.target.value
                })}
                placeholder={activeLangTab === 'ar' ? 'كود نظيف • أداء فائق' : 'Clean Code • High Performance'}
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        {/* Floating / Sticky Save Bar */}
        <div className="sticky bottom-6 z-40 p-4 rounded-2xl border border-border/80 bg-background/90 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>جميع التغييرات تحفظ في قاعدة البيانات وتنعكس مباشرة على الموقع.</span>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-xs gap-2 min-w-[150px] font-bold bg-foreground text-background hover:bg-foreground/90 shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                حفظ التعديلات الآن
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminFooter;
