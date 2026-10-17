import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Edit2, Check, Award, 
  ExternalLink, Loader2, RefreshCw, Sparkles,
  Upload
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getMediaUrl } from '../../utils/mediaUrl';

interface CertificateItem {
  id: string;
  title: string;
  titleAr?: string | null;
  issuer: string;
  issuerAr?: string | null;
  issueDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  skills?: string | null;
  skillsAr?: string | null;
  order?: number;
}

const PUBLIC_PRESETS = [
  { name: 'Biruni Summit', url: '/biruni_sertafika.webp' },
  { name: 'Huawei Cloud', url: '/hwawi_sertafika.webp' },
  { name: 'NextGen Summit', url: '/nextgen_sertifika.webp' },
  { name: 'Edraak Web Track', url: '/edraak_certificate.webp' },
  { name: 'Forsa Software Engineering', url: '/forsa_sertafika.webp' },
  { name: 'Mind Luster React', url: '/mindluster_sertafika.webp' },
];

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    issuer: '',
    issuerAr: '',
    issueDate: '',
    imageUrl: '',
    credentialUrl: '',
    credentialId: '',
    skills: '',
    skillsAr: '',
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates');
      setCertificates(res.data?.data || []);
    } catch {
      showToast('Failed to fetch certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      titleAr: '',
      issuer: '',
      issuerAr: '',
      issueDate: '',
      imageUrl: '',
      credentialUrl: '',
      credentialId: '',
      skills: '',
      skillsAr: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      titleAr: cert.titleAr || '',
      issuer: cert.issuer,
      issuerAr: cert.issuerAr || '',
      issueDate: cert.issueDate || '',
      imageUrl: cert.imageUrl || '',
      credentialUrl: cert.credentialUrl || '',
      credentialId: cert.credentialId || '',
      skills: cert.skills || '',
      skillsAr: cert.skillsAr || '',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
        showToast('Certificate image uploaded successfully');
      } else {
        showToast('Image upload failed', 'error');
      }
    } catch {
      showToast('Failed to upload certificate image', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) {
      showToast('Title and issuer are required', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        titleAr: formData.titleAr.trim() || null,
        issuer: formData.issuer.trim(),
        issuerAr: formData.issuerAr.trim() || null,
        issueDate: formData.issueDate.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
        credentialUrl: formData.credentialUrl.trim() || null,
        credentialId: formData.credentialId.trim() || null,
        skills: formData.skills.trim() || null,
        skillsAr: formData.skillsAr.trim() || null,
      };

      if (editingCert) {
        const res = await api.put(`/certificates/${editingCert.id}`, payload);
        setCertificates(certificates.map((c) => (c.id === editingCert.id ? res.data.data : c)));
        showToast('Certificate updated successfully');
      } else {
        const res = await api.post('/certificates', {
          ...payload,
          order: certificates.length + 1,
        });
        setCertificates([...certificates, res.data.data]);
        showToast('Certificate created successfully');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Failed to save certificate', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      setCertificates(certificates.filter((c) => c.id !== id));
      showToast('Certificate deleted');
    } catch {
      showToast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>Certificates | Admin CMS</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Certificates &amp; Credentials</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your verified degrees, certifications, and technical badges displayed on the circular wheel.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchCertificates} disabled={loading}>
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-1.5" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Certificate Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-bold">No certificates yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-5">
            Add your professional licenses and certifications to power the circular Ferris wheel.
          </p>
          <Button onClick={openCreateModal}>
            <Plus size={15} className="mr-1.5" /> Add First Certificate
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => {
            const previewUrl = cert.imageUrl ? getMediaUrl(cert.imageUrl) : (cert.credentialUrl ? getMediaUrl(cert.credentialUrl) : null);

            return (
              <div
                key={cert.id}
                className="rounded-2xl border border-border bg-card hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group"
              >
                {/* Certificate Visual Image Preview */}
                <div className="relative aspect-[1.41/1] bg-slate-950 border-b border-border/60 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <Award className="w-10 h-10 mx-auto mb-2 text-amber-500 opacity-60" />
                      <p className="text-xs">No image attached</p>
                    </div>
                  )}
                  {cert.issueDate && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/10 shadow">
                      {cert.issueDate}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-500 block mb-0.5">{cert.issuer}</span>
                    <h3 className="font-bold text-base text-foreground leading-tight">{cert.title}</h3>
                    {cert.titleAr && (
                      <p className="text-xs text-muted-foreground mt-0.5" dir="rtl">{cert.titleAr}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                    {cert.credentialId && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted/60 border border-border/40">
                        ID: {cert.credentialId}
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={getMediaUrl(cert.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:underline ms-auto font-medium"
                      >
                        Verify <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(cert)}>
                    <Edit2 size={13} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(cert.id)}
                    title="Delete certificate"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal (Create / Edit Certificate) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              {/* Image Upload & Preview Section */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Certificate Image (WebP / PNG / JPG)</span>
                  {uploadingImage && <span className="text-xs text-emerald-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Uploading...</span>}
                </label>

                {formData.imageUrl ? (
                  <div className="relative aspect-[1.7/1] w-full bg-slate-950 rounded-lg overflow-hidden border border-border">
                    <img
                      src={getMediaUrl(formData.imageUrl)}
                      alt="Certificate Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 rounded-lg p-6 text-center cursor-pointer transition-colors bg-card/40"
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs font-semibold text-foreground">Click to upload certificate document</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">PNG, WebP, JPG up to 15MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Quick Presets or Manual Image URL */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload size={13} className="mr-1.5" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                    </Button>
                    <span className="text-xs text-muted-foreground">or enter public path below:</span>
                  </div>

                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="e.g. /biruni_sertafika.webp or https://..."
                  />

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground self-center">Presets:</span>
                    {PUBLIC_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          formData.imageUrl === p.url 
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500' 
                            : 'bg-card border-border hover:border-emerald-500/50 text-muted-foreground'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title (EN & AR) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Title (English) *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. NextGen Engineering Summit"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Title (Arabic)</label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="e.g. شهادة قمة الهندسة NextGen"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Issuer (EN & AR) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issuing Organization *</label>
                  <Input
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Biruni University, Meta, AWS"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issuer (Arabic)</label>
                  <Input
                    value={formData.issuerAr}
                    onChange={(e) => setFormData({ ...formData, issuerAr: e.target.value })}
                    placeholder="e.g. جامعة بيروني"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Issue Date & Credential ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issue Date</label>
                  <Input
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. 2025"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Credential ID</label>
                  <Input
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. DC-e51gr6y4"
                  />
                </div>
              </div>

              {/* Credential URL */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Credential Verification URL</label>
                <Input
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://digicertify.net/..."
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Skills Covered (comma separated)</label>
                <Input
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Cloud Architecture, React, Node.js"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || uploadingImage}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Check size={16} className="mr-1.5" />}
                  {editingCert ? 'Save Changes' : 'Create Certificate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
