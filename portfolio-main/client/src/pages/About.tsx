import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, MapPin, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { getMediaUrl } from '../utils/mediaUrl';
import { useLanguage } from '../contexts/LanguageContext';

interface Settings {
  name: string;
  bio: string;
  location?: string;
  email?: string;
  profilePhoto?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  images: { url: string; isCover: boolean }[];
}

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const About = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, pRes] = await Promise.all([api.get('/settings'), api.get('/projects?public=true')]);
        setSettings(sRes.data.data);
        setProjects(pRes.data.data.slice(0, 3));
      } catch (e) {}
    };
    fetch();
  }, []);

  const name = settings?.name || 'Yusuf Ayoubi';
  const bio = settings?.bio || t('about.bio1', 'Full-Stack Engineer building digital products that perform, scale, and delight.');
  const photo = settings?.profilePhoto ? getMediaUrl(settings.profilePhoto) : null;
  const email = settings?.email || 'hello@example.com';

  const values = [
    { label: t('about.value1.label', 'Performance-First'), desc: t('about.value1.desc', 'Fast by default. Every millisecond matters.') },
    { label: t('about.value2.label', 'Type Safety'), desc: t('about.value2.desc', 'TypeScript everywhere. Confident, self-documenting code.') },
    { label: t('about.value3.label', 'Ship Fast, Refine Often'), desc: t('about.value3.desc', 'Iterative delivery beats big-bang releases.') },
    { label: t('about.value4.label', 'Systems Thinking'), desc: t('about.value4.desc', 'Reusable, composable, maintainable architectures.') },
  ];

  const approaches = [
    { step: '01', title: t('about.approach1.title', 'Understand Deeply'), desc: t('about.approach1.desc', 'Before writing a line of code, I invest in understanding the problem, the user, and the business constraints.') },
    { step: '02', title: t('about.approach2.title', 'Design for Scale'), desc: t('about.approach2.desc', 'I architect systems that can grow. Clean separation of concerns, clear interfaces, well-defined boundaries.') },
    { step: '03', title: t('about.approach3.title', 'Deliver with Craft'), desc: t('about.approach3.desc', 'The final 20% matters. Smooth interactions, precise error handling, accessible markup, and optimized performance.') },
  ];

  return (
    <div className="w-full bg-transparent">
      <Helmet>
        <title>{t('nav.about', 'About')} {name}</title>
        <meta name="description" content={`Learn about ${name}, a Full-Stack Engineer.`} />
      </Helmet>

      {/* ─── HERO: Identity ────────────────────────────────────── */}
      <section className="min-h-screen pt-24 pb-16 px-6 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-6">
                {t('about.badge', 'About')}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.06] mb-8">
                {name.split(' ')[0]}<br />
                <span className="text-muted-foreground">{name.split(' ').slice(1).join(' ')}</span>
              </h1>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
                <MapPin size={14} />
                <span>{settings?.location || t('common.remote', 'Remote')}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{t('common.fullStackEngineer', 'Full-Stack Engineer')}</span>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-md">{bio}</p>

              <div className="flex gap-4">
                <a
                  href={`mailto:${email}`}
                  className="h-10 px-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm hover:shadow-md hover:shadow-emerald-500/15 transition-colors duration-200 cursor-pointer"
                >
                  <span>{t('about.sayHello', 'Say hello')}</span>
                  <ArrowUpRight size={14} className="rtl:rotate-[-90deg]" />
                </a>
                <a
                  href="/contact"
                  className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-border/70 hover:border-emerald-500/50 hover:text-emerald-400 bg-card/60 dark:bg-white/[0.04] text-foreground text-xs font-semibold transition-colors duration-200 cursor-pointer"
                >
                  <Download size={13} />
                  <span>{t('about.downloadCv', 'Resume')}</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Photo side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-md mx-auto lg:ml-auto">
              {/* Main photo */}
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-muted border border-border relative">
                {photo ? (
                  <img src={photo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <span className="text-7xl font-bold text-muted-foreground/20 tracking-tighter">
                      {name.split('').filter((_, i) => i === 0 || name[i-1] === ' ').join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating project thumbnails */}
              {projects.map((p, i) => {
                const img = p.images?.find(x => x.isCover)?.url || p.images?.[0]?.url;
                if (!img) return null;
                const positions = [
                  '-top-6 -right-6 w-32 h-24',
                  '-bottom-6 -left-6 w-36 h-24',
                  'top-1/2 -right-10 w-28 h-20',
                ];
                return (
                  <motion.div
                    key={p.id}
                    className={`absolute ${positions[i]} rounded-xl overflow-hidden border-2 border-background shadow-xl`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                );
              })}

              {/* Floating stat card */}
              <motion.div
                className="absolute -bottom-4 right-4 bg-card border border-border rounded-2xl px-5 py-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="text-2xl font-bold tracking-tighter">35+</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t('about.shippedProjects', 'Projects shipped')}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VALUES ────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-border/40 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t('about.howIBuild', 'How I Build.')}</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                className="bg-card/40 dark:bg-white/[0.03] backdrop-blur-xl border border-border/60 rounded-2xl p-8 md:p-10 cursor-default group hover:border-emerald-500/40 transition-all"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-xs font-mono text-muted-foreground mb-4">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-foreground transition-colors">{v.label}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY QUOTE ──────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="border-l-2 border-foreground pl-8">
              <p className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight text-balance">
                "{t('about.philosophyQuote', 'Great software is invisible to the user but impossible to ignore in its effects.')}"
              </p>
              <p className="text-muted-foreground text-sm font-medium mt-6">{t('about.philosophySub', 'My engineering philosophy')}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── APPROACH ──────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">{t('about.approachTitle', 'My Approach.')}</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {approaches.map((s) => (
              <FadeIn key={s.step}>
                <div className="flex flex-col h-full">
                  <span className="text-6xl font-bold text-muted-foreground/15 tracking-tighter mb-6">{s.step}</span>
                  <h3 className="text-xl font-bold tracking-tight mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
