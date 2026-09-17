import { useEffect, useState } from 'react';
import { 
  FolderKanban, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  Image as ImageIcon, 
  Check, 
  Edit2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface ProjectImage {
  id?: string;
  url: string;
  isCover: boolean;
}

interface Project {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  role?: string;
  roleAr?: string;
  category: string;
  categoryAr?: string;
  challenge?: string;
  challengeAr?: string;
  solution?: string;
  solutionAr?: string;
  year: string;
  github?: string;
  liveDemo?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  images: ProjectImage[];
  technologies: { id: string; name: string }[];
}

interface Technology {
  id: string;
  name: string;
}

const POPULAR_TECH_SUGGESTIONS = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'Python',
  'Flutter', 'Express', 'Prisma', 'GraphQL', 'AWS', 'Vue.js', 'Figma'
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dbTechnologies, setDbTechnologies] = useState<Technology[]>([]);
  const [sectionSettings, setSectionSettings] = useState({
    projectsBadge: 'Featured Case Studies',
    projectsBadgeAr: 'نماذج أعمال مختارة',
    projectsTitle: 'Selected Work.',
    projectsTitleAr: 'أبرز المشاريع والتطبيقات.',
    projectsSubtitle: 'A curated selection of production web applications, custom CRM platforms, and full-stack software architectures built for performance and measurable business impact.',
    projectsSubtitleAr: 'مجموعة مختارة من التطبيقات البرمجية والأنظمة السحابية المتقدمة المصممة لتحقيق أعلى معايير الأداء والنمو التجاري.',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  
  // Multi-image management
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Manual Technology Tag Management
  const [selectedTechNames, setSelectedTechNames] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  
  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTechnologies();
    api.get('/settings').then(res => {
      if (res.data?.data) {
        const d = res.data.data;
        setSectionSettings(prev => ({
          projectsBadge: d.projectsBadge || prev.projectsBadge,
          projectsBadgeAr: d.projectsBadgeAr || prev.projectsBadgeAr,
          projectsTitle: d.projectsTitle || prev.projectsTitle,
          projectsTitleAr: d.projectsTitleAr || prev.projectsTitleAr,
          projectsSubtitle: d.projectsSubtitle || prev.projectsSubtitle,
          projectsSubtitleAr: d.projectsSubtitleAr || prev.projectsSubtitleAr,
        }));
      }
    }).catch(() => {});
  }, []);

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      showToast("Projects section headings updated successfully!");
    } catch {
      showToast("Failed to update projects headings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      showToast("Failed to fetch projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const res = await api.get('/technologies');
      setDbTechnologies(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTechnologies();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateNew = () => {
    setCurrentProject({
      title: '', 
      slug: '', 
      description: '', 
      role: '',
      category: 'Frontend Engineering', 
      year: new Date().getFullYear().toString(),
      github: '', 
      liveDemo: '', 
      isFeatured: false,
      isPublished: false, 
      order: 0
    });
    setSelectedTechNames(['React', 'TypeScript', 'Tailwind CSS']);
    setProjectImages([]);
    setDirectImageUrl('');
    setTechInput('');
    setView('create');
  };

  const handleEdit = (project: Project) => {
    setCurrentProject({
      ...project,
      role: project.role || '',
      isFeatured: !!project.isFeatured,
    });
    setSelectedTechNames(project.technologies?.map(t => t.name) || []);
    setProjectImages(project.images?.length > 0 ? project.images : []);
    setDirectImageUrl('');
    setTechInput('');
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      showToast("Project deleted successfully");
    } catch (error) {
      showToast("Failed to delete project", "error");
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await api.put(`/projects/${project.id}`, {
        ...project,
        technologyNames: project.technologies.map(t => t.name),
        images: project.images,
        isPublished: !project.isPublished
      });
      setProjects(projects.map(p => p.id === project.id ? res.data.data : p));
      showToast(res.data.data.isPublished ? "Project published" : "Project unpublished");
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const nextFeatured = !project.isFeatured;
      const res = await api.put(`/projects/${project.id}`, {
        ...project,
        technologyNames: project.technologies.map(t => t.name),
        images: project.images,
        isFeatured: nextFeatured
      });
      setProjects(projects.map(p => p.id === project.id ? res.data.data : p));
      showToast(nextFeatured ? "Project featured on homepage" : "Project removed from featured");
    } catch (error) {
      showToast("Failed to update featured status", "error");
    }
  };

  // ── Project Ordering Handlers (التحكم بالترتيب: الأول، الثاني، إلخ) ──
  const handleReorder = async (newProjects: Project[]) => {
    // Assign 1-based sequential order
    const updated = newProjects.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(updated);

    try {
      const items = updated.map(p => ({ id: p.id, order: p.order }));
      await api.put('/projects/reorder', { items });
      showToast("تم تحديث ترتيب المشاريع بنجاح");
    } catch (error) {
      showToast("فشل في حفظ الترتيب", "error");
      fetchProjects();
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...projects];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    handleReorder(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= projects.length - 1) return;
    const next = [...projects];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    handleReorder(next);
  };

  // ── Technology Tag Handlers ──
  const handleAddTech = (nameToAdd?: string) => {
    const raw = nameToAdd !== undefined ? nameToAdd : techInput;
    const name = raw.trim();
    if (!name) return;

    // Check if already exists (case-insensitive)
    const exists = selectedTechNames.some(t => t.toLowerCase() === name.toLowerCase());
    if (!exists) {
      setSelectedTechNames(prev => [...prev, name]);
    }
    setTechInput('');
  };

  const handleRemoveTech = (nameToRemove: string) => {
    setSelectedTechNames(prev => prev.filter(t => t.toLowerCase() !== nameToRemove.toLowerCase()));
  };

  const handleKeyDownTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  // ── Image Upload & Multi-Image Handlers ──
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newUploaded: ProjectImage[] = [];
      const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);

        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const fullUrl = uploadsUrl + res.data.url;
        newUploaded.push({
          url: fullUrl,
          isCover: projectImages.length === 0 && newUploaded.length === 0
        });
      }

      setProjectImages(prev => {
        const updated = [...prev, ...newUploaded];
        // Ensure at least one image is marked as cover
        if (!updated.some(img => img.isCover) && updated.length > 0) {
          updated[0].isCover = true;
        }
        return updated;
      });

      showToast(`Uploaded ${newUploaded.length} image(s) successfully`);
    } catch (error) {
      showToast("Failed to upload image(s)", "error");
    } finally {
      setUploadingImage(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleAddDirectImageUrl = () => {
    const trimmed = directImageUrl.trim();
    if (!trimmed) return;

    setProjectImages(prev => {
      const isFirst = prev.length === 0;
      return [...prev, { url: trimmed, isCover: isFirst }];
    });
    setDirectImageUrl('');
    showToast("Image URL added");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProjectImages(prev => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleSetCover = (indexToCover: number) => {
    setProjectImages(prev =>
      prev.map((img, idx) => ({
        ...img,
        isCover: idx === indexToCover
      }))
    );
  };

  const handleMoveImage = (fromIdx: number, direction: 'left' | 'right') => {
    const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= projectImages.length) return;

    setProjectImages(prev => {
      const next = [...prev];
      const temp = next[fromIdx];
      next[fromIdx] = next[toIdx];
      next[toIdx] = temp;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-generate slug if missing
    let slug = currentProject.slug;
    if (!slug && currentProject.title) {
      slug = currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Ensure at least one cover if images exist
    const finalImages = projectImages.map((img, idx) => ({
      ...img,
      isCover: projectImages.some(i => i.isCover) ? img.isCover : idx === 0
    }));

    const payload = {
      ...currentProject,
      order: currentProject.order !== undefined && currentProject.order !== null ? Number(currentProject.order) : 0,
      slug,
      technologyNames: selectedTechNames,
      images: finalImages
    };

    try {
      if (view === 'create') {
        await api.post('/projects', payload);
        showToast("Project created successfully");
      } else {
        await api.put(`/projects/${currentProject.id}`, payload);
        showToast("Project updated successfully");
      }
      fetchProjects();
      fetchTechnologies();
      setView('list');
    } catch (error: any) {
      showToast(error.response?.data?.message || "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <Helmet>
        <title>Projects | Admin Dashboard</title>
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {view === 'list' ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
              <p className="text-muted-foreground">Manage your portfolio case studies.</p>
            </div>
            <Button onClick={handleCreateNew} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
              <Plus size={16} /> New Project
            </Button>
          </div>

          {/* Section Headings Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FolderKanban size={18} className="text-emerald-400" />
                  Projects Section Headings &amp; Subtitle
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Edit the badge, main heading, and subtitle shown at the top of the Projects section on the homepage.
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
                  value={sectionSettings.projectsBadge} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsBadge: e.target.value })}
                  placeholder="Featured Case Studies"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">شارة القسم (عربي)</label>
                <Input 
                  value={sectionSettings.projectsBadgeAr} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsBadgeAr: e.target.value })}
                  placeholder="نماذج أعمال مختارة"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Main Heading (EN)</label>
                <Input 
                  value={sectionSettings.projectsTitle} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsTitle: e.target.value })}
                  placeholder="Selected Work."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">العنوان الرئيسي (عربي)</label>
                <Input 
                  value={sectionSettings.projectsTitleAr} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsTitleAr: e.target.value })}
                  placeholder="أبرز المشاريع والتطبيقات."
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Subtitle / Description (EN)</label>
                <Input 
                  value={sectionSettings.projectsSubtitle} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsSubtitle: e.target.value })}
                  placeholder="A curated selection of production web applications..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">الوصف التوضيحي (عربي)</label>
                <Input 
                  value={sectionSettings.projectsSubtitleAr} 
                  onChange={e => setSectionSettings({ ...sectionSettings, projectsSubtitleAr: e.target.value })}
                  placeholder="مجموعة مختارة من التطبيقات البرمجية والأنظمة السحابية..."
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">Get started by creating your first project case study.</p>
              <Button onClick={handleCreateNew}>Create Project</Button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-4 font-medium text-center w-28">الترتيب / Order</th>
                      <th className="px-6 py-4 font-medium">Project</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium text-center">Featured</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Year</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="flex flex-col items-center">
                              <span className="inline-flex items-center justify-center min-w-[34px] h-7 px-2 rounded-md font-mono text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shadow-sm">
                                #{index + 1}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap">
                                {index === 0 ? 'الأول' : index === 1 ? 'الثاني' : index === 2 ? 'الثالث' : index === 3 ? 'الرابع' : index === 4 ? 'الخامس' : `${index + 1}`}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 ml-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveUp(index)}
                                title="تحريك لأعلى (تقديم الترتيب ليظهر قبله)"
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={index === projects.length - 1}
                                onClick={() => handleMoveDown(index)}
                                title="تحريك لأسفل (تأخير الترتيب ليظهر بعده)"
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <ChevronDown size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground flex items-center gap-2 flex-wrap">
                            <span>{project.title}</span>
                            {project.titleAr && (
                              <span className="text-emerald-400 font-arabic text-xs" dir="rtl">
                                ({project.titleAr})
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">/{project.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground max-w-[200px] truncate block">
                            {project.role || 'No role set'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(project)}
                            title={project.isFeatured ? "Featured on homepage (click to toggle)" : "Click to feature on homepage"}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              project.isFeatured
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25'
                                : 'bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Star size={15} className={project.isFeatured ? "fill-amber-400 text-amber-400" : ""} />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleTogglePublish(project)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              project.isPublished 
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20' 
                                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20'
                            }`}
                          >
                            {project.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                            {project.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{project.year || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive hover:bg-destructive/10">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setView('list')}
              className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{view === 'create' ? 'Create Project' : 'Edit Project'}</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-6">Basic Information (المعلومات الأساسية باللغتين)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title (English) <span className="text-destructive">*</span></label>
                  <Input 
                    value={currentProject.title || ''} 
                    onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                    required
                    placeholder="e.g. Enterprise Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان المشروع (بالعربية)</label>
                  <Input 
                    value={currentProject.titleAr || ''} 
                    onChange={e => setCurrentProject({...currentProject, titleAr: e.target.value})}
                    placeholder="مثال: لوحة تحكم وإدارة العمليات"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug <span className="text-muted-foreground font-normal">(auto-generated if empty)</span></label>
                  <Input 
                    value={currentProject.slug || ''} 
                    onChange={e => setCurrentProject({...currentProject, slug: e.target.value})}
                    placeholder="e.g. enterprise-dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category (English)</label>
                  <Input 
                    value={currentProject.category || ''} 
                    onChange={e => setCurrentProject({...currentProject, category: e.target.value})}
                    placeholder="e.g. Full-Stack / SaaS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">التصنيف (بالعربية)</label>
                  <Input 
                    value={currentProject.categoryAr || ''} 
                    onChange={e => setCurrentProject({...currentProject, categoryAr: e.target.value})}
                    placeholder="مثال: نظام متكامل / برمجيات كخدمة"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input 
                    value={currentProject.year || ''} 
                    onChange={e => setCurrentProject({...currentProject, year: e.target.value})}
                    placeholder="e.g. 2026"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">ترتيب العرض / Display Order</label>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {currentProject.order === 1 ? '🥇 الأول' : currentProject.order === 2 ? '🥈 الثاني' : currentProject.order === 3 ? '🥉 الثالث' : currentProject.order ? `#${currentProject.order}` : 'تلقائي'}
                    </span>
                  </div>
                  <Input 
                    type="number"
                    min={1}
                    value={currentProject.order ?? ''} 
                    onChange={e => setCurrentProject({...currentProject, order: parseInt(e.target.value) || 0})}
                    placeholder="1 = الأول، 2 = الثاني..."
                  />
                  <p className="text-[11px] text-muted-foreground">
                    الرقم 1 يظهر أولاً في الموقع، يليه 2 ثم 3 وهكذا.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role in Project (English)</label>
                  <Input 
                    value={currentProject.role || ''} 
                    onChange={e => setCurrentProject({...currentProject, role: e.target.value})}
                    placeholder="e.g. End-to-End System Architecture"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">دورك في المشروع (بالعربية)</label>
                  <Input 
                    value={currentProject.roleAr || ''} 
                    onChange={e => setCurrentProject({...currentProject, roleAr: e.target.value})}
                    placeholder="مثال: المعمارية البرمجية وتطوير واجهات المستخدم"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Short Description (English) <span className="text-destructive">*</span></label>
                  <Textarea 
                    value={currentProject.description || ''} 
                    onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                    required
                    rows={3}
                    placeholder="A brief summary for the project cards..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الوصف المختصر (بالعربية)</label>
                  <Textarea 
                    value={currentProject.descriptionAr || ''} 
                    onChange={e => setCurrentProject({...currentProject, descriptionAr: e.target.value})}
                    rows={3}
                    placeholder="ملخص قصير يظهر في كروت المشاريع بالعربية..."
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Media (Multi-Image Gallery & Slider Manager) */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-lg font-bold">Project Images &amp; Slider Showcase</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload or add multiple screenshots. The first 3–4 images will be displayed in the interactive slider on the portfolio.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-muted border border-border">
                  {projectImages.length} {projectImages.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              {/* Upload & Add URL Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center pb-6 border-b border-border/60">
                {/* Upload from device */}
                <div className="relative">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />
                  <Button type="button" variant="outline" disabled={uploadingImage} className="gap-2">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon size={16} />}
                    {uploadingImage ? 'Uploading Image(s)...' : 'Upload Screenshot(s)'}
                  </Button>
                </div>

                <span className="text-xs text-muted-foreground hidden md:inline">or</span>

                {/* Direct image URL */}
                <div className="flex items-center gap-2 flex-1 w-full max-w-lg">
                  <Input 
                    value={directImageUrl}
                    onChange={(e) => setDirectImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDirectImageUrl();
                      }
                    }}
                    placeholder="Paste image URL (https://...)"
                    className="text-xs"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddDirectImageUrl} 
                    className="shrink-0 text-xs"
                  >
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Image Grid / Gallery */}
              {projectImages.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border/80 rounded-xl mt-6 bg-muted/20">
                  <ImageIcon className="mx-auto w-10 h-10 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-foreground">No screenshots added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload images from your device or paste image URLs above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {projectImages.map((img, idx) => (
                    <div 
                      key={`${img.url}-${idx}`}
                      className={`group relative rounded-xl overflow-hidden border transition-all bg-muted/40 flex flex-col ${
                        img.isCover 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/20">
                        <img 
                          src={img.url} 
                          alt={`Screenshot ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                        
                        {/* Cover Badge */}
                        {img.isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Star size={10} className="fill-white" />
                            <span>Cover</span>
                          </div>
                        )}

                        {/* Order Number Badge */}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Image Actions Bar */}
                      <div className="p-2.5 bg-card flex items-center justify-between gap-1 border-t border-border/50 text-xs">
                        <div className="flex items-center gap-1">
                          {/* Reorder Left */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          {/* Reorder Right */}
                          <button
                            type="button"
                            disabled={idx === projectImages.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!img.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links & Technologies (Manual Free Entry + Quick Suggestions) */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-6">Links &amp; Technologies</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Live Demo URL</label>
                  <Input 
                    value={currentProject.liveDemo || ''} 
                    onChange={e => setCurrentProject({...currentProject, liveDemo: e.target.value})}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input 
                    value={currentProject.github || ''} 
                    onChange={e => setCurrentProject({...currentProject, github: e.target.value})}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              
              {/* Manual Technology Tag Manager */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Technologies &amp; Languages Used
                  </label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {selectedTechNames.length} selected
                  </span>
                </div>

                {/* Input for Manual Technology Addition */}
                <div className="flex gap-2">
                  <Input 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleKeyDownTech}
                    placeholder="Type ANY technology name (e.g. Next.js, Python, Flutter, Docker) and press Enter..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleAddTech()}
                    className="shrink-0 gap-1.5"
                  >
                    <Plus size={15} /> Add
                  </Button>
                </div>

                {/* Active Technologies Chips */}
                {selectedTechNames.length > 0 ? (
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Selected for this project:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechNames.map((techName) => (
                        <span
                          key={techName}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur-md"
                        >
                          <span>{techName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(techName)}
                            className="w-4 h-4 rounded-full hover:bg-emerald-500/20 inline-flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={`Remove ${techName}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-500/90 font-mono">
                    ⚠️ No technologies added yet. Type above or click from suggestions below.
                  </p>
                )}

                {/* Quick Add Suggestions */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Quick Suggestions (click to add/toggle):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set([
                      ...POPULAR_TECH_SUGGESTIONS,
                      ...dbTechnologies.map(t => t.name)
                    ])).map((suggestion) => {
                      const isSelected = selectedTechNames.some(
                        t => t.toLowerCase() === suggestion.toLowerCase()
                      );
                      return (
                        <button
                          type="button"
                          key={suggestion}
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveTech(suggestion);
                            } else {
                              handleAddTech(suggestion);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                              : 'bg-card border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {isSelected ? `✓ ${suggestion}` : `+ ${suggestion}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border rounded-xl sticky bottom-4 shadow-xl shadow-background/20 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    id="publish" 
                    checked={currentProject.isPublished || false}
                    onChange={e => setCurrentProject({...currentProject, isPublished: e.target.checked})}
                    className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground accent-foreground cursor-pointer"
                  />
                  <label htmlFor="publish" className="text-sm font-medium cursor-pointer">Published</label>
                </div>

                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    checked={currentProject.isFeatured || false}
                    onChange={e => setCurrentProject({...currentProject, isFeatured: e.target.checked})}
                    className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                    <Star size={14} className={currentProject.isFeatured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
                    <span>Featured on Homepage</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setView('list')} disabled={saving}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Project'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Projects;
