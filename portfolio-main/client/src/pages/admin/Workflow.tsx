import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Edit2, Check, ArrowUp, ArrowDown, 
  Eye, EyeOff, Loader2, RefreshCw, Pin, Sparkles 
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface WorkflowStep {
  id: string;
  num: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  pinColor: string;
  tilt: number;
  side: 'left' | 'right';
  paperBg: string;
  paperEdge: string;
  order: number;
  isEnabled: boolean;
}

const COLOR_PRESETS = [
  { name: 'Warm Orange', pin: '#E8732A', bg: '#FFF8DC', edge: '#F5E6B8' },
  { name: 'Ocean Blue', pin: '#3B7DD8', bg: '#E8F0FE', edge: '#C5D9F1' },
  { name: 'Royal Purple', pin: '#9333EA', bg: '#F3EAFF', edge: '#DCC8F5' },
  { name: 'Emerald Green', pin: '#0D9668', bg: '#E6FAF0', edge: '#B8EDDA' },
  { name: 'Crimson Red', pin: '#DC2626', bg: '#FFF0F0', edge: '#FCCFCF' },
  { name: 'Amber Gold', pin: '#F59E0B', bg: '#FEF9C3', edge: '#FDE047' },
  { name: 'Rose Pink', pin: '#EC4899', bg: '#FDF2F8', edge: '#FBCFE8' },
  { name: 'Cyan Teal', pin: '#06B6D4', bg: '#ECFEFF', edge: '#A5F3FC' },
];

