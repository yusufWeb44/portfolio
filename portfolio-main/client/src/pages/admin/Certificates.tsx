import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Edit2, Check, Award, 
  ExternalLink, Loader2, RefreshCw, Calendar, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
  icon?: string | null;
  skills?: string | null;
  order?: number;
}

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    skills: '',
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
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      credentialId: '',
      skills: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      credentialId: cert.credentialId || '',
      skills: cert.skills || '',
    });
    setIsModalOpen(true);
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
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate.trim() || null,
        credentialUrl: formData.credentialUrl.trim() || null,
        credentialId: formData.credentialId.trim() || null,
        skills: formData.skills.trim() || null,
      };

      if (editingCert) {
        const res = await api.put(`/certificates/${editingCert.id}`, payload);
        setCertificates(certificates.map(c => c.id === editingCert.id ? res.data.data : c));
        showToast('Certificate updated successfully');
      } else {
        const res = await api.post('/certificates', {
          ...payload,
          order: certificates.length,
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
      setCertificates(certificates.filter(c => c.id !== id));
      showToast('Certificate deleted');
    } catch {
      showToast('Failed to delete certificate', 'error');
    }
  };

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>Certificates | Admin</title></Helmet>

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
          <h1 className="text-3xl font-bold tracking-tight">Certificates &amp; Credentials</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your verified degrees, professional certifications, and technical licenses.
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card/40">
          <Award className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-semibold">No certificates yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Add your professional licenses and certifications to boost credibility.
          </p>
          <Button onClick={openCreateModal}>
            <Plus size={14} className="mr-1.5" /> Add First Certificate
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-xl border border-border bg-card hover:border-border/80 transition-all flex flex-col justify-between gap-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Award size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-primary">{cert.issuer}</span>
                      <h3 className="font-bold text-base text-foreground leading-tight">{cert.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {cert.issueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {cert.issueDate}
                    </span>
                  )}
                  {cert.credentialId && (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted">
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>

                {cert.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.split(',').map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted/60 text-muted-foreground"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    Verify Credential <ExternalLink size={12} />
                  </a>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(cert)}>
                    <Edit2 size={13} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Certificate Title</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Meta Front-End Developer Professional Certificate"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issuing Organization</label>
                  <Input
                    value={formData.issuer}
                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Meta, AWS, Coursera"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issue Date</label>
                  <Input
                    value={formData.issueDate}
                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. Nov 2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Credential URL</label>
                  <Input
                    value={formData.credentialUrl}
                    onChange={e => setFormData({ ...formData, credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Credential ID</label>
                  <Input
                    value={formData.credentialId}
                    onChange={e => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. ABC123XYZ"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Skills Covered (comma separated)</label>
                <Input
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, UI/UX, Performance"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
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
