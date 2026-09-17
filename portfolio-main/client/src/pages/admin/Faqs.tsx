import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Edit2, Check, Search, 
  HelpCircle, Eye, EyeOff, Loader2, RefreshCw, MessageCircleQuestion
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface FaqItem {
  id: string;
  question: string;
  questionAr?: string | null;
  answer: string;
  answerAr?: string | null;
  category: string;
  categoryAr?: string | null;
  order: number;
  isEnabled: boolean;
}

const CATEGORY_MAP: Record<string, string> = {
  services: 'Services & Scope',
  process: 'Process & Timeline',
  tech: 'Tech Stack',
  collab: 'Working Together',
};

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [sectionSettings, setSectionSettings] = useState({
    faqBadge: 'Got a question?',
    faqBadgeAr: 'لديك استفسار؟',
    faqTitle: 'Common Questions.',
    faqTitleAr: 'الأسئلة الشائعة.',
    faqSubtitle: 'Answers to frequent questions about collaboration, delivery, and technology.',
    faqSubtitleAr: 'إجابات وافية ومباشرة حول كيفية التعاون، مراحل التسليم، والتقنيات المستخدمة.',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    question: '',
    questionAr: '',
    answer: '',
    answerAr: '',
    category: 'services',
    customCategory: '',
    isEnabled: true,
  });

  useEffect(() => {
    fetchFaqs();
    api.get('/settings').then(res => {
      if (res.data?.data) {
        const d = res.data.data;
        setSectionSettings(prev => ({
          faqBadge: d.faqBadge || prev.faqBadge,
          faqBadgeAr: d.faqBadgeAr || prev.faqBadgeAr,
          faqTitle: d.faqTitle || prev.faqTitle,
          faqTitleAr: d.faqTitleAr || prev.faqTitleAr,
          faqSubtitle: d.faqSubtitle || prev.faqSubtitle,
          faqSubtitleAr: d.faqSubtitleAr || prev.faqSubtitleAr,
        }));
      }
    }).catch(() => {});
  }, []);

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      showToast("FAQ section headings updated successfully!");
    } catch {
      showToast("Failed to update FAQ headings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faqs');
      setFaqs(res.data?.data || []);
    } catch {
      showToast('Failed to fetch FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      questionAr: '',
      answer: '',
      answerAr: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'services',
      customCategory: '',
      isEnabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    const isStandard = Object.keys(CATEGORY_MAP).includes(faq.category);
    setFormData({
      question: faq.question,
      questionAr: faq.questionAr || '',
      answer: faq.answer,
      answerAr: faq.answerAr || '',
      category: isStandard ? faq.category : 'other',
      customCategory: isStandard ? '' : faq.category,
      isEnabled: faq.isEnabled,
    });
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    const finalCategory = formData.category === 'other'
      ? (formData.customCategory.trim() || 'general')
      : formData.category;

    try {
      setSaving(true);
      const payload = {
        question: formData.question.trim(),
        questionAr: formData.questionAr.trim() || null,
        answer: formData.answer.trim(),
        answerAr: formData.answerAr.trim() || null,
        category: finalCategory,
        isEnabled: formData.isEnabled,
      };

      if (editingFaq) {
        const res = await api.put(`/faqs/${editingFaq.id}`, payload);
        setFaqs(faqs.map(f => f.id === editingFaq.id ? res.data.data : f));
        showToast('FAQ updated successfully');
      } else {
        const res = await api.post('/faqs', {
          ...payload,
          order: faqs.length,
        });
        setFaqs([...faqs, res.data.data]);
        showToast('FAQ created successfully');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Failed to save FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (faq: FaqItem) => {
    try {
      const updated = { ...faq, isEnabled: !faq.isEnabled };
      await api.put(`/faqs/${faq.id}`, { isEnabled: updated.isEnabled });
      setFaqs(faqs.map(f => f.id === faq.id ? updated : f));
      showToast(`FAQ ${updated.isEnabled ? 'activated' : 'hidden'}`);
    } catch {
      showToast('Failed to toggle active state', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter(f => f.id !== id));
      showToast('FAQ deleted');
    } catch {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  // Get distinct categories
  const allCategories = Array.from(new Set(faqs.map(f => f.category)));

  // Filtered FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>FAQs Management | Admin</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Questions &amp; Answers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage questions, answers, and categories displayed in the interactive FAQ tabs on your site.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchFaqs} disabled={loading}>
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-1.5" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Section Headings Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageCircleQuestion size={18} className="text-emerald-400" />
              FAQ Section Headings &amp; Subtitle
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit the badge, main heading, and subtitle shown at the top of the FAQ section on the public site.
            </p>
          </div>
          <Button 
            onClick={handleSaveSectionSettings} 
            disabled={savingSettings}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 shrink-0"
          >
            {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save Section Text
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Badge Text (EN)</label>
            <Input 
              value={sectionSettings.faqBadge} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqBadge: e.target.value })}
              placeholder="Got a question?"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">شارة القسم (عربي)</label>
            <Input 
              value={sectionSettings.faqBadgeAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqBadgeAr: e.target.value })}
              placeholder="لديك استفسار؟"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Heading (EN)</label>
            <Input 
              value={sectionSettings.faqTitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqTitle: e.target.value })}
              placeholder="Common Questions."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (عربي)</label>
            <Input 
              value={sectionSettings.faqTitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqTitleAr: e.target.value })}
              placeholder="الأسئلة الشائعة."
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Subtitle / Description (EN)</label>
            <Input 
              value={sectionSettings.faqSubtitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqSubtitle: e.target.value })}
              placeholder="Answers to frequent questions about collaboration, delivery, and technology."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف التوضيحي (عربي)</label>
            <Input 
              value={sectionSettings.faqSubtitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, faqSubtitleAr: e.target.value })}
              placeholder="إجابات وافية ومباشرة حول كيفية التعاون، مراحل التسليم، والتقنيات المستخدمة."
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-foreground text-background font-bold'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({faqs.length})
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-foreground text-background font-bold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {CATEGORY_MAP[cat] || cat} ({faqs.filter(f => f.category === cat).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card/40">
          <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">No questions found</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            {searchQuery ? 'Try changing your search keyword' : 'Add common questions to help prospective clients'}
          </p>
          <Button onClick={openCreateModal}>
            <Plus size={14} className="mr-1.5" /> Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`p-5 rounded-xl border bg-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                faq.isEnabled ? 'border-border' : 'border-border/40 opacity-60'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                    {CATEGORY_MAP[faq.category] || faq.category}
                  </span>
                  {!faq.isEnabled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-foreground leading-snug">{faq.question}</h3>
                {faq.questionAr && (
                  <h4 className="text-sm font-semibold text-emerald-400 leading-snug font-arabic" dir="rtl">
                    {faq.questionAr}
                  </h4>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 max-w-3xl">
                  {faq.answer}
                </p>
                {faq.answerAr && (
                  <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-1 max-w-3xl font-arabic" dir="rtl">
                    {faq.answerAr}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleActive(faq)}
                  title={faq.isEnabled ? 'Hide FAQ' : 'Show FAQ'}
                >
                  {faq.isEnabled ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-muted-foreground" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(faq)}
                >
                  <Edit2 size={14} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(faq.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageCircleQuestion className="w-5 h-5 text-primary" />
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="services">Services &amp; Scope (الخدمات والنطاق)</option>
                  <option value="process">Process &amp; Timeline (منهجية العمل والوقت)</option>
                  <option value="tech">Tech Stack (التقنيات والتطوير)</option>
                  <option value="collab">Working Together (التعاون والتواصل)</option>
                  <option value="other">Custom Category...</option>
                </select>
              </div>

              {formData.category === 'other' && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Custom Category Name</label>
                  <Input
                    value={formData.customCategory}
                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                    placeholder="e.g. pricing, deployment..."
                    required
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Question (EN)</label>
                  <Input
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                    placeholder="e.g. What types of projects do you take on?"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">السؤال (بالعربي)</label>
                  <Input
                    value={formData.questionAr}
                    onChange={e => setFormData({ ...formData, questionAr: e.target.value })}
                    placeholder="مثال: ما هي نوعية المشاريع التي تنفذها؟"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Answer (EN)</label>
                  <Textarea
                    value={formData.answer}
                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Provide a clear, detailed, and reassuring response..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">الإجابة والتوضيح (بالعربي)</label>
                  <Textarea
                    value={formData.answerAr}
                    onChange={e => setFormData({ ...formData, answerAr: e.target.value })}
                    placeholder="اكتب إجابة دقيقة وواضحة بالعربية..."
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Check size={16} className="mr-1.5" />}
                  {editingFaq ? 'Save Changes' : 'Create FAQ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaqs;