const AdminWorkflow = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [sectionSettings, setSectionSettings] = useState({
    workflowBadge: 'Workflow & Methodology',
    workflowBadgeAr: 'المنهجية ومراحل العمل',
    workflowTitle: 'How I Engineer Digital Products',
    workflowTitleAr: 'كيف أهندس وأبني المنتجات الرقمية',
    workflowSubtitle: 'A structured, end-to-end development process ensuring total reliability and business alignment.',
    workflowSubtitleAr: 'منهجية تطوير وتصميم هندسية متكاملة تضمن أعلى معايير الجودة والأداء.',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    num: '01',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    pinColor: '#E8732A',
    tilt: -2.5,
    side: 'left' as 'left' | 'right',
    paperBg: '#FFF8DC',
    paperEdge: '#F5E6B8',
    isEnabled: true,
  });

  useEffect(() => {
    fetchWorkflow();
    api.get('/settings').then(res => {
      if (res.data?.data) {
        const d = res.data.data;
        setSectionSettings(prev => ({
          workflowBadge: d.workflowBadge || prev.workflowBadge,
          workflowBadgeAr: d.workflowBadgeAr || prev.workflowBadgeAr,
          workflowTitle: d.workflowTitle || prev.workflowTitle,
          workflowTitleAr: d.workflowTitleAr || prev.workflowTitleAr,
          workflowSubtitle: d.workflowSubtitle || prev.workflowSubtitle,
          workflowSubtitleAr: d.workflowSubtitleAr || prev.workflowSubtitleAr,
        }));
      }
    }).catch(() => {});
  }, []);

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      showToast("Workflow section headings updated successfully!");
    } catch {
      showToast("Failed to update section headings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchWorkflow = async () => {
    try {
      setLoading(true);
      const res = await api.get('/workflow');
      setSteps(res.data?.data || []);
    } catch {
      showToast('Failed to fetch workflow steps', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreateModal = () => {
    setEditingStep(null);
    const nextNum = String(steps.length + 1).padStart(2, '0');
    const preset = COLOR_PRESETS[steps.length % COLOR_PRESETS.length];
    setFormData({
      num: nextNum,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      pinColor: preset.pin,
      tilt: steps.length % 2 === 0 ? -2.5 : 2.5,
      side: steps.length % 2 === 0 ? 'left' : 'right',
      paperBg: preset.bg,
      paperEdge: preset.edge,
      isEnabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (step: WorkflowStep) => {
    setEditingStep(step);
    setFormData({
      num: step.num,
      title: step.title,
      titleAr: step.titleAr || '',
      description: step.description,
      descriptionAr: step.descriptionAr || '',
      pinColor: step.pinColor,
      tilt: step.tilt,
      side: step.side,
      paperBg: step.paperBg,
      paperEdge: step.paperEdge,
      isEnabled: step.isEnabled,
    });
    setIsModalOpen(true);
  };

  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Title and description are required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingStep) {
        const res = await api.put(`/workflow/${editingStep.id}`, formData);
        setSteps(steps.map(s => s.id === editingStep.id ? res.data.data : s));
        showToast('Step updated successfully');
      } else {
        const res = await api.post('/workflow', {
          ...formData,
          order: steps.length,
        });
        setSteps([...steps, res.data.data]);
        showToast('Step created successfully');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Failed to save workflow step', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (step: WorkflowStep) => {
    try {
      const updated = { ...step, isEnabled: !step.isEnabled };
      await api.put(`/workflow/${step.id}`, { isEnabled: updated.isEnabled });
      setSteps(steps.map(s => s.id === step.id ? updated : s));
      showToast(`Step #${step.num} ${updated.isEnabled ? 'enabled' : 'disabled'}`);
    } catch {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow step?')) return;
    try {
      await api.delete(`/workflow/${id}`);
      setSteps(steps.filter(s => s.id !== id));
      showToast('Step deleted');
    } catch {
      showToast('Failed to delete step', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    setSteps(newSteps);

    try {
      await api.put('/workflow/reorder', {
        items: newSteps.map((step, idx) => ({ id: step.id, order: idx })),
      });
      showToast('Order updated');
    } catch {
      showToast('Failed to save reorder', 'error');
      fetchWorkflow();
    }
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setFormData({
      ...formData,
      pinColor: preset.pin,
      paperBg: preset.bg,
      paperEdge: preset.edge,
    });
  };

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>Workflow & Methodology | Admin</title></Helmet>

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
          <h1 className="text-3xl font-bold tracking-tight">Engineering Workflow Steps</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the sticky-note steps, 3D pushpin colors, card tilt angles, and zigzag flow.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchWorkflow} disabled={loading}>
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-1.5" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Section Headings & Paragraphs Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              Workflow Section Headings &amp; Copywriting
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit the badge, main title, and subtitle shown at the top of the workflow section on the public site.
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
              value={sectionSettings.workflowBadge} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowBadge: e.target.value })}
              placeholder="Workflow & Methodology"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">شارة القسم (عربي)</label>
            <Input 
              value={sectionSettings.workflowBadgeAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowBadgeAr: e.target.value })}
              placeholder="المنهجية ومراحل العمل"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Heading (EN)</label>
            <Input 
              value={sectionSettings.workflowTitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowTitle: e.target.value })}
              placeholder="How I Engineer Digital Products"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (عربي)</label>
            <Input 
              value={sectionSettings.workflowTitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowTitleAr: e.target.value })}
              placeholder="كيف أهندس وأبني المنتجات الرقمية"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Subtitle / Description (EN)</label>
            <Input 
              value={sectionSettings.workflowSubtitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowSubtitle: e.target.value })}
              placeholder="A structured, end-to-end development process ensuring total reliability and business alignment."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف التوضيحي (عربي)</label>
            <Input 
              value={sectionSettings.workflowSubtitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, workflowSubtitleAr: e.target.value })}
              placeholder="منهجية تطوير وتصميم هندسية متكاملة تضمن أعلى معايير الجودة والأداء."
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : steps.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card/40">
          <Pin className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">No steps found</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Add steps to display your engineering methodology on the public site.
          </p>
          <Button onClick={openCreateModal}>
            <Plus size={14} className="mr-1.5" /> Add First Step
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div 
              key={step.id} 
              className={`p-5 rounded-xl border bg-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                step.isEnabled ? 'border-border' : 'border-border/40 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === steps.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Pin Color & Step Badge */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-sm shadow-sm"
                  style={{ 
                    background: `${step.pinColor}18`, 
                    color: step.pinColor, 
                    border: `2px solid ${step.pinColor}40` 
                  }}
                >
                  {step.num}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-foreground">{step.title}</h3>
                    {step.titleAr && (
                      <span className="text-sm font-semibold text-emerald-400 font-arabic" dir="rtl">
                        ({step.titleAr})
                      </span>
                    )}
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold"
                      style={{ background: step.paperBg, color: '#1a1a2e', border: `1px solid ${step.paperEdge}` }}
                    >
                      Side: {step.side} | Tilt: {step.tilt}°
                    </span>
                    {!step.isEnabled && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {step.description}
                  </p>
                  {step.descriptionAr && (
                    <p className="text-xs text-muted-foreground/80 line-clamp-1 max-w-2xl font-arabic" dir="rtl">
                      {step.descriptionAr}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleToggleActive(step)}
                  title={step.isEnabled ? 'Disable step' : 'Enable step'}
                >
                  {step.isEnabled ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-muted-foreground" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditModal(step)}
                >
                  <Edit2 size={14} className="mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(step.id)}
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
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {editingStep ? `Edit Step #${editingStep.num}` : 'Create Workflow Step'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Step #</label>
                  <Input 
                    value={formData.num} 
                    onChange={e => setFormData({ ...formData, num: e.target.value })} 
                    placeholder="01"
                    maxLength={4}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Step Title (EN)</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="e.g. Requirement Discovery"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">عنوان الخطوة (بالعربي)</label>
                <Input 
                  value={formData.titleAr} 
                  onChange={e => setFormData({ ...formData, titleAr: e.target.value })} 
                  placeholder="مثال: تحليل واستكشاف المتطلبات"
                  dir="rtl"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Description (EN)</label>
                  <Textarea 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Detailed breakdown in English..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">تفاصيل ومحتوى الخطوة (بالعربي)</label>
                  <Textarea 
                    value={formData.descriptionAr} 
                    onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} 
                    placeholder="شرح وتفاصيل المرحلة بالعربية..."
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Color Presets</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                        formData.pinColor === preset.pin ? 'ring-2 ring-primary border-transparent' : 'border-border hover:bg-muted'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ background: preset.pin }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Custom Styling */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Pin Color</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={formData.pinColor} 
                      onChange={e => setFormData({ ...formData, pinColor: e.target.value })}
                      className="w-8 h-8 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{formData.pinColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Side Position</label>
                  <select
                    value={formData.side}
                    onChange={e => setFormData({ ...formData, side: e.target.value as 'left' | 'right' })}
                    className="w-full h-8 px-2 text-xs rounded border border-input bg-background"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Tilt Angle (°)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={formData.tilt} 
                    onChange={e => setFormData({ ...formData, tilt: parseFloat(e.target.value) || 0 })}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Paper Tint</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="color" 
                      value={formData.paperBg} 
                      onChange={e => setFormData({ ...formData, paperBg: e.target.value })}
                      className="w-8 h-8 rounded border cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{formData.paperBg}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <SaveIcon />}
                  {editingStep ? 'Update Step' : 'Create Step'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SaveIcon = () => <Pin size={16} className="mr-1.5" />;

export default AdminWorkflow;
