import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Check, Plus, Trash2, 
  Sparkles, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface BentoCard {
  id?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  colSpan?: string;
}

interface AboutData {
  badge: string;
  badgeAr?: string;
  headline: string;
  headlineAr?: string;
  bioParagraph1: string;
  bioParagraph1Ar?: string;
  bioParagraph2: string;
  bioParagraph2Ar?: string;
  coreStack: string[];
  bentoCards: BentoCard[];
}

const AVAILABLE_ICONS = [
  'Layers', 'Trending-up', 'Zap', 'Cpu', 'Code', 
  'Shield', 'Database', 'Server', 'Globe'
];

const defaultAbout: AboutData = {
  badge: 'About Me',
  badgeAr: 'نبذة عني',
  headline: 'Crafting Scalable Software with Purpose & Precision.',
  headlineAr: 'بناء برمجيات قابلة للتوسع بدقة واحترافية.',
  bioParagraph1: "I'm Yousef — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production.",
  bioParagraph1Ar: 'أنا يوسف — مهندس حاسوب ومطور برمجيات متكامل (Full-Stack Developer) متخصص في بناء أنظمة برمجية حقيقية وتطبيقات قابلة للتوسع.',
  bioParagraph2: 'My focus is on modern frontends (React, Next.js) paired with robust server-side architectures (Node.js).',
  bioParagraph2Ar: 'أركز على واجهات أمامية متطورة وسريعة بالاعتماد على React و Next.js متصلة بمعماريات خادم متينة وآمنة باستخدام Node.js.',
  coreStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'MySQL', 'PostgreSQL', 'REST APIs', 'GraphQL', 'MongoDB'],
  bentoCards: [
    {
      id: '01',
      title: 'Clean Architecture',
      titleAr: 'معمارية برمجية نظيفة',
      description: 'Maintainable, scalable codebases built on proven patterns with React, Next.js, and Node.js.',
      descriptionAr: 'أكواد برمجية نظيفة وقابلة للتوسع مبنية على أفضل المعايير الهندسية بالاعتماد على React و Node.js.',
      icon: 'Layers',
    },
    {
      id: '02',
      title: 'Business-First Mindset',
      titleAr: 'عقلية تركز على نمو الأعمال',
      description: 'Software engineered to solve real operational bottlenecks and unlock growth with measurable ROI.',
      descriptionAr: 'برمجيات مصممة لحل المشاكل التشغيلية وتسريع النمو وتحقيق نتائج أعمال ملموسة.',
      icon: 'Trending-up',
    },
    {
      id: '03',
      title: 'Performance & Reliability',
      titleAr: 'أداء فائق وموثوقية تامة',
      description: 'Zero compromise on load speeds, database query optimization, and sub-second response times.',
      descriptionAr: 'لا مساومة على سرعة التحميل، مع تحسين استعلامات قواعد البيانات، وسرعة استجابة فائقة.',
      icon: 'Zap',
      colSpan: 'sm:col-span-2',
    },
  ]
};

