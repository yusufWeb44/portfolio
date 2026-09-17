import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import ExperienceTimeline, { type ExperienceItem } from '../components/ExperienceTimeline';
import CertificatesCarousel, { type CertificateItem } from '../components/CertificatesCarousel';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Experience = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, certRes] = await Promise.all([
          api.get('/experience'),
          api.get('/certificates')
        ]);
        setExperiences(expRes.data.data || []);
        setCertificates(certRes.data.data || []);
      } catch (error) {
        console.error('Failed to load experience and certificate data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-background min-h-screen">
      <Helmet>
        <title>{t('experience.title', 'Experience')} | Yusuf</title>
        <meta 
          name="description" 
          content="Interactive vertical career timeline and professional certifications history." 
        />
      </Helmet>

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
                {t('experience.badge', 'Career Roadmap & Milestones')}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] text-foreground">
              {t('experience.title', 'Experience.')}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mt-6 max-w-2xl leading-relaxed">
              {t('experience.subtitle', 'A chronological journey detailing academic foundations, industry experience, high-impact software projects, and recognized industry credentials.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Experience & Certificates Section */}
      <section className="pb-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs font-mono text-muted-foreground">{t('experience.loading', 'Loading career timeline...')}</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Vertical Animated Timeline */}
              <ExperienceTimeline experiences={experiences} />

              {/* Horizontal Certificates Carousel (Underneath the Vertical Timeline) */}
              <CertificatesCarousel certificates={certificates} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Experience;
