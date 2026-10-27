import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Loader2, Check, Search, Save } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface Skill {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  description?: string;
  descriptionAr?: string;
  order: number;
  isEnabled: boolean;
}

interface SectionSettings {
  skillsBadge: string;
  skillsBadgeAr?: string;
  skillsTitle: string;
  skillsTitleAr?: string;
  skillsParagraph1: string;
  skillsParagraph1Ar?: string;
  skillsParagraph2: string;
  skillsParagraph2Ar?: string;
  skillsPoint1Title: string;
  skillsPoint1TitleAr?: string;
  skillsPoint1Text: string;
  skillsPoint1TextAr?: string;
  skillsPoint2Title: string;
  skillsPoint2TitleAr?: string;
  skillsPoint2Text: string;
  skillsPoint2TextAr?: string;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>({
    skillsBadge: 'SKILLS & EXPERTISE',
    skillsBadgeAr: 'المهارات والقدرات التقنية',
    skillsTitle: 'Engineered Core Capabilities',
    skillsTitleAr: 'القدرات الهندسية الأساسية',
    skillsParagraph1: 'I architect full-stack systems end-to-end — from clean Node.js service layers with normalized relational schemas, to reactive React and Next.js frontends built for performance, accessibility, and long-term maintainability.',
    skillsParagraph1Ar: 'أقوم بهندسة النظم البرمجية المتكاملة من الألف إلى الياء — بدءاً من طبقات خوادم Node.js النظيفة وتصميم قواعد البيانات المتقنة، إلى واجهات React و Next.js التفاعلية المبنية لأعلى أداء وقابلية للتوسع.',
    skillsParagraph2: 'Every engineering decision is grounded in scalability: modular API design, precise database indexing, and production-tested deployment workflows.',
    skillsParagraph2Ar: 'كل قرار هندسي مبني على التوسع: تصميم واجهات برمجية معيارية، فهرسة دقيقة لقواعد البيانات، وإجراءات نشر مجربة في بيئات الإنتاج الحقيقية.',
    skillsPoint1Title: 'Architecture First',
    skillsPoint1TitleAr: 'المعمارية أولاً',
    skillsPoint1Text: 'Clean RESTful APIs & modular database design built to last.',
    skillsPoint1TextAr: 'واجهات برمجية RESTful نظيفة وتصميم قواعد بيانات متين صُمم ليدوم.',
    skillsPoint2Title: 'Modern Stack',
    skillsPoint2TitleAr: 'تقنيات حديثة',
    skillsPoint2Text: 'High-performance React, Next.js, and Tailwind implementations.',
    skillsPoint2TextAr: 'تطبيقات عالية الأداء بالاعتماد على React و Next.js و Tailwind.',
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingSkillId, setSavingSkillId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, settingsRes] = await Promise.allSettled([
        api.get('/skills'),
        api.get('/settings')
      ]);

      if (skillsRes.status === 'fulfilled') {
        const raw = skillsRes.value.data?.data || [];
        raw.sort((a: Skill, b: Skill) => (a.order || 0) - (b.order || 0));
        setSkills(raw);
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.data) {
        const d = settingsRes.value.data.data;
        setSectionSettings(prev => ({
          skillsBadge: d.skillsBadge || prev.skillsBadge,
          skillsBadgeAr: d.skillsBadgeAr || prev.skillsBadgeAr,
          skillsTitle: d.skillsTitle || prev.skillsTitle,
          skillsTitleAr: d.skillsTitleAr || prev.skillsTitleAr,
          skillsParagraph1: d.skillsParagraph1 || prev.skillsParagraph1,
          skillsParagraph1Ar: d.skillsParagraph1Ar || prev.skillsParagraph1Ar,
          skillsParagraph2: d.skillsParagraph2 || prev.skillsParagraph2,
          skillsParagraph2Ar: d.skillsParagraph2Ar || prev.skillsParagraph2Ar,
          skillsPoint1Title: d.skillsPoint1Title || prev.skillsPoint1Title,
          skillsPoint1TitleAr: d.skillsPoint1TitleAr || prev.skillsPoint1TitleAr,
          skillsPoint1Text: d.skillsPoint1Text || prev.skillsPoint1Text,
          skillsPoint1TextAr: d.skillsPoint1TextAr || prev.skillsPoint1TextAr,
          skillsPoint2Title: d.skillsPoint2Title || prev.skillsPoint2Title,
          skillsPoint2TitleAr: d.skillsPoint2TitleAr || prev.skillsPoint2TitleAr,
          skillsPoint2Text: d.skillsPoint2Text || prev.skillsPoint2Text,
          skillsPoint2TextAr: d.skillsPoint2TextAr || prev.skillsPoint2TextAr,
        }));
      }
    } catch {
      showToast("Failed to fetch skills data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      window.dispatchEvent(new CustomEvent('portfolio_settings_updated'));
      showToast("Bilingual section titles, paragraphs, and bullet points saved!");
    } catch {
      showToast("Failed to save section texts", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await api.post('/skills', {
        name: 'New Skill',
        nameAr: 'مهارة جديدة',
        category: 'Frontend',
        categoryAr: 'الواجهة الأمامية',
        description: 'Technology description for hover tooltip in English...',
        descriptionAr: 'وصف تفاعلي يظهر عند التحويم بالماوس فوق المهارة...',
        order: skills.length + 1,
        isEnabled: true,
      });
      setSkills([res.data.data, ...skills]);
      showToast("Skill created successfully");
    } catch {
      showToast("Failed to add skill", "error");
    }
  };

  const handleFieldChange = (id: string, field: keyof Skill, value: any) => {
    setSkills(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, [field]: value };
    }));
  };

  const handleSaveSkill = async (skillToSave: Skill) => {
    setSavingSkillId(skillToSave.id);
    try {
      const res = await api.put(`/skills/${skillToSave.id}`, skillToSave);
      if (res.data?.data) {
        setSkills(prev => prev.map(s => s.id === skillToSave.id ? { ...s, ...res.data.data } : s));
      }
      window.dispatchEvent(new CustomEvent('portfolio_skills_updated'));
      showToast(`Saved skill "${skillToSave.name}" successfully!`);
    } catch {
      showToast("Failed to save skill", "error");
    } finally {
      setSavingSkillId(null);
    }
  };

  const handleSaveAllSkills = async () => {
    setSavingAll(true);
    try {
      await Promise.all(skills.map(s => api.put(`/skills/${s.id}`, s)));
      window.dispatchEvent(new CustomEvent('portfolio_skills_updated'));
      showToast("All skills saved successfully!");
    } catch {
      showToast("Failed to save some skills", "error");
    } finally {
      setSavingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s.id !== id));
      window.dispatchEvent(new CustomEvent('portfolio_skills_updated'));
      showToast("Skill removed");
    } catch {
      showToast("Failed to remove skill", "error");
    }
  };

  const categories = ['ALL', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];

  const filteredSkills = skills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.nameAr || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || s.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="relative min-h-[80vh] space-y-8 pb-20">
      <Helmet><title>Skills & Marquee | Admin</title></Helmet>

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <span>Skills & Marquee</span>
            <span className="text-base text-muted-foreground font-normal">(إدارة مهارات الشريط المتحرك)</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة بويضات المهارات الأفقية المتحركة، الأيقونات البرمجية، التصنيفات، ونصوص نوافذ الهوفر التفاعلية.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSaveAllSkills} 
            disabled={savingAll || loading}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer"
          >
            {savingAll ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            Save All Skills
          </Button>
          <Button onClick={handleAdd} className="gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-sm cursor-pointer">
            <Plus size={16} /> Add Skill
          </Button>
        </div>
      </div>

      {/* Section Headings & Paragraphs Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Skills Section Narrative (العناوين والفقرات باللغتين)</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              تعديل الشعار، العناوين الرئيسية، الفقرات، والنقاط البارزة المعروضة في الجانب الأيسر من قسم المهارات.
            </p>
          </div>
          <Button 
            onClick={handleSaveSectionSettings} 
            disabled={savingSettings}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 shrink-0"
          >
            {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Section Text
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
            <Input 
              value={sectionSettings.skillsBadge} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsBadge: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">شعار السكشن (AR)</label>
            <Input 
              value={sectionSettings.skillsBadgeAr || ''} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsBadgeAr: e.target.value })}
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Heading (EN)</label>
            <Input 
              value={sectionSettings.skillsTitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsTitle: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (AR)</label>
            <Input 
              value={sectionSettings.skillsTitleAr || ''} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsTitleAr: e.target.value })}
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Paragraph 1 (EN)</label>
            <textarea 
              rows={3}
              value={sectionSettings.skillsParagraph1} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsParagraph1: e.target.value })}
              className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">الفقرة 1 (AR)</label>
            <textarea 
              rows={3}
              value={sectionSettings.skillsParagraph1Ar || ''} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsParagraph1Ar: e.target.value })}
              className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Paragraph 2 (EN)</label>
            <textarea 
              rows={3}
              value={sectionSettings.skillsParagraph2 || ''} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsParagraph2: e.target.value })}
              className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">الفقرة 2 (AR)</label>
            <textarea 
              rows={3}
              value={sectionSettings.skillsParagraph2Ar || ''} 
              onChange={e => setSectionSettings({ ...sectionSettings, skillsParagraph2Ar: e.target.value })}
              className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
              dir="rtl"
            />
          </div>
        </div>

        {/* Bullet Point 1 */}
        <div className="border-t border-border/70 pt-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <h3 className="text-sm font-bold text-foreground">Bullet Point 1 (النقطة البارزة الأولى)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Point 1 Title (EN)</label>
              <Input 
                value={sectionSettings.skillsPoint1Title || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint1Title: e.target.value })}
                placeholder="e.g. Architecture First"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">عنوان النقطة 1 (AR)</label>
              <Input 
                value={sectionSettings.skillsPoint1TitleAr || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint1TitleAr: e.target.value })}
                placeholder="مثال: المعمارية أولاً"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Point 1 Description (EN)</label>
              <textarea 
                rows={2}
                value={sectionSettings.skillsPoint1Text || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint1Text: e.target.value })}
                className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
                placeholder="Clean domain boundaries, predictable data flows, and decoupled modular architectures..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">وصف النقطة 1 (AR)</label>
              <textarea 
                rows={2}
                value={sectionSettings.skillsPoint1TextAr || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint1TextAr: e.target.value })}
                className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
                placeholder="حدود نطاق نظيفة، تدفقات بيانات متوقعة..."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Bullet Point 2 */}
        <div className="border-t border-border/70 pt-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <h3 className="text-sm font-bold text-foreground">Bullet Point 2 (النقطة البارزة الثانية)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Point 2 Title (EN)</label>
              <Input 
                value={sectionSettings.skillsPoint2Title || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint2Title: e.target.value })}
                placeholder="e.g. Full-Cycle Delivery"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">عنوان النقطة 2 (AR)</label>
              <Input 
                value={sectionSettings.skillsPoint2TitleAr || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint2TitleAr: e.target.value })}
                placeholder="مثال: دورة تطوير متكاملة"
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Point 2 Description (EN)</label>
              <textarea 
                rows={2}
                value={sectionSettings.skillsPoint2Text || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint2Text: e.target.value })}
                className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
                placeholder="From database schema design and API contracts to pixel-perfect responsive user interfaces."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">وصف النقطة 2 (AR)</label>
              <textarea 
                rows={2}
                value={sectionSettings.skillsPoint2TextAr || ''} 
                onChange={e => setSectionSettings({ ...sectionSettings, skillsPoint2TextAr: e.target.value })}
                className="w-full text-xs p-3 rounded-lg bg-background/50 border border-border/60 text-foreground resize-none leading-relaxed"
                placeholder="من تصميم مخططات قواعد البيانات وعقود الـ APIs..."
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills by name, Arabic name or description..."
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                selectedCat === cat
                  ? 'bg-foreground text-background border-foreground font-semibold'
                  : 'bg-card/60 text-muted-foreground border-border/60 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills List with Modern Capsule Preview & Clean Controls */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin w-8 h-8 text-muted-foreground" /></div>
      ) : (
        <div className="space-y-4">
          {filteredSkills.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
              No skills match your search or filter.
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <div key={skill.id} className="p-5 rounded-xl border border-border bg-card/70 hover:border-emerald-500/30 transition-all space-y-4 shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-sm text-foreground">{skill.name}</span>
                    {skill.nameAr && <span className="text-xs text-muted-foreground font-mono">({skill.nameAr})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={skill.isEnabled}
                        onChange={e => {
                          handleFieldChange(skill.id, 'isEnabled', e.target.checked);
                          handleSaveSkill({ ...skill, isEnabled: e.target.checked });
                        }}
                        className="w-4 h-4 rounded border-border text-emerald-500 accent-emerald-500 cursor-pointer"
                      />
                      <span>Active in Marquee (تفعيل في الشريط)</span>
                    </label>
                    <Button 
                      onClick={() => handleSaveSkill(skill)}
                      disabled={savingSkillId === skill.id}
                      size="sm"
                      className="h-8 px-3 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm cursor-pointer"
                    >
                      {savingSkillId === skill.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(skill.id)} 
                      className="text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                {/* Skill Name, Category & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Name (EN)</label>
                    <Input 
                      value={skill.name} 
                      onChange={e => handleFieldChange(skill.id, 'name', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">اسم المهارة (AR)</label>
                    <Input 
                      value={skill.nameAr || ''} 
                      onChange={e => handleFieldChange(skill.id, 'nameAr', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      className="h-8 text-xs font-semibold"
                      dir="rtl"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Category (EN)</label>
                    <Input 
                      value={skill.category} 
                      onChange={e => handleFieldChange(skill.id, 'category', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">التصنيف (AR)</label>
                    <Input 
                      value={skill.categoryAr || ''} 
                      onChange={e => handleFieldChange(skill.id, 'categoryAr', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      className="h-8 text-xs"
                      dir="rtl"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Order (الترتيب)</label>
                    <Input 
                      type="number"
                      value={skill.order ?? 0} 
                      onChange={e => handleFieldChange(skill.id, 'order', parseInt(e.target.value) || 0)}
                      onBlur={() => handleSaveSkill(skill)}
                      className="h-8 text-xs text-center font-mono font-bold text-emerald-500"
                    />
                  </div>
                </div>

                {/* Hover Tooltip Descriptions EN & AR */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      Hover Tooltip Description (English)
                    </label>
                    <textarea 
                      value={skill.description || ''} 
                      onChange={e => handleFieldChange(skill.id, 'description', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      rows={2}
                      placeholder="Interactive hover description shown when hovering over the skill pill..."
                      className="w-full text-xs p-2.5 rounded-lg bg-background/50 border border-border/60 text-muted-foreground focus:text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      نص نافذة الهوفر التفاعلية (بالعربية - Hover Tooltip)
                    </label>
                    <textarea 
                      value={skill.descriptionAr || ''} 
                      onChange={e => handleFieldChange(skill.id, 'descriptionAr', e.target.value)}
                      onBlur={() => handleSaveSkill(skill)}
                      rows={2}
                      placeholder="نص وصفي يظهر في نافذة الهوفر عند مرور مؤشر الماوس فوق البويضة..."
                      className="w-full text-xs p-2.5 rounded-lg bg-background/50 border border-border/60 text-muted-foreground focus:text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none leading-relaxed"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground">
                    {savingSkillId === skill.id ? (
                      <span className="text-emerald-400 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> جاري حفظ التعديلات...</span>
                    ) : (
                      <span>يتم حفظ الحقول تلقائياً عند مغادرة الحقل أو الضغط على زر الحفظ</span>
                    )}
                  </span>
                  <Button 
                    onClick={() => handleSaveSkill(skill)}
                    disabled={savingSkillId === skill.id}
                    size="sm"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-4 font-semibold shadow-sm cursor-pointer"
                  >
                    {savingSkillId === skill.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    حفظ المهارة (Save)
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;
