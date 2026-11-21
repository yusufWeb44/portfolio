import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Save, Loader2, RefreshCw, Mail,
  MapPin, Phone, Globe, Send, CheckCircle2, ShieldCheck,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactSettingsData {
  // 1. Home Section Meta
  contactBadge: string;
  contactBadgeAr: string;
  contactTitle: string;
  contactTitleAr: string;
  contactSubtitle: string;
  contactSubtitleAr: string;

  // 2. Direct Channels
  email: string;
  whatsappNumber: string;
  location: string;
  locationAr: string;
  availability: string;
  availabilityAr: string;

  // 3. Action Buttons & Labels
  chatWhatsapp: string;
  chatWhatsappAr: string;
  sendEmail: string;
  sendEmailAr: string;
  findMe: string;
  findMeAr: string;

  // 4. Dedicated /contact Page & Form
  directStatement: string;
  directStatementAr: string;
  statementDesc: string;
  statementDescAr: string;
  formTitle: string;
  formTitleAr: string;
  submitButton: string;
  submitButtonAr: string;
  successTitle: string;
  successTitleAr: string;
  successMessage: string;
  successMessageAr: string;
  sendAnother: string;
  sendAnotherAr: string;
}

const defaultContactData: ContactSettingsData = {
  contactBadge: 'Get In Touch',
  contactBadgeAr: 'تواصل معي',
  contactTitle: "Have an idea? Let's talk.",
  contactTitleAr: 'لديك فكرة أو مشروع؟ دعنا نتحدث.',
  contactSubtitle: "Whether you need a full-stack application, a custom API, a modern dashboard, or a mobile app — I'm ready to bring your vision to life.",
  contactSubtitleAr: 'سواء كنت بحاجة إلى تطبيق ويب متكامل، أو واجهة برمجية مخصصة، أو لوحة تحكم حديثة، أو تطبيق هاتف — أنا جاهز لتحويل رؤيتك إلى واقع.',

  email: 'hello@example.com',
  whatsappNumber: '+905555555555',
  location: 'Remote / Worldwide',
  locationAr: 'عن بُعد / عالمياً',
  availability: 'Available for work',
  availabilityAr: 'متاح للعمل والمشاريع',

  chatWhatsapp: 'Chat on WhatsApp',
  chatWhatsappAr: 'تواصل عبر واتساب',
  sendEmail: 'Send an Email',
  sendEmailAr: 'إرسال بريد إلكتروني',
  findMe: 'Find me on:',
  findMeAr: 'أو تابعنا على:',

  directStatement: "Let's build something great together.",
  directStatementAr: 'دعنا نبني شيئاً استثنائياً معاً.',
  statementDesc: "Whether it's a new project, a consulting engagement, or a full-time opportunity — I'm always open to discussing high-impact ideas.",
  statementDescAr: 'سواء كان ذلك مشروعاً برمجياً جديداً، أو فرصة عمل، أو استشارة تقنية متخصصة — مكتبي وبريدي متاحان دائماً لك.',
  formTitle: 'Send a Direct Message',
  formTitleAr: 'أرسل رسالة مباشرة',
  submitButton: 'Send Message',
  submitButtonAr: 'إرسال الرسالة',
  successTitle: 'Message Sent Successfully!',
  successTitleAr: 'تم إرسال رسالتك بنجاح!',
  successMessage: "Thank you for reaching out. I'll get back to you within 24 hours.",
  successMessageAr: 'شكراً لتواصلك. سأقوم بالاطلاع على التفاصيل والرد عليك خلال 24 ساعة كحد أقصى.',
  sendAnother: 'Send another message',
  sendAnotherAr: 'إرسال رسالة أخرى',
};

