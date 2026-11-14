import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Plus, Trash2, Edit3, Loader2, Check,
  Upload, ArrowUp, ArrowDown, Eye, EyeOff,
  Quote, MessageSquareQuote, X
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { getMediaUrl } from '../../utils/mediaUrl';

export interface ReviewItem {
  id: string;
  name: string;
  nameAr?: string | null;
  role: string;
  roleAr?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  content: string;
  contentAr?: string | null;
  order: number;
  isEnabled: boolean;
  createdAt?: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Section Headings State
  const [sectionSettings, setSectionSettings] = useState({
    reviewsBadge: 'Client Testimonials',
    reviewsBadgeAr: 'آراء العملاء والشركاء',
    reviewsTitle: 'What Clients & Partners Say.',
    reviewsTitleAr: 'ماذا يقول العملاء والشركاء.',
    reviewsSubtitle: 'Authentic feedback and endorsements from engineering teams, founders, and product stakeholders I have collaborated with.',
    reviewsSubtitleAr: 'تجارب وآراء حقيقية من مؤسسين ومهندسين وفرق تقنية تشرفت بالتعاون معهم وبناء حلول رقمية مشتركة.',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    role: '',
    roleAr: '',
    avatarUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    content: '',
    contentAr: '',
    order: 0,
    isEnabled: true,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/admin');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setReviews(res.data.data);
      }
    } catch {
      showToast('Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.data) {
        const d = res.data.data;
        setSectionSettings(prev => ({
          reviewsBadge: d.reviewsBadge || prev.reviewsBadge,
          reviewsBadgeAr: d.reviewsBadgeAr || prev.reviewsBadgeAr,
          reviewsTitle: d.reviewsTitle || prev.reviewsTitle,
          reviewsTitleAr: d.reviewsTitleAr || prev.reviewsTitleAr,
          reviewsSubtitle: d.reviewsSubtitle || prev.reviewsSubtitle,
          reviewsSubtitleAr: d.reviewsSubtitleAr || prev.reviewsSubtitleAr,
        }));
      }
    } catch {}
  };

  useEffect(() => {
    fetchReviews();
    fetchSectionSettings();
  }, []);

  const handleSaveSectionSettings = async () => {
    setSavingSettings(true);
    try {
      await api.put('/settings', sectionSettings);
      window.dispatchEvent(new Event('portfolio_settings_updated'));
      showToast('Reviews section headings updated successfully!');
    } catch {
      showToast('Failed to update section headings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const openAddModal = () => {
    const nextOrder = reviews.length > 0
      ? Math.max(...reviews.map(r => r.order || 0)) + 1
      : 1;

    setEditingReview(null);
    setFormData({
      name: '',
      nameAr: '',
      role: '',
      roleAr: '',
      avatarUrl: '',
      linkedinUrl: '',
      githubUrl: '',
      content: '',
      contentAr: '',
      order: nextOrder,
      isEnabled: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      name: review.name || '',
      nameAr: review.nameAr || '',
      role: review.role || '',
      roleAr: review.roleAr || '',
      avatarUrl: review.avatarUrl || '',
      linkedinUrl: review.linkedinUrl || '',
      githubUrl: review.githubUrl || '',
      content: review.content || '',
      contentAr: review.contentAr || '',
      order: review.order || 0,
      isEnabled: review.isEnabled !== false,
    });
    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        setFormData(prev => ({ ...prev, avatarUrl: res.data.url }));
        showToast('Avatar image uploaded successfully!');
      } else {
        showToast('Upload failed, please check file size/type', 'error');
      }
    } catch {
      showToast('Failed to upload avatar', 'error');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.content.trim()) {
      showToast('Please fill out Name, Role, and Review content.', 'error');
      return;
    }

    setSavingReview(true);
    try {
      if (editingReview) {
        const res = await api.put(`/reviews/${editingReview.id}`, formData);
        setReviews(prev => prev.map(r => r.id === editingReview.id ? res.data.data : r));
        showToast('Review updated successfully!');
      } else {
        const res = await api.post('/reviews', formData);
        setReviews(prev => [...prev, res.data.data]);
        showToast('New review added successfully!');
      }
      setIsModalOpen(false);
    } catch {
      showToast('Failed to save review', 'error');
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete review from "${name}"?`)) return;

    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Review deleted successfully');
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  const handleToggleEnabled = async (review: ReviewItem) => {
    const updatedStatus = !review.isEnabled;
    try {
      await api.put(`/reviews/${review.id}`, { isEnabled: updatedStatus });
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, isEnabled: updatedStatus } : r));
      showToast(updatedStatus ? 'Review enabled on portfolio' : 'Review disabled');
    } catch {
      showToast('Failed to toggle review status', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= reviews.length) return;

    const newReviews = [...reviews];
    const temp = newReviews[index];
    newReviews[index] = newReviews[targetIndex];
    newReviews[targetIndex] = temp;

    // Re-assign order sequentially
    const updatedWithOrder = newReviews.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    setReviews(updatedWithOrder);

    try {
      await api.put('/reviews/reorder', {
        items: updatedWithOrder.map(r => ({ id: r.id, order: r.order }))
      });
      showToast('Order saved');
    } catch {
      showToast('Failed to save reorder', 'error');
      fetchReviews();
    }
  };

  return (
    <div className="relative min-h-[85vh] pb-20">
      <Helmet><title>Reviews & Testimonials | Admin</title></Helmet>

      {/* Floating Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-emerald-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-emerald-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <MessageSquareQuote size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Reviews & Testimonials</h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                Manage client testimonials, roles, avatars, and headings displayed in the reviews carousel.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={openAddModal} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shrink-0">
          <Plus size={16} /> Add Testimonial
        </Button>
      </div>

      {/* Section Headings Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 mb-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Reviews Section Headings & Subtitle
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize the section badge, main heading, and narrative subtitle in English and Arabic.
            </p>
          </div>
          <Button
            onClick={handleSaveSectionSettings}
            disabled={savingSettings}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-4 shrink-0"
          >
            {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save Section Headings
          </Button>
        </div>

        {/* Badge Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">Badge Text (EN)</label>
            <Input
              value={sectionSettings.reviewsBadge}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsBadge: e.target.value })}
              placeholder="Client Testimonials"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">شارة القسم (عربي)</label>
            <Input
              value={sectionSettings.reviewsBadgeAr}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsBadgeAr: e.target.value })}
              placeholder="آراء العملاء والشركاء"
              dir="rtl"
              className="font-arabic"
            />
          </div>
        </div>

        {/* Main Title Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">Main Title (EN)</label>
            <Input
              value={sectionSettings.reviewsTitle}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsTitle: e.target.value })}
              placeholder="What Clients & Partners Say."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">العنوان الرئيسي (عربي)</label>
            <Input
              value={sectionSettings.reviewsTitleAr}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsTitleAr: e.target.value })}
              placeholder="ماذا يقول العملاء والشركاء."
              dir="rtl"
              className="font-arabic"
            />
          </div>
        </div>

        {/* Subtitle Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">Subtitle (EN)</label>
            <Textarea
              rows={2}
              value={sectionSettings.reviewsSubtitle}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsSubtitle: e.target.value })}
              placeholder="Authentic feedback and endorsements from engineering teams..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground block">الوصف التوضيحي (عربي)</label>
            <Textarea
              rows={2}
              value={sectionSettings.reviewsSubtitleAr}
              onChange={e => setSectionSettings({ ...sectionSettings, reviewsSubtitleAr: e.target.value })}
              placeholder="تجارب وآراء حقيقية من مؤسسين ومهندسين..."
              dir="rtl"
              className="font-arabic"
            />
          </div>
        </div>
      </div>

      {/* Reviews List Header & Counter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>Active Testimonials</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {reviews.length} Total
          </span>
        </h2>
      </div>

      {/* Reviews Cards List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border/70 rounded-2xl bg-card/30">
          <Quote className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-bold text-foreground">No testimonials added yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
            Click the button below to add your first client endorsement to the portfolio.
          </p>
          <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Plus size={15} /> Add First Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`group relative rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                review.isEnabled
                  ? 'bg-card border-border/80 shadow-xs hover:border-emerald-500/40'
                  : 'bg-muted/20 border-dashed border-border/60 opacity-60'
              }`}
            >
              {/* Card Header: Avatar + Identity + Order buttons */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar circle */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/80 bg-muted shrink-0 shadow-xs">
                      {review.avatarUrl ? (
                        <img
                          src={getMediaUrl(review.avatarUrl)}
                          alt={review.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-sm">
                        {review.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-foreground line-clamp-1">{review.name}</h3>
                      {review.nameAr && (
                        <p className="text-xs text-muted-foreground line-clamp-1 font-arabic" dir="rtl">{review.nameAr}</p>
                      )}
                      <p className="text-[11px] font-medium text-muted-foreground line-clamp-1 mt-0.5">
                        {review.role}
                      </p>
                      {(review.linkedinUrl || review.githubUrl) && (
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                          {review.linkedinUrl && <span className="bg-muted px-1.5 py-0.5 rounded">LinkedIn</span>}
                          {review.githubUrl && <span className="bg-muted px-1.5 py-0.5 rounded">GitHub</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ordering Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === reviews.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Review Text Body */}
                <div className="space-y-2 mt-3 pt-3 border-t border-border/40">
                  <p className="text-xs text-foreground/90 italic leading-relaxed line-clamp-4">
                    "{review.content}"
                  </p>
                  {review.contentAr && (
                    <p className="text-xs text-muted-foreground/90 italic leading-relaxed line-clamp-3 font-arabic" dir="rtl">
                      "{review.contentAr}"
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleEnabled(review)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    review.isEnabled
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {review.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{review.isEnabled ? 'Visible' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(review)}
                    className="h-7 px-2.5 text-xs gap-1"
                  >
                    <Edit3 size={12} /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReview(review.id, review.name)}
                    className="h-7 w-7 p-0 text-xs"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Quote size={18} className="text-emerald-500" />
                <span>{editingReview ? 'Edit Testimonial' : 'Add New Testimonial'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveReview} className="space-y-4">
              {/* Row 1: Name EN & AR */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    Person Name (EN) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    الاسم (عربي)
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: سارة جنكينز"
                    dir="rtl"
                    className="font-arabic"
                  />
                </div>
              </div>

              {/* Row 2: Role EN & AR */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    Role / Position (EN) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Registered Nurse / Product Lead"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    المسمى الوظيفي / الدور (عربي)
                  </label>
                  <Input
                    value={formData.roleAr}
                    onChange={e => setFormData({ ...formData, roleAr: e.target.value })}
                    placeholder="مثال: مديرة منتج / أخصائية سريرية"
                    dir="rtl"
                    className="font-arabic"
                  />
                </div>
              </div>

              {/* Row 3: Social Links (LinkedIn & GitHub) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    LinkedIn Profile URL
                  </label>
                  <Input
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">
                    GitHub Profile URL
                  </label>
                  <Input
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              {/* Row 4: Avatar Upload & Direct URL */}
              <div className="space-y-2 pt-1 border-t border-border/40">
                <label className="text-xs font-semibold text-foreground block">
                  Avatar Image (Photo)
                </label>
                <div className="flex items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-border/80 bg-muted shrink-0 shadow-sm">
                    {formData.avatarUrl ? (
                      <img
                        src={getMediaUrl(formData.avatarUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-500/20 text-emerald-600 font-bold flex items-center justify-center text-base">
                        {formData.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>

                  {/* Upload Button + File Input */}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="gap-1.5 text-xs h-8"
                      >
                        {uploadingAvatar ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        <span>{uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}</span>
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    <Input
                      value={formData.avatarUrl}
                      onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="Or enter direct image URL / path..."
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Review Text (EN) */}
              <div className="space-y-1 pt-1 border-t border-border/40">
                <label className="text-xs font-semibold text-foreground block">
                  Review / Testimonial (EN) <span className="text-destructive">*</span>
                </label>
                <Textarea
                  required
                  rows={3}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="What did they say about your collaboration, deliverables, or impact?"
                />
              </div>

              {/* Row 6: Review Text (AR) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">
                  نص الرأي والشهادة (عربي)
                </label>
                <Textarea
                  rows={3}
                  value={formData.contentAr}
                  onChange={e => setFormData({ ...formData, contentAr: e.target.value })}
                  placeholder="اكتب الشهادة أو التقييم باللغة العربية..."
                  dir="rtl"
                  className="font-arabic"
                />
              </div>

              {/* Row 7: Enabled & Order */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={e => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="rounded border-border text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Display on portfolio (Enabled)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-muted-foreground">Order:</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-20 text-xs h-8"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={savingReview}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingReview || uploadingAvatar}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                >
                  {savingReview ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingReview ? 'Save Changes' : 'Add Testimonial'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
