import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { ServiceCarousel } from '../components/ui/services-card';
import { useLanguage } from '../contexts/LanguageContext';

interface Service {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  isEnabled: boolean;
}

const Services = () => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [socialWhatsApp, setSocialWhatsApp] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([
      api.get('/services'),
      api.get('/social-links'),
    ]).then(([servRes, socRes]) => {
      if (servRes.status === 'fulfilled') {
        const enabled = (servRes.value.data.data || []).filter((s: Service) => s.isEnabled);
        setServices(enabled);
      }
      if (socRes.status === 'fulfilled') {
        const links: { platform: string; url: string }[] = socRes.value.data.data || [];
        const wa = links.find(l => l.platform.toLowerCase() === 'whatsapp');
        if (wa) setSocialWhatsApp(wa.url);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-background min-h-screen">
      <Helmet>
        <title>{isAr ? 'الخدمات والاستشارات | يوسف' : 'Services | Yusuf'}</title>
        <meta name="description" content="Development services and consulting offerings." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground block mb-6">
              {isAr ? 'الخدمات والاستشارات' : 'What I Offer'}
            </span>
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
                {isAr ? 'الخدمات.' : 'Services.'}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                {isAr 
                  ? 'خدمات برمجية وهندسية متخصصة لمساعدتك في بناء وإطلاق مشاريعك بأعلى كفاءة وسرعة.'
                  : 'Specialized engineering services built to help you ship faster, scale confidently, and delight users.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[460px] bg-muted/40 rounded-3xl border border-border/50" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border/70 rounded-3xl bg-card/30">
              <p className="text-muted-foreground">{isAr ? 'يتم تحديث الخدمات حالياً.' : 'No services published yet.'}</p>
            </div>
          ) : (
            <ServiceCarousel
              services={services.map((service, i) => ({
                id: service.id,
                number: String(i + 1).padStart(2, '0'),
                title: isAr ? (service.titleAr || service.title) : service.title,
                description: isAr ? (service.descriptionAr || service.description) : service.description,
              }))}
              whatsappBaseUrl={socialWhatsApp}
            />
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            My Process.
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: '01', t: 'Discovery', d: 'Deep-dive into requirements, users, and technical constraints.' },
              { n: '02', t: 'Architecture', d: 'Design scalable systems and select the right technologies.' },
              { n: '03', t: 'Build', d: 'Iterative development with continuous feedback and transparency.' },
              { n: '04', t: 'Ship & Support', d: 'Clean deployment, monitoring, and ongoing partnership.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-px bg-border -z-0" />
                )}
                <div className="text-4xl font-bold text-muted-foreground/15 tracking-tighter mb-6">{step.n}</div>
                <h3 className="text-lg font-bold tracking-tight mb-3">{step.t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
              Ready to work together?
            </h2>
            <a
              href="/contact"
              className="inline-flex h-10 px-6 items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-500/15 cursor-pointer"
            >
              <span>Start a conversation</span>
              <ArrowUpRight size={15} className="rtl:rotate-[-90deg]" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