const AdminContact: React.FC = () => {
  const { currentLang, currentDirection, refreshLanguages } = useLanguage();
  const isAr = currentLang === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'both' | 'en' | 'ar'>('both');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [data, setData] = useState<ContactSettingsData>(defaultContactData);
  const [existingTranslations, setExistingTranslations] = useState<any[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);

      // 1. Fetch settings
      const settingsRes = await api.get('/settings');
      const settings = settingsRes.data?.data || {};

      // 2. Fetch translations
      const transRes = await api.get('/translations').catch(() => ({ data: { data: [] } }));
      const translationsList = transRes.data?.data || [];
      setExistingTranslations(translationsList);

      const enTransObj = translationsList.find((item: any) => (item.languageCode || item.lang) === 'en');
      const arTransObj = translationsList.find((item: any) => (item.languageCode || item.lang) === 'ar');

      const parseData = (raw: any) => {
        if (!raw) return {};
        if (typeof raw === 'string') {
          try { return JSON.parse(raw); } catch { return {}; }
        }
        return raw;
      };

      const enData = parseData(enTransObj?.data);
      const arData = parseData(arTransObj?.data);

      setData({
        contactBadge: settings.contactBadge || enData['contact.badge'] || defaultContactData.contactBadge,
        contactBadgeAr: settings.contactBadgeAr || arData['contact.badge'] || defaultContactData.contactBadgeAr,
        contactTitle: settings.contactTitle || enData['contact.headline'] || defaultContactData.contactTitle,
        contactTitleAr: settings.contactTitleAr || arData['contact.headline'] || defaultContactData.contactTitleAr,
        contactSubtitle: settings.contactSubtitle || enData['contact.subtitle'] || defaultContactData.contactSubtitle,
        contactSubtitleAr: settings.contactSubtitleAr || arData['contact.subtitle'] || defaultContactData.contactSubtitleAr,

        email: settings.email || defaultContactData.email,
        whatsappNumber: settings.whatsappNumber || defaultContactData.whatsappNumber,
        location: settings.location || defaultContactData.location,
        locationAr: settings.locationAr || defaultContactData.locationAr,
        availability: settings.availability || defaultContactData.availability,
        availabilityAr: settings.availabilityAr || defaultContactData.availabilityAr,

        chatWhatsapp: enData['contact.chatWhatsapp'] || defaultContactData.chatWhatsapp,
        chatWhatsappAr: arData['contact.chatWhatsapp'] || defaultContactData.chatWhatsappAr,
        sendEmail: enData['contact.sendEmail'] || defaultContactData.sendEmail,
        sendEmailAr: arData['contact.sendEmail'] || defaultContactData.sendEmailAr,
        findMe: enData['contact.findMe'] || defaultContactData.findMe,
        findMeAr: arData['contact.findMe'] || defaultContactData.findMeAr,

        directStatement: enData['contact.directStatement'] || defaultContactData.directStatement,
        directStatementAr: arData['contact.directStatement'] || defaultContactData.directStatementAr,
        statementDesc: enData['contact.statementDesc'] || defaultContactData.statementDesc,
        statementDescAr: arData['contact.statementDesc'] || defaultContactData.statementDescAr,
        formTitle: enData['contact.formTitle'] || defaultContactData.formTitle,
        formTitleAr: arData['contact.formTitle'] || defaultContactData.formTitleAr,
        submitButton: enData['contact.submitButton'] || defaultContactData.submitButton,
        submitButtonAr: arData['contact.submitButton'] || defaultContactData.submitButtonAr,
        successTitle: enData['contact.successTitle'] || defaultContactData.successTitle,
        successTitleAr: arData['contact.successTitle'] || defaultContactData.successTitleAr,
        successMessage: enData['contact.successMessage'] || defaultContactData.successMessage,
        successMessageAr: arData['contact.successMessage'] || defaultContactData.successMessageAr,
        sendAnother: enData['contact.sendAnother'] || defaultContactData.sendAnother,
        sendAnotherAr: arData['contact.sendAnother'] || defaultContactData.sendAnotherAr,
      });
    } catch (err: any) {
      console.error('Failed to load contact data:', err);
      showToast('Failed to load contact settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof ContactSettingsData, val: string) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      // 1. Save settings payload to /api/settings
      const settingsPayload = {
        contactBadge: data.contactBadge,
        contactBadgeAr: data.contactBadgeAr,
        contactTitle: data.contactTitle,
        contactTitleAr: data.contactTitleAr,
        contactSubtitle: data.contactSubtitle,
        contactSubtitleAr: data.contactSubtitleAr,
        email: data.email,
        whatsappNumber: data.whatsappNumber,
        location: data.location,
        locationAr: data.locationAr,
        availability: data.availability,
        availabilityAr: data.availabilityAr,
      };

      await api.put('/settings', settingsPayload);

      // 2. Synchronize translations for both English and Arabic
      const enTransObj = existingTranslations.find((item: any) => (item.languageCode || item.lang) === 'en');
      const arTransObj = existingTranslations.find((item: any) => (item.languageCode || item.lang) === 'ar');

      const parseData = (raw: any) => {
        if (!raw) return {};
        if (typeof raw === 'string') {
          try { return JSON.parse(raw); } catch { return {}; }
        }
        return raw;
      };

      const currentEnDict = parseData(enTransObj?.data);
      const currentArDict = parseData(arTransObj?.data);

      const updatedEnDict = {
        ...currentEnDict,
        'contact.badge': data.contactBadge,
        'contact.headline': data.contactTitle,
        'contact.subtitle': data.contactSubtitle,
        'contact.chatWhatsapp': data.chatWhatsapp,
        'contact.sendEmail': data.sendEmail,
        'contact.findMe': data.findMe,
        'contact.directStatement': data.directStatement,
        'contact.statementDesc': data.statementDesc,
        'contact.formTitle': data.formTitle,
        'contact.submitButton': data.submitButton,
        'contact.successTitle': data.successTitle,
        'contact.successMessage': data.successMessage,
        'contact.sendAnother': data.sendAnother,
      };

      const updatedArDict = {
        ...currentArDict,
        'contact.badge': data.contactBadgeAr,
        'contact.headline': data.contactTitleAr,
        'contact.subtitle': data.contactSubtitleAr,
        'contact.chatWhatsapp': data.chatWhatsappAr,
        'contact.sendEmail': data.sendEmailAr,
        'contact.findMe': data.findMeAr,
        'contact.directStatement': data.directStatementAr,
        'contact.statementDesc': data.statementDescAr,
        'contact.formTitle': data.formTitleAr,
        'contact.submitButton': data.submitButtonAr,
        'contact.successTitle': data.successTitleAr,
        'contact.successMessage': data.successMessageAr,
        'contact.sendAnother': data.sendAnotherAr,
      };

      await Promise.all([
        api.post('/translations', {
          languageCode: 'en',
          languageName: 'English',
          direction: 'ltr',
          isDefault: true,
          data: updatedEnDict,
        }),
        api.post('/translations', {
          languageCode: 'ar',
          languageName: 'العربية',
          direction: 'rtl',
          isDefault: false,
          data: updatedArDict,
        }),
      ]);

      // 3. Update localStorage and notify components
      try {
        const cached = localStorage.getItem('portfolio_settings');
        const parsed = cached ? JSON.parse(cached) : {};
        localStorage.setItem('portfolio_settings', JSON.stringify({ ...parsed, ...settingsPayload }));
        window.dispatchEvent(new CustomEvent('portfolio_settings_updated'));
      } catch {}

      await refreshLanguages();
      showToast(isAr ? 'تم حفظ جميع إعدادات ونصوص التواصل بنجاح!' : 'Contact settings and copy saved successfully!');
    } catch (err: any) {
      console.error('Error saving contact settings:', err);
      showToast(err.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
          <p className="text-xs text-muted-foreground font-mono">Loading Contact configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir={currentDirection} className="space-y-8 pb-16">
      <Helmet>
        <title>{isAr ? 'إدارة قسم التواصل | لوحة التحكم' : 'Contact Section CMS | Yusuf Admin'}</title>
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              CMS Module
            </span>
            <span className="text-xs text-muted-foreground">• Full Dynamic Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAr ? 'قسم التواصل والمراسلة' : 'Contact Section Management'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            {isAr
              ? 'تحكم كامل بنصوص وبطاقات وقنوات التواصل في الصفحة الرئيسية والصفحة المخصصة باللغتين العربية والإنجليزية دون كتابة أي كود.'
              : 'Manage all headings, direct channels, action buttons, and contact form copy across Home and the dedicated Contact page.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switch Tabs */}
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'both' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isAr ? 'الكل' : 'Both (EN & AR)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'en' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ar' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              عربي
            </button>
          </div>

          <Button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 h-9 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                {isAr ? 'جاري الحفظ...' : 'Saving Changes...'}
              </>
            ) : (
              <>
                <Save size={14} className={isAr ? 'ml-1.5' : 'mr-1.5'} />
                {isAr ? 'حفظ التعديلات' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: MAIN HEADINGS & IDENTITY */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs relative space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {isAr ? '1. هوية وعناوين بطاقة التواصل (الصفحة الرئيسية)' : '1. Section Header & Identity (Home Page)'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isAr ? 'العنوان الرئيسي والوصف الظاهر داخل بطاقة التواصل في واجهة الموقع' : 'Main title and subtitle rendered inside the contact card spotlight'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Fields */}
            {(activeTab === 'both' || activeTab === 'en') && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
                  <span>🇬🇧 English Header</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Section Badge</label>
                  <Input
                    value={data.contactBadge}
                    onChange={(e) => handleFieldChange('contactBadge', e.target.value)}
                    placeholder="Get In Touch"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Main Headline / Title</label>
                  <Input
                    value={data.contactTitle}
                    onChange={(e) => handleFieldChange('contactTitle', e.target.value)}
                    placeholder="Have an idea? Let's talk."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subtitle / Pitch Description</label>
                  <Textarea
                    rows={3}
                    value={data.contactSubtitle}
                    onChange={(e) => handleFieldChange('contactSubtitle', e.target.value)}
                    placeholder="Whether you need a full-stack application, a custom API..."
                  />
                </div>
              </div>
            )}

            {/* Arabic Fields */}
            {(activeTab === 'both' || activeTab === 'ar') && (
              <div className="space-y-4" dir="rtl">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
                  <span>🇸🇦 النصوص بالعربية</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">شارة القسم (Badge)</label>
                  <Input
                    value={data.contactBadgeAr}
                    onChange={(e) => handleFieldChange('contactBadgeAr', e.target.value)}
                    placeholder="تواصل معي"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">العنوان الرئيسي</label>
                  <Input
                    value={data.contactTitleAr}
                    onChange={(e) => handleFieldChange('contactTitleAr', e.target.value)}
                    placeholder="لديك فكرة أو مشروع؟ دعنا نتحدث."
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الوصف التفصيلي</label>
                  <Textarea
                    rows={3}
                    value={data.contactSubtitleAr}
                    onChange={(e) => handleFieldChange('contactSubtitleAr', e.target.value)}
                    placeholder="سواء كنت بحاجة إلى تطبيق ويب متكامل، أو واجهة برمجية مخصصة..."
                    dir="rtl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: DIRECT CHANNELS & DETAILS */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs relative space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {isAr ? '2. قنوات التواصل المباشرة والبيانات' : '2. Direct Contact Channels & Availability'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isAr ? 'البريد الإلكتروني، رقم الواتساب، الموقع الجغرافي، وحالة التفرغ للمشاريع' : 'Email, WhatsApp number with country code, location, and work availability status'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <span>{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Contact Email'}</span>
                </label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="hello@example.com"
                />
                <span className="text-[10px] text-muted-foreground">Used for mailto: links and direct message forwarding</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground" />
                  <span>{isAr ? 'رقم الواتساب (مع رمز الدولة)' : 'WhatsApp Number (with country code)'}</span>
                </label>
                <Input
                  type="text"
                  value={data.whatsappNumber}
                  onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                  placeholder="+905555555555"
                />
                <span className="text-[10px] text-muted-foreground">Full international format: +90... (opens wa.me directly)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span>Location (EN)</span>
                  </label>
                  <Input
                    value={data.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    placeholder="Remote / Worldwide"
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span>الموقع (عربي)</span>
                  </label>
                  <Input
                    value={data.locationAr}
                    onChange={(e) => handleFieldChange('locationAr', e.target.value)}
                    placeholder="عن بُعد / عالمياً"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-muted-foreground" />
                    <span>Availability (EN)</span>
                  </label>
                  <Input
                    value={data.availability}
                    onChange={(e) => handleFieldChange('availability', e.target.value)}
                    placeholder="Available for work"
                  />
                </div>
                <div className="space-y-1.5" dir="rtl">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-muted-foreground" />
                    <span>حالة التفرغ (عربي)</span>
                  </label>
                  <Input
                    value={data.availabilityAr}
                    onChange={(e) => handleFieldChange('availabilityAr', e.target.value)}
                    placeholder="متاح للعمل والمشاريع"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACTION BUTTONS & INTERACTIVE LABELS */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs relative space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {isAr ? '3. نصوص الأزرار والتفاعل السريع' : '3. Action Buttons & Quick Interactive Labels'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isAr ? 'نصوص زر الواتساب، زر البريد الإلكتروني، وعنوان روابط التواصل' : 'Text labels rendered on CTA buttons and social profile header'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* WhatsApp CTA */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500 block">
                WhatsApp Button Text
              </span>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block">English</span>
                <Input
                  value={data.chatWhatsapp}
                  onChange={(e) => handleFieldChange('chatWhatsapp', e.target.value)}
                  placeholder="Chat on WhatsApp"
                />
              </div>
              <div className="space-y-1" dir="rtl">
                <span className="text-[10px] text-muted-foreground block">العربية</span>
                <Input
                  value={data.chatWhatsappAr}
                  onChange={(e) => handleFieldChange('chatWhatsappAr', e.target.value)}
                  placeholder="تواصل عبر واتساب"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Email CTA */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500 block">
                Email Button Text
              </span>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block">English</span>
                <Input
                  value={data.sendEmail}
                  onChange={(e) => handleFieldChange('sendEmail', e.target.value)}
                  placeholder="Send an Email"
                />
              </div>
              <div className="space-y-1" dir="rtl">
                <span className="text-[10px] text-muted-foreground block">العربية</span>
                <Input
                  value={data.sendEmailAr}
                  onChange={(e) => handleFieldChange('sendEmailAr', e.target.value)}
                  placeholder="إرسال بريد إلكتروني"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Social Header */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500 block">
                Social Links Label
              </span>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block">English</span>
                <Input
                  value={data.findMe}
                  onChange={(e) => handleFieldChange('findMe', e.target.value)}
                  placeholder="Find me on:"
                />
              </div>
              <div className="space-y-1" dir="rtl">
                <span className="text-[10px] text-muted-foreground block">العربية</span>
                <Input
                  value={data.findMeAr}
                  onChange={(e) => handleFieldChange('findMeAr', e.target.value)}
                  placeholder="أو تابعنا على:"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: DEDICATED /contact PAGE & FORM COPY */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs relative space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {isAr ? '4. نصوص صفحة التواصل المستقلة (/contact) ونموذج الإرسال' : '4. Dedicated Page Copy (/contact) & Message Form'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isAr ? 'العبارة العريضة، وصف التفرغ، عنوان النموذج، ورسائل تأكيد الإرسال والنجاح' : 'Hero statement, description, form headline, and confirmation modal texts on /contact'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Dedicated Page Copy */}
            {(activeTab === 'both' || activeTab === 'en') && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
                  <span>🇬🇧 English Page Copy</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Direct Statement (Big Display Heading)</label>
                  <Input
                    value={data.directStatement}
                    onChange={(e) => handleFieldChange('directStatement', e.target.value)}
                    placeholder="Let's build something great together."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Statement Description</label>
                  <Textarea
                    rows={2}
                    value={data.statementDesc}
                    onChange={(e) => handleFieldChange('statementDesc', e.target.value)}
                    placeholder="Whether it's a new project, a full-time opportunity..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Form Title</label>
                    <Input
                      value={data.formTitle}
                      onChange={(e) => handleFieldChange('formTitle', e.target.value)}
                      placeholder="Send a Direct Message"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Submit Button Text</label>
                    <Input
                      value={data.submitButton}
                      onChange={(e) => handleFieldChange('submitButton', e.target.value)}
                      placeholder="Send Message"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Success Modal Title</label>
                    <Input
                      value={data.successTitle}
                      onChange={(e) => handleFieldChange('successTitle', e.target.value)}
                      placeholder="Message Sent Successfully!"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Send Another Button</label>
                    <Input
                      value={data.sendAnother}
                      onChange={(e) => handleFieldChange('sendAnother', e.target.value)}
                      placeholder="Send another message"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Success Modal Message</label>
                  <Textarea
                    rows={2}
                    value={data.successMessage}
                    onChange={(e) => handleFieldChange('successMessage', e.target.value)}
                    placeholder="Thank you for reaching out. I'll get back to you within 24 hours."
                  />
                </div>
              </div>
            )}

            {/* Arabic Dedicated Page Copy */}
            {(activeTab === 'both' || activeTab === 'ar') && (
              <div className="space-y-4" dir="rtl">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
                  <span>🇸🇦 نصوص الصفحة بالعربية</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">العبارة الكبرى (Statement)</label>
                  <Input
                    value={data.directStatementAr}
                    onChange={(e) => handleFieldChange('directStatementAr', e.target.value)}
                    placeholder="دعنا نبني شيئاً استثنائياً معاً."
                    dir="rtl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">وصف العبارة</label>
                  <Textarea
                    rows={2}
                    value={data.statementDescAr}
                    onChange={(e) => handleFieldChange('statementDescAr', e.target.value)}
                    placeholder="سواء كان ذلك مشروعاً برمجياً جديداً، أو فرصة عمل..."
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">عنوان نموذج الرسالة</label>
                    <Input
                      value={data.formTitleAr}
                      onChange={(e) => handleFieldChange('formTitleAr', e.target.value)}
                      placeholder="أرسل رسالة مباشرة"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">نص زر الإرسال</label>
                    <Input
                      value={data.submitButtonAr}
                      onChange={(e) => handleFieldChange('submitButtonAr', e.target.value)}
                      placeholder="إرسال الرسالة"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">عنوان نافذة النجاح</label>
                    <Input
                      value={data.successTitleAr}
                      onChange={(e) => handleFieldChange('successTitleAr', e.target.value)}
                      placeholder="تم إرسال رسالتك بنجاح!"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">زر إرسال رسالة أخرى</label>
                    <Input
                      value={data.sendAnotherAr}
                      onChange={(e) => handleFieldChange('sendAnotherAr', e.target.value)}
                      placeholder="إرسال رسالة أخرى"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">نص رسالة النجاح</label>
                  <Textarea
                    rows={2}
                    value={data.successMessageAr}
                    onChange={(e) => handleFieldChange('successMessageAr', e.target.value)}
                    placeholder="شكراً لتواصلك. سأقوم بالاطلاع على التفاصيل والرد عليك خلال 24 ساعة كحد أقصى."
                    dir="rtl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-4 border-t border-border/60">
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-6 h-10 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin mr-2" />
                {isAr ? 'جاري الحفظ...' : 'Saving Changes...'}
              </>
            ) : (
              <>
                <Save size={15} className={isAr ? 'ml-2' : 'mr-2'} />
                {isAr ? 'حفظ جميع الإعدادات' : 'Save All Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminContact;
