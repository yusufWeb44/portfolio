import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Edit2, Check, Award, 
  Loader2, RefreshCw, Sparkles,
  Upload, Save
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
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

  // Section Header Settings (Title & Subtitle managed from CMS)
  const [headerSettings, setHeaderSettings] = useState({
    certificatesTitle: 'CERTIFICATES',
    certificatesTitleAr: 'الشهادات والمؤهلات',
    certificatesSubtitle: 'Recognized industry credentials, academic achievements, and verified technical licenses.',
    certificatesSubtitleAr: 'مؤهلات وشهادات معتمدة توثق الكفاءة التقنية والإنجازات الأكاديمية.',
  });
  const [savingHeader, setSavingHeader] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simplified Form: Focus purely on the Certificate Image
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    titleAr: '',
    issuer: '',
    issuerAr: '',
  });

  useEffect(() => {
    fetchCertificates();
    fetchHeaderSettings();
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

  const fetchHeaderSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.data) {
        const d = res.data.data;
        setHeaderSettings({
          certificatesTitle: d.certificatesTitle || 'CERTIFICATES',
          certificatesTitleAr: d.certificatesTitleAr || 'الشهادات والمؤهلات',
          certificatesSubtitle: d.certificatesSubtitle || 'Recognized industry credentials, academic achievements, and verified technical licenses.',
          certificatesSubtitleAr: d.certificatesSubtitleAr || 'مؤهلات وشهادات معتمدة توثق الكفاءة التقنية والإنجازات الأكاديمية.',
        });
      }
    } catch {
      // Keep fallbacks
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingHeader(true);
      await api.put('/settings', headerSettings);
      window.dispatchEvent(new Event('portfolio_settings_updated'));
      showToast('Certificates section title & subtitle saved successfully');
    } catch {
      showToast('Failed to save header settings', 'error');
    } finally {
      setSavingHeader(false);
    }
  };

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      imageUrl: '',
      title: 'Certificate',
      titleAr: '',
      issuer: 'Verified Credential',
      issuerAr: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormData({
      imageUrl: cert.imageUrl || cert.credentialUrl || '',
      title: cert.title || 'Certificate',
      titleAr: cert.titleAr || '',
      issuer: cert.issuer || 'Verified Credential',
      issuerAr: cert.issuerAr || '',
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
    if (!formData.imageUrl.trim()) {
      showToast('Please upload or select a certificate image', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        imageUrl: formData.imageUrl.trim(),
        title: formData.title?.trim() || 'Certificate',
        titleAr: formData.titleAr?.trim() || null,
        issuer: formData.issuer?.trim() || 'Verified Credential',
        issuerAr: formData.issuerAr?.trim() || null,
      };

      if (editingCert) {
        const res = await api.put(`/certificates/${editingCert.id}`, payload);
        setCertificates(certificates.map((c) => (c.id === editingCert.id ? res.data.data : c)));
        showToast('Certificate image updated successfully');
      } else {
        const res = await api.post('/certificates', {
          ...payload,
          order: certificates.length + 1,
        });
        setCertificates([...certificates, res.data.data]);
        showToast('Certificate added successfully');
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
    <div className="relative min-h-[80vh] pb-20 space-y-8">
      <Helmet><title>Certificates | Admin CMS</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Certificates &amp; Credentials</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Control the section title, subtitle, and upload certificate images displayed on the 3D panoramic carousel.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchCertificates} disabled={loading}>
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateModal}>
            <Plus size={16} className="mr-1.5" />
            Upload Certificate
          </Button>
        </div>
      </div>

      {/* ── Section Header Control Card (Title & Subtitle CMS) ── */}
      <form onSubmit={handleSaveHeader} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-foreground">Section Header (Title &amp; Subtitle)</h2>
          </div>
          <Button type="submit" size="sm" disabled={savingHeader}>
            {savingHeader ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Save size={14} className="mr-1.5" />}
            Save Header
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Title EN & AR */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Section Title (English)</label>
            <Input
              value={headerSettings.certificatesTitle}
              onChange={(e) => setHeaderSettings({ ...headerSettings, certificatesTitle: e.target.value })}
              placeholder="e.g. CERTIFICATES"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Section Title (Arabic)</label>
            <Input
              value={headerSettings.certificatesTitleAr}
              onChange={(e) => setHeaderSettings({ ...headerSettings, certificatesTitleAr: e.target.value })}
              placeholder="e.g. الشهادات والمؤهلات"
              dir="rtl"
            />
          </div>

          {/* Subtitle EN & AR */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Section Subtitle (English)</label>
            <Textarea
              value={headerSettings.certificatesSubtitle}
              onChange={(e) => setHeaderSettings({ ...headerSettings, certificatesSubtitle: e.target.value })}
              placeholder="e.g. Recognized industry credentials, academic achievements, and verified technical licenses."
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Section Subtitle (Arabic)</label>
            <Textarea
              value={headerSettings.certificatesSubtitleAr}
              onChange={(e) => setHeaderSettings({ ...headerSettings, certificatesSubtitleAr: e.target.value })}
              placeholder="e.g. مؤهلات وشهادات معتمدة توثق الكفاءة التقنية والإنجازات الأكاديمية."
              rows={2}
              dir="rtl"
            />
          </div>
        </div>
      </form>

      {/* ── Certificates Image Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Uploaded Certificates ({certificates.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-lg font-bold">No certificates uploaded yet</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-5">
              Upload your certificate images to display on the 3D curved panoramic carousel.
            </p>
            <Button onClick={openCreateModal}>
              <Plus size={15} className="mr-1.5" /> Upload First Certificate
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {certificates.map((cert, index) => {
              const previewUrl = cert.imageUrl ? getMediaUrl(cert.imageUrl) : (cert.credentialUrl ? getMediaUrl(cert.credentialUrl) : null);

              return (
                <div
                  key={cert.id}
                  className="rounded-2xl border border-border bg-card hover:border-emerald-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group"
                >
                  {/* Clean Visual Image */}
                  <div className="relative aspect-[1.41/1] bg-slate-950 overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Certificate"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        <Award className="w-10 h-10 mx-auto mb-2 text-amber-500 opacity-60" />
                        <p className="text-xs">No image attached</p>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/10 shadow">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Clean Action Footer */}
                  <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                      {cert.imageUrl ? cert.imageUrl.split('/').pop() : 'Certificate'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(cert)} title="Change Image">
                        <Edit2 size={13} className="mr-1" /> Replace
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => handleDelete(cert.id)}
                        title="Delete certificate"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Clean Simplified Upload Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-border shrink-0 bg-card">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                {editingCert ? 'Replace Certificate Image' : 'Upload Certificate Image'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveCert} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* Certificate Preview or Dropzone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Certificate File (WebP / PNG / JPG)</span>
                    {uploadingImage && (
                      <span className="text-xs text-emerald-500 flex items-center gap-1 font-normal">
                        <Loader2 size={12} className="animate-spin" /> Uploading...
                      </span>
                    )}
                  </label>

                  {formData.imageUrl ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-slate-900/40 dark:bg-black/40 flex flex-col items-center justify-center p-2.5">
                      <div className="relative max-h-[190px] sm:max-h-[220px] w-full flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src={getMediaUrl(formData.imageUrl)}
                          alt="Certificate Preview"
                          className="max-h-[180px] sm:max-h-[210px] w-auto max-w-full object-contain rounded border border-white/10 shadow-md"
                        />
                      </div>
                      <div className="mt-2.5 flex items-center gap-2 w-full justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="text-xs h-7 px-2.5"
                        >
                          <Upload size={12} className="mr-1" />
                          Change Image
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="text-xs h-7 px-2.5 text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-muted/20 hover:bg-muted/30"
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs font-semibold text-foreground">Click to browse and upload certificate</p>
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
                </div>

                {/* Direct Path Input */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-medium text-muted-foreground block">
                    Or enter file path / URL directly:
                  </label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/my_certificate.webp or https://..."
                    className="text-xs h-9"
                  />
                </div>

                {/* Preset Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Or select from preset assets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PUBLIC_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-all cursor-pointer ${
                          formData.imageUrl === p.url 
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-sm' 
                            : 'bg-card border-border hover:border-emerald-500/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Pinned at bottom, always visible) */}
              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-3.5 border-t border-border bg-card shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving || uploadingImage || !formData.imageUrl}>
                  {saving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Check size={14} className="mr-1.5" />}
                  {editingCert ? 'Save Image' : 'Add Certificate'}
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