const AdminAbout = () => {
  const [data, setData] = useState<AboutData>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStackTag, setNewStackTag] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await api.get('/about');
      if (res.data?.data) {
        const fetched = res.data.data;
        let parsedStack = defaultAbout.coreStack;
        if (fetched.coreStack) {
          try {
            parsedStack = typeof fetched.coreStack === 'string' ? JSON.parse(fetched.coreStack) : fetched.coreStack;
          } catch {}
        }
        let parsedCards = defaultAbout.bentoCards;
        if (fetched.bentoCards) {
          try {
            const c = typeof fetched.bentoCards === 'string' ? JSON.parse(fetched.bentoCards) : fetched.bentoCards;
            if (Array.isArray(c) && c.length > 0) parsedCards = c;
          } catch {}
        }
        setData({
          badge: fetched.badge || defaultAbout.badge,
          badgeAr: fetched.badgeAr || defaultAbout.badgeAr,
          headline: fetched.headline || defaultAbout.headline,
          headlineAr: fetched.headlineAr || defaultAbout.headlineAr,
          bioParagraph1: fetched.bioParagraph1 || defaultAbout.bioParagraph1,
          bioParagraph1Ar: fetched.bioParagraph1Ar || defaultAbout.bioParagraph1Ar,
          bioParagraph2: fetched.bioParagraph2 || defaultAbout.bioParagraph2,
          bioParagraph2Ar: fetched.bioParagraph2Ar || defaultAbout.bioParagraph2Ar,
          coreStack: Array.isArray(parsedStack) ? parsedStack : defaultAbout.coreStack,
          bentoCards: parsedCards,
        });
      }
    } catch {
      showToast('Failed to fetch about settings', 'error');
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
      // Construct payload for API
      const payload = {
        badge: data.badge,
        badgeAr: data.badgeAr,
        headline: data.headline,
        headlineAr: data.headlineAr,
        bioParagraph1: data.bioParagraph1,
        bioParagraph1Ar: data.bioParagraph1Ar,
        bioParagraph2: data.bioParagraph2,
        bioParagraph2Ar: data.bioParagraph2Ar,
        coreStack: data.coreStack,
        coreStackAr: data.coreStack,
        bentoCards: data.bentoCards,
        // Also stringified for backwards-compat if needed
        bentoCardsAr: data.bentoCards.map(c => ({
          id: c.id,
          title: c.titleAr || c.title,
          description: c.descriptionAr || c.description,
          icon: c.icon,
          colSpan: c.colSpan
        }))
      };
      await api.put('/about', payload);
      try {
        localStorage.removeItem('portfolio_settings');
        window.dispatchEvent(new CustomEvent('portfolio_settings_updated'));
      } catch {}
      showToast('About section saved successfully!');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStackTag = () => {
    if (!newStackTag.trim()) return;
    if (!data.coreStack.includes(newStackTag.trim())) {
      setData({
        ...data,
        coreStack: [...data.coreStack, newStackTag.trim()]
      });
    }
    setNewStackTag('');
  };

  const handleDeleteStackTag = (tag: string) => {
    setData({
      ...data,
      coreStack: data.coreStack.filter(t => t !== tag)
    });
  };

  const handleAddBentoCard = () => {
    const newCard: BentoCard = {
      id: String(data.bentoCards.length + 1).padStart(2, '0'),
      title: 'New Capability',
      titleAr: 'ميزة جديدة',
      description: 'Describe your expertise or architectural advantage.',
      descriptionAr: 'اشرح الميزة الهندسية أو القيمة التي تقدمها هنا.',
      icon: 'Layers',
      colSpan: '',
    };
    setData({
      ...data,
      bentoCards: [...data.bentoCards, newCard]
    });
  };

  const handleUpdateBentoCard = (index: number, field: keyof BentoCard, value: any) => {
    const updated = [...data.bentoCards];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, bentoCards: updated });
  };

  const handleDeleteBentoCard = (index: number) => {
    setData({
      ...data,
      bentoCards: data.bentoCards.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>About Section | Admin</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Section Management (إدارة سكشن النبذة)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete bilingual control over badge, headline, bio paragraphs, core stack, and bento philosophy cards.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAbout} disabled={saving}>
            <RefreshCw size={16} className="mr-1.5" />
            Reload
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[130px]">
            {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Save size={16} className="mr-1.5" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl">
        {/* Main Section Headings */}
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Section Headers (العناوين والشعارات)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Badge Label (EN)
              </label>
              <Input
                value={data.badge}
                onChange={e => setData({ ...data, badge: e.target.value })}
                placeholder="About Me"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                شعار السكشن (AR)
              </label>
              <Input
                value={data.badgeAr || ''}
                onChange={e => setData({ ...data, badgeAr: e.target.value })}
                placeholder="نبذة عني"
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Main Headline (EN)
              </label>
              <Input
                value={data.headline}
                onChange={e => setData({ ...data, headline: e.target.value })}
                placeholder="Crafting Scalable Software with Purpose & Precision."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                الهيدلاين الرئيسي (AR)
              </label>
              <Input
                value={data.headlineAr || ''}
                onChange={e => setData({ ...data, headlineAr: e.target.value })}
                placeholder="بناء برمجيات قابلة للتوسع بدقة واحترافية."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Bio Paragraphs */}
        <div className="p-6 bg-card rounded-xl border border-border space-y-6">
          <h2 className="text-lg font-semibold">Bio Paragraphs (الفقرات التعريفية)</h2>
          
          {/* Paragraph 1 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paragraph 1 (الفقرة الأولى)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">English</label>
                <Textarea
                  value={data.bioParagraph1}
                  onChange={e => setData({ ...data, bioParagraph1: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">العربية</label>
                <Textarea
                  value={data.bioParagraph1Ar || ''}
                  onChange={e => setData({ ...data, bioParagraph1Ar: e.target.value })}
                  rows={4}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paragraph 2 (الفقرة الثانية)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">English</label>
                <Textarea
                  value={data.bioParagraph2}
                  onChange={e => setData({ ...data, bioParagraph2: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">العربية</label>
                <Textarea
                  value={data.bioParagraph2Ar || ''}
                  onChange={e => setData({ ...data, bioParagraph2Ar: e.target.value })}
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Technical Stack */}
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
          <h2 className="text-lg font-semibold">Core Technical Stack (التقنيات الأساسية)</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.coreStack.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-muted text-foreground border border-border"
              >
                {tag}
                <button
                  onClick={() => handleDeleteStackTag(tag)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <Input
              value={newStackTag}
              onChange={e => setNewStackTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddStackTag())}
              placeholder="Add skill (e.g. Next.js, Redis, Docker)..."
            />
            <Button variant="secondary" onClick={handleAddStackTag}>
              Add
            </Button>
          </div>
        </div>

        {/* Bento Grid Cards */}
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Bento Grid Cards (كروت الفلسفة البنتو)</h2>
              <p className="text-xs text-muted-foreground">Interactive feature cards rendered with bilingual titles and descriptions.</p>
            </div>
            <Button size="sm" onClick={handleAddBentoCard}>
              <Plus size={14} className="mr-1" /> Add Bento Card
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            {data.bentoCards.map((card, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-border bg-background/60 space-y-4 relative group">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-500">Bento Card #{idx + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteBentoCard(idx)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Title (EN)</label>
                    <Input
                      value={card.title}
                      onChange={e => handleUpdateBentoCard(idx, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان (AR)</label>
                    <Input
                      value={card.titleAr || ''}
                      onChange={e => handleUpdateBentoCard(idx, 'titleAr', e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Icon</label>
                    <select
                      value={card.icon}
                      onChange={e => handleUpdateBentoCard(idx, 'icon', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Description (EN)</label>
                    <Textarea
                      value={card.description}
                      onChange={e => handleUpdateBentoCard(idx, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف (AR)</label>
                    <Textarea
                      value={card.descriptionAr || ''}
                      onChange={e => handleUpdateBentoCard(idx, 'descriptionAr', e.target.value)}
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-4">
          <Button size="lg" onClick={handleSave} disabled={saving} className="min-w-[150px]">
            {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Save size={16} className="mr-1.5" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
