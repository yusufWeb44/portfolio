import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface Skill {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  description?: string;
  descriptionAr?: string;
  isEnabled: boolean;
}

const categoryColors: Record<string, string> = {
  Frontend: 'hover:border-blue-500/40 hover:bg-blue-500/5',
  Backend: 'hover:border-emerald-500/40 hover:bg-emerald-500/5',
  Database: 'hover:border-amber-500/40 hover:bg-amber-500/5',
  DevOps: 'hover:border-purple-500/40 hover:bg-purple-500/5',
  Mobile: 'hover:border-pink-500/40 hover:bg-pink-500/5',
  Design: 'hover:border-orange-500/40 hover:bg-orange-500/5',
};

const Skills = () => {
  const { currentLang } = useLanguage();
  const isAr = currentLang === 'ar';
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    api.get('/skills').then(res => {
      setSkills(res.data.data.filter((s: Skill) => s.isEnabled));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    const cat = isAr ? (skill.categoryAr || skill.category) : skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.keys(grouped);

  return (
    <div className="w-full bg-background min-h-screen">
      <Helmet>
        <title>{isAr ? 'المهارات والترسانة التقنية | يوسف' : 'Stack & Skills | Yusuf'}</title>
        <meta name="description" content="Technical skills, languages, frameworks, and tools." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-6">
              {isAr ? 'الترسانة والمهارات التقنية' : 'Technical Stack'}
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-6">
              {isAr ? 'المهارات والقدرات.' : 'My Arsenal.'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              {isAr 
                ? 'مجموعة متكاملة من الأدوات والتقنيات البرمجية التي أعتمد عليها لبناء حلول رقمية موثوقة وعالية الأداء.'
                : 'Tools and technologies I use to craft high-quality digital products. Click a category to filter.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter pills */}
      {!loading && categories.length > 0 && (
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-3">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                activeCategory === null
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-card/60 dark:bg-white/[0.04] text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 border border-border/60'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({skills.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-card/60 dark:bg-white/[0.04] text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 border border-border/60'
                }`}
              >
                {cat} ({grouped[cat].length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skills display */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-wrap gap-3 animate-pulse">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-full" style={{ width: `${80 + Math.random() * 60}px` }} />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <p className="text-muted-foreground py-12">No skills published yet.</p>
          ) : (
            <div className="space-y-20">
              {(activeCategory ? [[activeCategory, grouped[activeCategory]]] as [string, Skill[]][] : Object.entries(grouped)).map(([category, categorySkills], ci) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: ci * 0.05 }}
                >
                  <div className="flex items-baseline gap-4 mb-8">
                    <h2 className="text-2xl font-bold tracking-tighter">{category}</h2>
                    <span className="text-sm text-muted-foreground">{categorySkills.length} technologies</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill, si) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: si * 0.03 }}
                        whileHover={{ y: -2 }}
                        title={isAr ? (skill.descriptionAr || skill.description) : skill.description}
                        className={`px-5 py-2.5 rounded-full border border-border bg-card cursor-default text-sm font-medium transition-all duration-200 ${categoryColors[category] || 'hover:border-foreground/30 hover:bg-muted'}`}
                        style={{ fontFamily: 'var(--font-en), var(--font-ar), system-ui, sans-serif' }}
                      >
                        {isAr ? (skill.nameAr || skill.name) : skill.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Large statement */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              Technology-<br /><span className="text-muted-foreground italic">agnostic.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              While I have deep expertise in the React and Node.js ecosystems, I'm not tied to any single stack. The right tool is chosen by the problem, not habit.
            </p>
            <a href="/projects" className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-wide hover:text-muted-foreground transition-colors">
              See the work it powers →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
