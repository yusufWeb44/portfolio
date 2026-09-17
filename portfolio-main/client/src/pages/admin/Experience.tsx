import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Check, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Calendar, 
  BarChart3, 
  Rocket, 
  Code, 
  Award, 
  Building2, 
  Laptop,
  Cloud,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Users,
  Sparkles,
  Upload,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface ExperienceItem {
  id: string;
  company: string;
  companyAr?: string | null;
  position: string;
  positionAr?: string | null;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  locationAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  type?: string;
  icon?: string | null;
  color?: string | null;
  order?: number;
}

interface CertificateItem {
  id: string;
  title: string;
  titleAr?: string | null;
  issuer: string;
  issuerAr?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  icon?: string | null;
  skills?: string | null;
  skillsAr?: string | null;
  order?: number;
}

const AVAILABLE_ICONS = [
  { id: 'graduation-cap', label: 'University / Education', icon: <GraduationCap size={16} /> },
  { id: 'briefcase', label: 'Work / Career', icon: <Briefcase size={16} /> },
  { id: 'search', label: 'Research / Intern', icon: <Search size={16} /> },
  { id: 'calendar', label: 'Calendar / Period', icon: <Calendar size={16} /> },
  { id: 'chart', label: 'Growth / Analytics', icon: <BarChart3 size={16} /> },
  { id: 'code', label: 'Developer / Code', icon: <Code size={16} /> },
  { id: 'rocket', label: 'Launch / Innovation', icon: <Rocket size={16} /> },
  { id: 'award', label: 'Achievement / Award', icon: <Award size={16} /> },
  { id: 'build', label: 'Enterprise / Office', icon: <Building2 size={16} /> },
  { id: 'cloud', label: 'Cloud / Architecture', icon: <Cloud size={16} /> },
  { id: 'laptop', label: 'Hardware / Workstation', icon: <Laptop size={16} /> },
];

const AVAILABLE_COLORS = [
  { id: 'amber', label: 'Amber (Orange)', class: 'bg-amber-500 border-amber-400' },
  { id: 'coral', label: 'Coral (Rose)', class: 'bg-rose-500 border-rose-400' },
  { id: 'teal', label: 'Teal (Cyan)', class: 'bg-teal-500 border-teal-400' },
  { id: 'blue', label: 'Blue (Sky)', class: 'bg-blue-500 border-blue-400' },
  { id: 'purple', label: 'Purple (Violet)', class: 'bg-purple-500 border-purple-400' },
  { id: 'emerald', label: 'Emerald (Green)', class: 'bg-emerald-500 border-emerald-400' },
];

const CERT_ICONS = [
  { id: 'cloud', label: 'Cloud (AWS/GCP)', icon: <Cloud size={16} /> },
  { id: 'code', label: 'Code (React/Frontend)', icon: <Code size={16} /> },
  { id: 'terminal', label: 'Terminal (Backend/Dev)', icon: <Terminal size={16} /> },
  { id: 'award', label: 'Certificate / Award', icon: <Award size={16} /> },
  { id: 'users', label: 'Management / Agile', icon: <Users size={16} /> },
  { id: 'shield', label: 'Security / Compliance', icon: <ShieldCheck size={16} /> },
];


