import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Loader2, Send, CheckCircle, ArrowUpRight } from 'lucide-react';
import { z } from 'zod';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface Settings {
  name?: string;
  nameAr?: string;
  email?: string;
  location?: string;
  locationAr?: string;
  availability?: string;
  availabilityAr?: string;
}

// Client-side XSS mitigation helper (strips markup tags & script protocols)
const sanitizeClientText = (val: string): string => {
  return val
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
};

const Contact = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: '',
    hp_company: '', // Honeypot: must stay empty
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [mountedAt] = useState(() => Date.now());

  // Zod Client-Side Hardened Schema
  const contactFormSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, isAr ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters')
      .max(80, isAr ? 'الاسم لا يمكن أن يتجاوز 80 حرفاً' : 'Name cannot exceed 80 characters'),
    email: z
      .string()
      .trim()
      .email(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address')
      .max(255, isAr ? 'البريد الإلكتروني طويل جداً' : 'Email is too long'),
    subject: z
      .string()
      .trim()
      .min(3, isAr ? 'الموضوع يجب أن يكون 3 أحرف على الأقل' : 'Subject must be at least 3 characters')
      .max(150, isAr ? 'الموضوع لا يمكن أن يتجاوز 150 حرفاً' : 'Subject cannot exceed 150 characters'),
    content: z
      .string()
      .trim()
      .min(10, isAr ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters')
      .max(3000, isAr ? 'الرسالة لا يمكن أن تتجاوز 3000 حرف' : 'Message cannot exceed 3000 characters'),
    hp_company: z.string().max(0).optional(),
  });

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // 1. Silent Honeypot Detection (Traps automated scrapers without alerting spam bot)
    if (formData.hp_company) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', content: '', hp_company: '' });
      return;
    }

    // 2. Strict Zod Client-Side Validation
    const validation = contactFormSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach(err => {
        const key = err.path[0]?.toString();
        if (key) {
          errors[key] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    // 3. Sanitized & Secure Payload Dispatch
    setLoading(true);
    try {
      const sanitizedPayload = {
        name: sanitizeClientText(formData.name),
        email: formData.email.trim().toLowerCase(),
        subject: sanitizeClientText(formData.subject),
        content: sanitizeClientText(formData.content),
        hp_company: formData.hp_company,
        clientTimestamp: mountedAt,
      };

      await api.post('/messages', sanitizedPayload);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', content: '', hp_company: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || t('contact.errorDefault', 'Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const email = settings?.email || 'hello@example.com';
  const location = isAr && settings?.locationAr ? settings.locationAr : (settings?.location || t('common.remote', 'Remote'));
  const availability = isAr && settings?.availabilityAr ? settings.availabilityAr : (settings?.availability || t('hero.availability', 'Available for work'));
  const displayName = isAr && settings?.nameAr ? settings.nameAr : (settings?.name ? settings.name.split(' ')[0] : 'Yusuf');

  return (
    <div className="w-full bg-background min-h-screen">
      <Helmet>
        <title>{t('nav.contact', 'Contact')} | {displayName}</title>
        <meta name="description" content="Get in touch for new projects and opportunities." />
      </Helmet>

      {/* ── SPLIT LAYOUT ─────────────────────────────────── */}
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* Left — bold statement */}
        <motion.div
          className="bg-foreground text-background flex flex-col justify-between p-10 md:p-16 pt-32 lg:pt-32 min-h-[50vh] lg:min-h-screen"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-balance mb-8">
              {t('contact.directStatement', "Let's build something great together.")}
            </h1>
            <p className="text-background/60 text-lg leading-relaxed max-w-sm">
              {t('contact.statementDesc', "Whether it's a new project, a full-time opportunity, or just a conversation — I'm open to it.")}
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-6 mt-12">
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-4 hover:text-background/70 transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center group-hover:border-background/40 transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs text-background/40 font-medium mb-0.5">{t('contact.sendEmail', 'Email')}</p>
                <p className="font-semibold text-sm">{email}</p>
              </div>
              <ArrowUpRight size={14} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-background/40 font-medium mb-0.5">{t('common.remote', 'Location')}</p>
                <p className="font-semibold text-sm">{location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-background/40 font-medium mb-0.5">{isAr ? 'حالة التفرغ' : t('hero.greeting', 'Status')}</p>
                <p className="font-semibold text-sm">{availability}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          className="flex flex-col justify-center p-10 md:p-16 pt-12 lg:pt-32"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-500" size={28} />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">{t('contact.successTitle', 'Message Sent Successfully!')}</h2>
                <p className="text-muted-foreground mb-8">{t('contact.successMessage', "Thank you for reaching out. I'll get back to you within 24 hours.")}</p>
                <Button onClick={() => setSuccess(false)} variant="brand-outline" className="h-9 px-5 rounded-full">
                  {t('contact.sendAnother', 'Send another message')}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-bold tracking-tighter mb-2">{t('contact.formTitle', 'Send a Direct Message')}</h2>
                <p className="text-muted-foreground mb-10">{t('contact.subtitle', "Whether you need a full-stack application, a custom API, or a mobile app — I'm ready to bring your vision to life.")}</p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Honeypot field: strictly hidden from human view, traps automated spam scrapers */}
                  <div
                    className="absolute -left-[9999px] opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <label htmlFor="hp_company">Company</label>
                    <input
                      id="hp_company"
                      type="text"
                      name="hp_company"
                      value={formData.hp_company}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">{t('contact.nameLabel', 'Your Name')} <span className="text-destructive">*</span></label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={80}
                        required
                        placeholder={t('contact.namePlaceholder', 'e.g. John Doe')}
                        className={fieldErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-destructive font-medium">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">{t('contact.emailLabel', 'Your Email Address')} <span className="text-destructive">*</span></label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={255}
                        required
                        placeholder={t('contact.emailPlaceholder', 'e.g. john@example.com')}
                        className={fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-destructive font-medium">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t('contact.subjectLabel', 'Subject / Project Scope')} <span className="text-destructive">*</span></label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      maxLength={150}
                      required
                      placeholder={t('contact.subjectPlaceholder', 'e.g. New Web Application Project')}
                      className={fieldErrors.subject ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                    {fieldErrors.subject && (
                      <p className="text-xs text-destructive font-medium">{fieldErrors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t('contact.messageLabel', 'Your Message')} <span className="text-destructive">*</span></label>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      maxLength={3000}
                      required
                      rows={6}
                      placeholder={t('contact.messagePlaceholder', 'Describe your project, timeline, and key requirements...')}
                      className={fieldErrors.content ? 'border-destructive focus-visible:ring-destructive' : ''}
                    />
                    {fieldErrors.content && (
                      <p className="text-xs text-destructive font-medium">{fieldErrors.content}</p>
                    )}
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="brand"
                    size="default"
                    className="w-full"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin h-4 w-4" /> {t('contact.sending', 'Sending message...')}</>
                    ) : (
                      <><Send size={14} /> {t('contact.submitButton', 'Send Message')}</>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
