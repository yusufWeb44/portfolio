import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Loader2, Send, CheckCircle, ArrowUpRight } from 'lucide-react';
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

const Contact = () => {
  const { t, currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    api.get('/settings').then(res => setSettings(res.data.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/messages', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', content: '' });
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
            <span className="text-xs font-bold tracking-widest uppercase text-background/40 block mb-8">
              {t('contact.badge', 'Contact')}
            </span>
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
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('contact.nameLabel', 'Your Name')} <span className="text-destructive">*</span></label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.namePlaceholder', 'e.g. John Doe')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('contact.emailLabel', 'Your Email Address')} <span className="text-destructive">*</span></label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.emailPlaceholder', 'e.g. john@example.com')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.subjectLabel', 'Subject / Project Scope')} <span className="text-destructive">*</span></label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.subjectPlaceholder', 'e.g. New Web Application Project')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.messageLabel', 'Your Message')} <span className="text-destructive">*</span></label>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={t('contact.messagePlaceholder', 'Describe your project, timeline, and key requirements...')}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="brand"
                    className="w-full gap-2 h-10 text-xs font-semibold rounded-xl cursor-pointer"
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