const AdminExperience = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'certificates'>('timeline');
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCertId, setUploadingCertId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, certRes] = await Promise.all([
        api.get('/experience'),
        api.get('/certificates')
      ]);
      setExperiences(expRes.data.data || []);
      setCertificates(certRes.data.data || []);
    } catch (error) {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ════════════════════════════════════════════════════════════════════
  // Experience Timeline Handlers
  // ════════════════════════════════════════════════════════════════════
  const handleAddExperience = async (presetType: 'education' | 'work' | 'milestone' = 'work') => {
    try {
      const nextOrder = experiences.length > 0 
        ? Math.max(...experiences.map(e => e.order || 0)) + 1 
        : 1;

      const payload = presetType === 'education' ? {
        position: 'B.Sc. in Computer Science',
        positionAr: 'بكالوريوس في علوم الحاسوب وهندسة البرمجيات',
        company: 'University Faculty of Engineering',
        companyAr: 'كلية الهندسة وتكنولوجيا المعلومات',
        startDate: '2016',
        endDate: '2020',
        location: 'Campus',
        locationAr: 'الحرم الجامعي',
        type: 'education',
        icon: 'graduation-cap',
        color: 'amber',
        order: nextOrder,
        description: 'Undergraduate academic study focusing on foundational computer science, data structures, algorithms, and software design.',
        descriptionAr: 'دراسة أكاديمية متخصصة تركز على أسس علوم الحاسوب، هياكل البيانات، الخوارزميات، وتصميم البرمجيات المتقدمة.'
      } : presetType === 'milestone' ? {
        position: 'Major Technical Milestone',
        positionAr: 'محطة وإنجاز تقني بارز',
        company: 'Global Community / Tech Organization',
        companyAr: 'المجتمع التقني العالمي / منظمة تكنولوجية',
        startDate: '2022',
        endDate: '2022',
        location: 'International',
        locationAr: 'دولي',
        type: 'milestone',
        icon: 'rocket',
        color: 'purple',
        order: nextOrder,
        description: 'Key career milestone or independent initiative.',
        descriptionAr: 'محطة هامة في المسيرة المهنية ومبادرة تقنية مستقلة أحدثت تأثيراً إيجابياً.'
      } : {
        position: 'Full Stack Software Engineer',
        positionAr: 'مهندس برمجيات وتطبيقات متكاملة (Full Stack)',
        company: 'Technology Solutions Inc.',
        companyAr: 'حلول التكنولوجيا المتطورة',
        startDate: '2023',
        endDate: 'Present',
        location: 'Remote',
        locationAr: 'عن بُعد',
        type: 'work',
        icon: 'briefcase',
        color: 'blue',
        order: nextOrder,
        description: 'Architecting and maintaining cloud applications, design systems, and resilient services.',
        descriptionAr: 'هندسة وبناء تطبيقات سحابية متطورة، وتصميم أنظمة واجهات متكاملة وخدمات عالية التوافر.'
      };

      const res = await api.post('/experience', payload);
      setExperiences([...experiences, res.data.data]);
      showToast("New timeline milestone added");
    } catch (error) {
      showToast("Failed to add experience", "error");
    }
  };

  const handleUpdateExperience = async (id: string, field: string, value: any) => {
    const exp = experiences.find(e => e.id === id);
    if (!exp) return;
    const updated = { ...exp, [field]: value };
    setExperiences(experiences.map(e => e.id === id ? updated : e));

    try {
      await api.put(`/experience/${id}`, updated);
    } catch (error) {
      // Handled silently
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this timeline milestone?")) return;
    try {
      await api.delete(`/experience/${id}`);
      setExperiences(experiences.filter(e => e.id !== id));
      showToast("Timeline milestone deleted");
    } catch (error) {
      showToast("Failed to delete milestone", "error");
    }
  };

  const handleMoveExperience = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const currentItem = experiences[index];
    const targetItem = experiences[targetIndex];

    const currentOrder = currentItem.order ?? index + 1;
    const targetOrder = targetItem.order ?? targetIndex + 1;

    const newExperiences = [...experiences];
    newExperiences[index] = { ...targetItem, order: currentOrder };
    newExperiences[targetIndex] = { ...currentItem, order: targetOrder };

    setExperiences(newExperiences);

    try {
      await Promise.all([
        api.put(`/experience/${currentItem.id}`, { order: targetOrder }),
        api.put(`/experience/${targetItem.id}`, { order: currentOrder })
      ]);
      showToast("Order updated");
    } catch (error) {
      showToast("Failed to update order", "error");
      fetchData();
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // Certificates Handlers
  // ════════════════════════════════════════════════════════════════════
  const handleAddCertificate = async () => {
    try {
      const nextOrder = certificates.length > 0 
        ? Math.max(...certificates.map(c => c.order || 0)) + 1 
        : 1;

      const payload = {
        title: 'New Industry Certificate',
        titleAr: 'شهادة مهنية وتقنية معتمدة',
        issuer: 'Issuing Organization (e.g. AWS, Meta, Google)',
        issuerAr: 'الجهة المانحة (مثل أمازون، ميتا، جوجل)',
        issueDate: '2024',
        credentialUrl: 'https://example.com/verify',
        credentialId: 'CERT-10029',
        icon: 'award',
        skills: 'Cloud, React, Architecture',
        skillsAr: 'حوسبة سحابية، رياكت، هندسة النظم',
        order: nextOrder
      };

      const res = await api.post('/certificates', payload);
      setCertificates([...certificates, res.data.data]);
      showToast("New certificate card added");
    } catch (error) {
      showToast("Failed to add certificate", "error");
    }
  };

  const handleUpdateCertificate = async (id: string, field: string, value: any) => {
    const cert = certificates.find(c => c.id === id);
    if (!cert) return;
    const updated = { ...cert, [field]: value };
    setCertificates(certificates.map(c => c.id === id ? updated : c));

    try {
      await api.put(`/certificates/${id}`, updated);
    } catch (error) {
      // Handled silently
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await api.delete(`/certificates/${id}`);
      setCertificates(certificates.filter(c => c.id !== id));
      showToast("Certificate deleted");
    } catch (error) {
      showToast("Failed to delete certificate", "error");
    }
  };

  const handleMoveCertificate = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;

    const currentItem = certificates[index];
    const targetItem = certificates[targetIndex];

    const currentOrder = currentItem.order ?? index + 1;
    const targetOrder = targetItem.order ?? targetIndex + 1;

    const newCerts = [...certificates];
    newCerts[index] = { ...targetItem, order: currentOrder };
    newCerts[targetIndex] = { ...currentItem, order: targetOrder };

    setCertificates(newCerts);

    try {
      await Promise.all([
        api.put(`/certificates/${currentItem.id}`, { order: targetOrder }),
        api.put(`/certificates/${targetItem.id}`, { order: currentOrder })
      ]);
      showToast("Order updated");
    } catch (error) {
      showToast("Failed to update order", "error");
      fetchData();
    }
  };

  const handleUploadCertificateFile = async (certId: string, file: File) => {
    try {
      setUploadingCertId(certId);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.url) {
        await handleUpdateCertificate(certId, 'credentialUrl', res.data.url);
        showToast("Certificate file uploaded successfully!");
      } else {
        showToast("Upload failed", "error");
      }
    } catch (error) {
      showToast("Failed to upload file (PDF / Images allowed up to 20MB)", "error");
    } finally {
      setUploadingCertId(null);
    }
  };

  return (
    <div className="relative min-h-[85vh] pb-16">
      <Helmet><title>Experience & Certifications | Admin</title></Helmet>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            Experience & Credentials
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your interactive vertical timeline and horizontal certifications carousel.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase size={15} />
            Career &amp; Education
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award size={16} />
            <span>Certificates ({certificates.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-72 gap-3">
          <Loader2 className="animate-spin w-8 h-8 text-amber-500" />
          <p className="text-xs font-mono text-muted-foreground">Loading experience data...</p>
        </div>
      ) : activeTab === 'timeline' ? (
        /* ══════════════════════════════════════════════════════════════
           TAB 1: TIMELINE MILESTONES (University & Career)
        ══════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Quick Add Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card/60 backdrop-blur-md rounded-2xl border border-border/80">
            <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
              Add New Timeline Milestone
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddExperience('education')}
                className="gap-1.5 text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <GraduationCap size={15} /> + University / Education
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddExperience('work')}
                className="gap-1.5 text-xs border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
              >
                <Briefcase size={15} /> + Career Role
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddExperience('milestone')}
                className="gap-1.5 text-xs border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
              >
                <Sparkles size={15} /> + Milestone
              </Button>
            </div>
          </div>

          {experiences.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
              <GraduationCap size={40} className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-semibold text-base">No timeline milestones yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start by adding your university degree or career milestones.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, index) => {
                const isFirst = index === 0;
                const isLast = index === experiences.length - 1;

                return (
                  <div 
                    key={exp.id} 
                    className="bg-card/70 dark:bg-white/[0.02] backdrop-blur-xl border border-border/80 rounded-2xl p-6 transition-all duration-200 hover:border-border hover:shadow-md relative group"
                  >
                    {/* Header Row: Index number, Category Badge, Reorder & Delete */}
                    <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center font-mono font-bold text-xs text-muted-foreground">
                          #{index + 1}
                        </span>

                        {/* Category/Type Selector Pill */}
                        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
                          <button
                            type="button"
                            onClick={() => handleUpdateExperience(exp.id, 'type', 'education')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              exp.type === 'education'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <GraduationCap size={13} /> University / Education
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateExperience(exp.id, 'type', 'work')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              exp.type === 'work' || !exp.type
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Briefcase size={13} /> Work
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateExperience(exp.id, 'type', 'milestone')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                              exp.type === 'milestone'
                                ? 'bg-purple-500 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Sparkles size={13} /> Milestone
                          </button>
                        </div>
                      </div>

                      {/* Controls: Move Up, Move Down, Delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(index, 'up')}
                          disabled={isFirst}
                          title="Move milestone up"
                          className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveExperience(index, 'down')}
                          disabled={isLast}
                          title="Move milestone down"
                          className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          title="Delete milestone"
                          className="p-1.5 rounded-lg border border-destructive/20 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all ml-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Milestone Form Fields */}
                    <div className="space-y-4">
                      {/* Grid 1: Position/Degree & Institution/Company (EN) */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {exp.type === 'education' ? 'Degree / Field (EN)' : 'Position / Role (EN)'}
                          </label>
                          <Input
                            value={exp.position}
                            onChange={e => handleUpdateExperience(exp.id, 'position', e.target.value)}
                            placeholder={exp.type === 'education' ? 'e.g. B.Sc. in Computer Science' : 'e.g. Senior Software Engineer'}
                            className="font-bold text-base"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {exp.type === 'education' ? 'University / College (EN)' : 'Company / Organization (EN)'}
                          </label>
                          <Input
                            value={exp.company}
                            onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            placeholder={exp.type === 'education' ? 'e.g. University Faculty of Informatics' : 'e.g. Google / Freelance'}
                          />
                        </div>
                      </div>

                      {/* Grid 1-Ar: Position/Degree & Institution/Company (AR) */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {exp.type === 'education' ? 'المؤهل العلمي / التخصص (عربي)' : 'المسمى الوظيفي / الدور (عربي)'}
                          </label>
                          <Input
                            value={exp.positionAr || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'positionAr', e.target.value)}
                            placeholder={exp.type === 'education' ? 'مثال: بكالوريوس في علوم الحاسوب' : 'مثال: مهندس برمجيات أول'}
                            className="font-bold text-base font-arabic"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {exp.type === 'education' ? 'الجامعة / الكلية (عربي)' : 'الشركة / المؤسسة (عربي)'}
                          </label>
                          <Input
                            value={exp.companyAr || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'companyAr', e.target.value)}
                            placeholder={exp.type === 'education' ? 'مثال: كلية الهندسة وتكنولوجيا المعلومات' : 'مثال: شركة الحلول التقنية'}
                            className="font-arabic"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      {/* Grid 2: Dates, Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Start Date
                          </label>
                          <Input
                            value={exp.startDate}
                            onChange={e => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="e.g. 2016"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            End Date
                          </label>
                          <Input
                            value={exp.endDate || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="e.g. 2020 or Present"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Location (EN)
                          </label>
                          <Input
                            value={exp.location || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'location', e.target.value)}
                            placeholder="e.g. Campus / Remote"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            المكان (عربي)
                          </label>
                          <Input
                            value={exp.locationAr || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'locationAr', e.target.value)}
                            placeholder="مثال: عن بُعد / دبي"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      {/* Grid 3: Visual Icon Selector & Color Accent Selector */}
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        {/* Icon Selector */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Circular Badge Icon
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {AVAILABLE_ICONS.map(ic => {
                              const isSelected = (exp.icon || 'briefcase').toLowerCase() === ic.id;
                              return (
                                <button
                                  key={ic.id}
                                  type="button"
                                  onClick={() => handleUpdateExperience(exp.id, 'icon', ic.id)}
                                  title={ic.label}
                                  className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-all ${
                                    isSelected
                                      ? 'bg-foreground text-background border-foreground shadow-sm'
                                      : 'bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {ic.icon}
                                  <span className="hidden lg:inline">{ic.id}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Color Theme Selector */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Node Accent Color
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {AVAILABLE_COLORS.map(c => {
                              const isSelected = (exp.color || 'blue').toLowerCase() === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => handleUpdateExperience(exp.id, 'color', c.id)}
                                  title={c.label}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSelected
                                      ? 'bg-muted border-foreground/60 shadow-sm'
                                      : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                                  }`}
                                >
                                  <span className={`w-3 h-3 rounded-full ${c.class}`} />
                                  <span>{c.label.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Description Bilingual */}
                      <div className="grid md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Description & Narrative (EN)
                          </label>
                          <Textarea
                            value={exp.description || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Describe your degree, key courses, achievements, responsibilities, or impact during this period..."
                            className="min-h-[90px] text-sm leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            الوصف والتفاصيل (عربي)
                          </label>
                          <Textarea
                            value={exp.descriptionAr || ''}
                            onChange={e => handleUpdateExperience(exp.id, 'descriptionAr', e.target.value)}
                            placeholder="اكتب تفاصيل وإنجازات هذه المرحلة باللغة العربية..."
                            className="min-h-[90px] text-sm leading-relaxed font-arabic"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           TAB 2: CERTIFICATES & LICENSES (Horizontal Carousel Cards)
        ══════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card/60 backdrop-blur-md rounded-2xl border border-border/80">
            <div>
              <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                Certifications & Industry Licenses
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                These render in the horizontal swipeable cards section underneath the timeline.
              </p>
            </div>
            <Button onClick={handleAddCertificate} className="gap-2">
              <Plus size={16} /> Add Certificate Card
            </Button>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
              <Award size={40} className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-semibold text-base">No certificates published yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add recognized certifications from AWS, Google, Meta, Scrum, etc.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {certificates.map((cert, index) => {
                const isFirst = index === 0;
                const isLast = index === certificates.length - 1;

                return (
                  <div
                    key={cert.id}
                    className="bg-card/70 dark:bg-white/[0.02] backdrop-blur-xl border border-border/80 rounded-2xl p-5 transition-all duration-200 hover:border-border hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top bar with Move controls & Delete */}
                      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-mono font-bold text-xs text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-mono font-semibold text-muted-foreground">
                            Certificate
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveCertificate(index, 'up')}
                            disabled={isFirst}
                            title="Move left/up"
                            className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ChevronUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCertificate(index, 'down')}
                            disabled={isLast}
                            title="Move right/down"
                            className="p-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ChevronDown size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertificate(cert.id)}
                            title="Delete certificate"
                            className="p-1 rounded-lg border border-destructive/20 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all ml-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Certificate Title (EN)
                            </label>
                            <Input
                              value={cert.title}
                              onChange={e => handleUpdateCertificate(cert.id, 'title', e.target.value)}
                              placeholder="e.g. AWS Certified Solutions Architect"
                              className="font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              عنوان الشهادة (عربي)
                            </label>
                            <Input
                              value={cert.titleAr || ''}
                              onChange={e => handleUpdateCertificate(cert.id, 'titleAr', e.target.value)}
                              placeholder="مثال: شهادة مهندس حلول سحابية معتمد"
                              className="font-bold text-sm font-arabic"
                              dir="rtl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Issuer (EN)
                            </label>
                            <Input
                              value={cert.issuer}
                              onChange={e => handleUpdateCertificate(cert.id, 'issuer', e.target.value)}
                              placeholder="e.g. Amazon Web Services"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              الجهة المانحة (عربي)
                            </label>
                            <Input
                              value={cert.issuerAr || ''}
                              onChange={e => handleUpdateCertificate(cert.id, 'issuerAr', e.target.value)}
                              placeholder="مثال: خدمات أمازون للويب"
                              className="font-arabic"
                              dir="rtl"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Issue Year / Date
                            </label>
                            <Input
                              value={cert.issueDate || ''}
                              onChange={e => handleUpdateCertificate(cert.id, 'issueDate', e.target.value)}
                              placeholder="e.g. 2024"
                            />
                          </div>
                        </div>

                        {/* Credential ID & Link / File Upload */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Credential ID
                          </label>
                          <Input
                            value={cert.credentialId || ''}
                            onChange={e => handleUpdateCertificate(cert.id, 'credentialId', e.target.value)}
                            placeholder="e.g. AWS-SAA-89301"
                          />
                        </div>

                        {/* File Upload or Web Link */}
                        <div className="space-y-2 p-3 bg-muted/30 rounded-xl border border-border/60">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Certificate Document or Web URL
                            </label>
                            <span className="text-[11px] font-mono text-muted-foreground">PDF, PNG, JPG</span>
                          </div>

                          {cert.credentialUrl && cert.credentialUrl.startsWith('/uploads/') ? (
                            <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-card border border-border/80 shadow-sm">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {cert.credentialUrl.toLowerCase().includes('.pdf') ? (
                                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 flex-shrink-0">
                                    <FileText size={16} />
                                  </div>
                                ) : (
                                  <img
                                    src={`http://localhost:5000${cert.credentialUrl}`}
                                    alt="Cert preview"
                                    className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0"
                                  />
                                )}
                                <div className="overflow-hidden">
                                  <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                                    {cert.credentialUrl.split('/').pop()}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-mono">
                                    {cert.credentialUrl.toLowerCase().includes('.pdf') ? 'PDF Document' : 'Image File'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <a
                                  href={`http://localhost:5000${cert.credentialUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium inline-flex items-center gap-1"
                                >
                                  <ExternalLink size={13} />
                                  <span className="hidden sm:inline">View</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCertificate(cert.id, 'credentialUrl', '')}
                                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs"
                                  title="Remove uploaded file"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Input
                                value={cert.credentialUrl || ''}
                                onChange={e => handleUpdateCertificate(cert.id, 'credentialUrl', e.target.value)}
                                placeholder="External verification URL (https://...)"
                                className="text-xs"
                              />

                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  id={`file-cert-${cert.id}`}
                                  accept="application/pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadCertificateFile(cert.id, file);
                                  }}
                                />
                                <label
                                  htmlFor={`file-cert-${cert.id}`}
                                  className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-medium text-foreground transition-all shadow-sm ${
                                    uploadingCertId === cert.id ? 'opacity-50 pointer-events-none' : ''
                                  }`}
                                >
                                  {uploadingCertId === cert.id ? (
                                    <>
                                      <Loader2 size={13} className="animate-spin text-amber-500" />
                                      <span>Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={13} className="text-emerald-500" />
                                      <span>Upload Certificate (PDF / Image)</span>
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>
                          )}
                        </div>


                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Skills Tags (EN, comma-separated)
                            </label>
                            <Input
                              value={cert.skills || ''}
                              onChange={e => handleUpdateCertificate(cert.id, 'skills', e.target.value)}
                              placeholder="e.g. React, Next.js, Cloud Architecture"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              المهارات المرتبطة (عربي، مفصولة بفواصل)
                            </label>
                            <Input
                              value={cert.skillsAr || ''}
                              onChange={e => handleUpdateCertificate(cert.id, 'skillsAr', e.target.value)}
                              placeholder="مثال: رياكت، نكست، حوسبة سحابية"
                              className="font-arabic"
                              dir="rtl"
                            />
                          </div>
                        </div>

                        {/* Icon Picker */}
                        <div className="space-y-1 pt-1">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Badge Icon
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CERT_ICONS.map(ci => {
                              const isSelected = (cert.icon || 'award') === ci.id;
                              return (
                                <button
                                  key={ci.id}
                                  type="button"
                                  onClick={() => handleUpdateCertificate(cert.id, 'icon', ci.id)}
                                  className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                                    isSelected
                                      ? 'bg-foreground text-background border-foreground shadow-sm'
                                      : 'bg-muted/40 border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {ci.icon}
                                  <span>{ci.label.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Link */}
                    {cert.credentialUrl && (
                      <div className="pt-4 mt-3 border-t border-border/40 flex justify-end">
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
                        >
                          <span>Test verification link</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
