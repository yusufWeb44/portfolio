import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Loader2, Check, Save } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { getServiceIcon } from '../../components/ui/services-card';

interface Service {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  isEnabled: boolean;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [sectionSettings, setSectionSettings] = useState({
    servicesBadge: 'Consulting & Offerings',
    servicesBadgeAr: 'الخدمات والاستشارات التقنية',
    servicesTitle: 'Services.',
    servicesTitleAr: 'الخدمات البرمجية.',
    servicesSubtitle: 'End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.',
    servicesSubtitleAr: 'خدمات برمجية وهندسية متكاملة مصممة لمساعدتك على الإطلاق بسرعة، وتوسيع نطاق أعمالك بكفاءة.',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchServices();
    api.get('/settings').then(res => {
      if (res.data?.data) {
        const d = res.data.data;
        setSectionSettings(prev => ({
          servicesBadge: d.servicesBadge || prev.servicesBadge,
          servicesBadgeAr: d.servicesBadgeAr || prev.servicesBadgeAr,
          servicesTitle: d.servicesTitle || prev.servicesTitle,
          servicesTitleAr: d.servicesTitleAr || prev.servicesTitleAr,
          servicesSubtitle: d.servicesSubtitle || prev.servicesSubtitle,
          servicesSubtitleAr: d.servicesSubtitleAr || prev.servicesSubtitleAr,
        }));
      }
    }).catch(() => {});
  }, []);

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      showToast("Services section headings updated successfully!");
    } catch {
      showToast("Failed to update services headings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.data || []);
    } catch {
      showToast("Failed to fetch services", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async () => {
    try {
      const newService = { 
        title: 'Full-Stack Web Development', 
        description: 'Custom scalable web applications built with modern frontend frameworks and robust backend architectures.', 
        isEnabled: true 
      };
      const res = await api.post('/services', newService);
      setServices([...services, res.data.data]);
      showToast("Service added successfully");
    } catch (error) {
      showToast("Failed to add service", "error");
    }
  };

  const handleFieldChange = (id: string, field: keyof Service, value: any) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveService = async (service: Service) => {
    setSavingId(service.id);
    try {
      await api.put(`/services/${service.id}`, service);
      showToast("Service saved successfully");
    } catch (error) {
      showToast("Failed to save service", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
      showToast("Service removed");
    } catch (error) {
      showToast("Failed to remove service", "error");
    }
  };

  return (
    <div className="relative min-h-[80vh] pb-16">
      <Helmet><title>Services | Admin</title></Helmet>

      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services &amp; Offerings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Control the services displayed in the horizontal interactive carousel on your portfolio.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
          <Plus size={16} /> Add Service
        </Button>
      </div>

      {/* Section Headings Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Services Section Headings &amp; Subtitle
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Edit the badge, main heading, and subtitle shown at the top of the Services section.
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
              value={sectionSettings.servicesBadge} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesBadge: e.target.value })}
              placeholder="Consulting & Offerings"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">شارة القسم (عربي)</label>
            <Input 
              value={sectionSettings.servicesBadgeAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesBadgeAr: e.target.value })}
              placeholder="الخدمات والاستشارات التقنية"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Heading (EN)</label>
            <Input 
              value={sectionSettings.servicesTitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesTitle: e.target.value })}
              placeholder="Services."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (عربي)</label>
            <Input 
              value={sectionSettings.servicesTitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesTitleAr: e.target.value })}
              placeholder="الخدمات البرمجية."
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Subtitle / Description (EN)</label>
            <Input 
              value={sectionSettings.servicesSubtitle} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesSubtitle: e.target.value })}
              placeholder="End-to-end software development services tailored to help you launch faster..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف التوضيحي (عربي)</label>
            <Input 
              value={sectionSettings.servicesSubtitleAr} 
              onChange={e => setSectionSettings({ ...sectionSettings, servicesSubtitleAr: e.target.value })}
              placeholder="خدمات برمجية وهندسية متكاملة مصممة لمساعدتك على الإطلاق بسرعة..."
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6">
          {services.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center text-muted-foreground">
              <p className="text-base font-semibold mb-2">No services added yet</p>
              <p className="text-sm mb-4">Add your first service to show in the carousel.</p>
              <Button onClick={handleAdd} variant="outline" className="gap-2">
                <Plus size={15} /> Add First Service
              </Button>
            </div>
          ) : (
            services.map((service, index) => {
              const IconComp = getServiceIcon(service.title);
              const isSaving = savingId === service.id;

              return (
                <div 
                  key={service.id} 
                  className="bg-card border border-border rounded-2xl p-6 relative group transition-all duration-200 hover:border-emerald-500/40 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    
                    {/* Icon Preview Box */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
                        <IconComp size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                            Service #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${service.isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                            {service.isEnabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Icon automatically selected based on service title
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors ml-auto"
                      title="Delete service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4 mt-6 pt-4 border-t border-border/50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          Service Title (English)
                        </label>
                        <Input 
                          value={service.title} 
                          onChange={e => handleFieldChange(service.id, 'title', e.target.value)}
                          placeholder="e.g. Full-Stack Web Development"
                          className="font-bold text-base"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          عنوان الخدمة (بالعربية)
                        </label>
                        <Input 
                          value={service.titleAr || ''} 
                          onChange={e => handleFieldChange(service.id, 'titleAr', e.target.value)}
                          placeholder="مثال: تطوير تطبيقات الويب المتكاملة"
                          className="font-bold text-base"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          Description (English)
                        </label>
                        <Textarea 
                          value={service.description} 
                          onChange={e => handleFieldChange(service.id, 'description', e.target.value)}
                          placeholder="Brief summary of this service..."
                          className="min-h-[80px] text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          شرح وتفاصيل الخدمة (بالعربية)
                        </label>
                        <Textarea 
                          value={service.descriptionAr || ''} 
                          onChange={e => handleFieldChange(service.id, 'descriptionAr', e.target.value)}
                          placeholder="وصف وشرح تفصيلي للخدمة بالعربية..."
                          className="min-h-[80px] text-sm"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={service.isEnabled}
                          onChange={e => handleFieldChange(service.id, 'isEnabled', e.target.checked)}
                          className="rounded border-border text-foreground focus:ring-foreground accent-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        <span>Show on portfolio (تفعيل الخدمة)</span>
                      </label>

                      <Button 
                        onClick={() => handleSaveService(service)}
                        disabled={isSaving}
                        className="gap-2 text-xs h-9 px-4"
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
