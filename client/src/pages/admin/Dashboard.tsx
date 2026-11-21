import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FolderKanban,
  MessageSquare,
  Briefcase,
  Award,
  Terminal,
  Wrench,
  Sparkles,
  Layers,
  Pin,
  HelpCircle,
  MessageSquareQuote,
  Globe,
  Languages,
  ShieldCheck,
  Settings,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Mail,
  Star,
  CheckCircle2,
  PanelBottom
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveImageUrl } from '../../utils/mediaUrl';

interface Stats {
  projects: { total: number; published: number; draft: number; featured: number };
  messages: { total: number; unread: number };
  experience: number;
  certificates: number;
  skills: number;
  services: number;
  faqs: number;
  reviews: number;
  workflow: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface RecentProject {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  category: string;
  categoryAr?: string | null;
  year?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  images: Array<{ url: string; isCover?: boolean }>;
}

export default function Dashboard() {
  const { currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const [
        projRes,
        msgRes,
        expRes,
        certRes,
        skillRes,
        servRes,
        faqRes,
        revRes,
        wfRes,
      ] = await Promise.allSettled([
        api.get('/projects'),
        api.get('/messages'),
        api.get('/experience'),
        api.get('/certificates'),
        api.get('/skills'),
        api.get('/services'),
        api.get('/faqs'),
        api.get('/reviews'),
        api.get('/workflow'),
      ]);

      const projectsData = projRes.status === 'fulfilled' ? projRes.value.data?.data || [] : [];
      const messagesData = msgRes.status === 'fulfilled' ? msgRes.value.data?.data || [] : [];
      const expData = expRes.status === 'fulfilled' ? expRes.value.data?.data || [] : [];
      const certData = certRes.status === 'fulfilled' ? certRes.value.data?.data || [] : [];
      const skillData = skillRes.status === 'fulfilled' ? skillRes.value.data?.data || [] : [];
      const servData = servRes.status === 'fulfilled' ? servRes.value.data?.data || [] : [];
      const faqData = faqRes.status === 'fulfilled' ? faqRes.value.data?.data || [] : [];
      const revData = revRes.status === 'fulfilled' ? revRes.value.data?.data || [] : [];
      const wfData = wfRes.status === 'fulfilled' ? wfRes.value.data?.data || [] : [];

      setStats({
        projects: {
          total: projectsData.length,
          published: projectsData.filter((p: RecentProject) => p.isPublished).length,
          draft: projectsData.filter((p: RecentProject) => !p.isPublished).length,
          featured: projectsData.filter((p: RecentProject) => p.isFeatured).length,
        },
        messages: {
          total: messagesData.length,
          unread: messagesData.filter((m: RecentMessage) => !m.isRead).length,
        },
        experience: expData.length,
        certificates: certData.length,
        skills: skillData.length,
        services: servData.length,
        faqs: faqData.length,
        reviews: revData.length,
        workflow: wfData.length,
      });

      setRecentMessages(messagesData.slice(0, 4));
      setRecentProjects(projectsData.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch dashboard overview data', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format relative or calendar date cleanly
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return isAr ? 'منذ قليل' : 'Just now';
      if (diffHours < 24) return isAr ? `منذ ${diffHours} س` : `${diffHours}h ago`;
      if (diffDays === 1) return isAr ? 'أمس' : 'Yesterday';
      if (diffDays < 7) return isAr ? `منذ ${diffDays} أيام` : `${diffDays}d ago`;

      return date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const navCategories = [
    {
      groupTitle: isAr ? 'المحتوى والهوية' : 'Identity & Narrative',
      items: [
        { label: isAr ? 'الواجهة والهيرو' : 'Hero & Bio', path: '/admin/hero', icon: Sparkles },
        { label: isAr ? 'قسم من أنا' : 'About Section', path: '/admin/about', icon: Layers },
        { label: isAr ? 'منهجية العمل' : 'Workflow Steps', path: '/admin/workflow', icon: Pin },
        { label: isAr ? 'التذييل وروابطه' : 'Footer Section', path: '/admin/footer', icon: PanelBottom },
      ],
    },
    {
      groupTitle: isAr ? 'الأعمال والمؤهلات' : 'Portfolio & Credentials',
      items: [
        { label: isAr ? 'المشاريع' : 'Projects Hub', path: '/admin/projects', icon: FolderKanban },
        { label: isAr ? 'المهارات والتقنيات' : 'Skills & Stack', path: '/admin/skills', icon: Terminal },
        { label: isAr ? 'المسيرة المهنية' : 'Experience', path: '/admin/experience', icon: Briefcase },
        { label: isAr ? 'الشهادات المعتمدة' : 'Certificates', path: '/admin/certificates', icon: Award },
        { label: isAr ? 'خدمات الأعمال' : 'Services', path: '/admin/services', icon: Wrench },
      ],
    },
    {
      groupTitle: isAr ? 'التفاعل والنظام' : 'Engagement & System',
      items: [
        { label: isAr ? 'الرسائل والوارد' : 'Messages Inbox', path: '/admin/messages', icon: MessageSquare },
        { label: isAr ? 'آراء العملاء' : 'Reviews & Feedback', path: '/admin/reviews', icon: MessageSquareQuote },
        { label: isAr ? 'الأسئلة الشائعة' : 'FAQs', path: '/admin/faqs', icon: HelpCircle },
        { label: isAr ? 'محرك SEO' : 'SEO Settings', path: '/admin/seo', icon: Globe },
        { label: isAr ? 'الترجمة والتوطين' : 'Translations', path: '/admin/translations', icon: Languages },
        { label: isAr ? 'الأمان والحساب' : 'Security', path: '/admin/security', icon: ShieldCheck },
        { label: isAr ? 'الإعدادات العامة' : 'General Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="w-full space-y-8" dir={currentDirection}>
      <Helmet>
        <title>{isAr ? 'مركز القيادة والنظرة العامة | لوحة الإدارة' : 'Overview & Telemetry | Admin Command Center'}</title>
      </Helmet>

      {/* ── 1. Command Header Bar with Live Telemetry ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300">
              {isAr ? 'مركز القيادة // النظام متصل' : 'TELEMETRY // SYSTEM CONNECTED'}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-emerald-400">
              {isAr ? 'الإنتاج نشط' : 'PRODUCTION LIVE'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
            {isAr ? 'نظرة عامة على المحتوى' : 'Overview & Telemetry'}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            {isAr
              ? 'متابعة شاملة لإحصائيات البورتفوليو، أحدث استفسارات التواصل، حالة المشاريع المنشورة، ومصفوفة التحكم السريع.'
              : 'Real-time telemetry, inbound communication pulse, project publication state, and unified control directory.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-mono uppercase tracking-wider rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-[0.98] cursor-pointer"
            aria-label={isAr ? 'تحديث البيانات' : 'Refresh Telemetry'}
          >
            <RefreshCw size={14} strokeWidth={1.5} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            <Plus size={14} strokeWidth={1.5} />
            <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-[0.98]"
          >
            <span>{isAr ? 'الموقع الحي' : 'Live Site'}</span>
            <ArrowUpRight size={14} strokeWidth={1.5} className="rtl:rotate-[-90deg]" />
          </a>
        </div>
      </div>

      {/* ── 2. Metric Grid (4 Perfectly Balanced, Spacious Cards) ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-card/60 border border-border/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Projects Hub */}
          <Link
            to="/admin/projects"
            className="group relative overflow-hidden rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-200 hover:border-white/[0.18] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  {isAr ? 'المشاريع المنشورة' : 'Projects Portfolio'}
                </span>
                <div className="p-1.5 rounded-md border border-white/[0.06] bg-zinc-800/40 text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  <FolderKanban size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-medium tracking-tight text-zinc-100">
                  {stats?.projects.total ?? 0}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {isAr ? 'دراسة حالة' : 'Case studies'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-emerald-950 rounded bg-emerald-950/40 text-emerald-400">
                {stats?.projects.published ?? 0} {isAr ? 'منشور' : 'Live'}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-400">
                {stats?.projects.draft ?? 0} {isAr ? 'مسودة' : 'Draft'}
              </span>
              {(stats?.projects.featured ?? 0) > 0 && (
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-amber-950 rounded bg-amber-950/40 text-amber-300">
                  {stats?.projects.featured} {isAr ? 'مميز' : 'Starred'}
                </span>
              )}
            </div>
          </Link>

          {/* Card 2: Inbound Messages */}
          <Link
            to="/admin/messages"
            className="group relative overflow-hidden rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-200 hover:border-white/[0.18] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  {isAr ? 'صندوق الوارد والرسائل' : 'Inbound Messages'}
                </span>
                <div className="p-1.5 rounded-md border border-white/[0.06] bg-zinc-800/40 text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  <MessageSquare size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-medium tracking-tight text-zinc-100">
                  {stats?.messages.total ?? 0}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {isAr ? 'استفسار تواصل' : 'Inquiries'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              {(stats?.messages.unread ?? 0) > 0 ? (
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-blue-900 rounded bg-blue-950/50 text-blue-300">
                  {stats?.messages.unread} {isAr ? 'غير مقروءة' : 'Unread'}
                </span>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-400">
                  {isAr ? 'البريد مكتمل' : 'All Read'}
                </span>
              )}
              <span className="text-xs font-mono text-zinc-500">
                {isAr ? 'نموذج الموقع' : 'Public form'}
              </span>
            </div>
          </Link>

          {/* Card 3: Experience & Certifications */}
          <Link
            to="/admin/experience"
            className="group relative overflow-hidden rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-200 hover:border-white/[0.18] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  {isAr ? 'المسيرة والاعتمادات' : 'Career & Credentials'}
                </span>
                <div className="p-1.5 rounded-md border border-white/[0.06] bg-zinc-800/40 text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  <Briefcase size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-medium tracking-tight text-zinc-100">
                  {(stats?.experience ?? 0) + (stats?.certificates ?? 0)}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {isAr ? 'سجل مهني' : 'Records'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300">
                {stats?.experience ?? 0} {isAr ? 'محطة' : 'Roles'}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300">
                {stats?.certificates ?? 0} {isAr ? 'شهادة' : 'Certs'}
              </span>
            </div>
          </Link>

          {/* Card 4: Technical Stack & Capabilities */}
          <Link
            to="/admin/skills"
            className="group relative overflow-hidden rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)] transition-all duration-200 hover:border-white/[0.18] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  {isAr ? 'المهارات والخدمات' : 'Stack & Services'}
                </span>
                <div className="p-1.5 rounded-md border border-white/[0.06] bg-zinc-800/40 text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  <Terminal size={16} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-medium tracking-tight text-zinc-100">
                  {(stats?.skills ?? 0) + (stats?.services ?? 0)}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {isAr ? 'عنصر تقني' : 'Capabilities'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300">
                {stats?.skills ?? 0} {isAr ? 'مهارة' : 'Skills'}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-300">
                {stats?.services ?? 0} {isAr ? 'خدمة' : 'Services'}
              </span>
              {(stats?.reviews ?? 0) > 0 && (
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-400">
                  {stats?.reviews} {isAr ? 'آراء' : 'Reviews'}
                </span>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* ── 3. Asymmetric Deep Telemetry & Command Section (7 / 5 Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Inbound Stream + Project Status */}
        <div className="lg:col-span-7 space-y-6">
          {/* Inbound Messages Stream */}
          <div className="rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Mail size={16} strokeWidth={1.5} className="text-zinc-400" />
                <h2 className="text-base font-medium tracking-tight text-zinc-100">
                  {isAr ? 'آخر استفسارات التواصل الواردة' : 'Recent Inbound Messages'}
                </h2>
              </div>
              <Link
                to="/admin/messages"
                className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors inline-flex items-center gap-1"
              >
                <span>{isAr ? 'عرض الكل' : 'View Inbox'}</span>
                <ArrowUpRight size={12} strokeWidth={1.5} className="rtl:rotate-[-90deg]" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-zinc-800/30 animate-pulse" />
                ))}
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/[0.07] rounded-lg bg-zinc-950/40">
                <Mail size={24} strokeWidth={1.5} className="mx-auto text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400 font-medium">
                  {isAr ? 'لا توجد رسائل واردة حالياً' : 'Inbox is currently clear'}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  {isAr
                    ? 'أي استفسار يُرسل من نموذج التواصل سيصل إلى هنا مباشرة.'
                    : 'Submissions through the public contact form will stream here in real time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    to="/admin/messages"
                    className="group block p-3.5 rounded-lg border border-white/[0.05] bg-zinc-950/40 hover:bg-zinc-800/40 hover:border-white/[0.12] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-medium text-zinc-200 truncate">
                            {msg.name}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500 truncate dir-ltr">
                            {msg.email}
                          </span>
                          {!msg.isRead && (
                            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.2 border border-blue-900 rounded bg-blue-950/60 text-blue-300">
                              {isAr ? 'جديد' : 'NEW'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-300 font-medium truncate">
                          {msg.subject || (isAr ? 'بدون عنوان' : 'No subject')}
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {msg.content}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0 whitespace-nowrap">
                        {formatTimeAgo(msg.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Projects Showcase */}
          <div className="rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <FolderKanban size={16} strokeWidth={1.5} className="text-zinc-400" />
                <h2 className="text-base font-medium tracking-tight text-zinc-100">
                  {isAr ? 'أحدث المشاريع وحالة العرض' : 'Recent Projects & Deployment'}
                </h2>
              </div>
              <Link
                to="/admin/projects"
                className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors inline-flex items-center gap-1"
              >
                <span>{isAr ? 'إدارة المشاريع' : 'Manage All'}</span>
                <ArrowUpRight size={12} strokeWidth={1.5} className="rtl:rotate-[-90deg]" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-zinc-800/30 animate-pulse" />
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/[0.07] rounded-lg bg-zinc-950/40">
                <p className="text-sm text-zinc-400">
                  {isAr ? 'لا توجد مشاريع مضافة حتى الآن.' : 'No projects published yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentProjects.map((p) => {
                  const cover = p.images?.find((img) => img.isCover)?.url || p.images?.[0]?.url;
                  const displayTitle = isAr ? p.titleAr || p.title : p.title;
                  const displayCategory = isAr ? p.categoryAr || p.category : p.category;

                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/[0.05] bg-zinc-950/40 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md border border-white/[0.08] bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center">
                          {cover ? (
                            <img
                              src={resolveImageUrl(cover)}
                              alt={displayTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <FolderKanban size={16} strokeWidth={1.5} className="text-zinc-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-medium text-zinc-200 truncate">
                              {displayTitle}
                            </h3>
                            {p.isFeatured && (
                              <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block truncate">
                            {displayCategory} {p.year ? `// ${p.year}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {p.isPublished ? (
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-emerald-950 rounded bg-emerald-950/40 text-emerald-400">
                            {isAr ? 'منشور' : 'LIVE'}
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-400">
                            {isAr ? 'مسودة' : 'DRAFT'}
                          </span>
                        )}

                        <Link
                          to="/admin/projects"
                          className="font-mono text-[11px] text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800/50 transition-colors"
                          aria-label={`Edit ${displayTitle}`}
                        >
                          <ArrowUpRight size={14} strokeWidth={1.5} className="rtl:rotate-[-90deg]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Categorized CMS Command Matrix & System Health */}
        <div className="lg:col-span-5 space-y-6">
          {/* Categorized Command Matrix */}
          <div className="rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.06]">
              <Sparkles size={16} strokeWidth={1.5} className="text-zinc-400" />
              <h2 className="text-base font-medium tracking-tight text-zinc-100">
                {isAr ? 'مصفوفة التحكم والتنقل' : 'Control Directory'}
              </h2>
            </div>

            <div className="space-y-5">
              {navCategories.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block px-1">
                    {group.groupTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          to={item.path}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/[0.05] bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-white/[0.12] transition-all duration-200 group text-zinc-300 hover:text-zinc-100"
                        >
                          <Icon
                            size={14}
                            strokeWidth={1.5}
                            className="text-zinc-400 group-hover:text-emerald-400 transition-colors shrink-0"
                          />
                          <span className="text-xs font-medium truncate">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System & Architecture Health Checklist */}
          <div className="rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 border border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
              <ShieldCheck size={16} strokeWidth={1.5} className="text-zinc-400" />
              <h2 className="text-base font-medium tracking-tight text-zinc-100">
                {isAr ? 'سلامة النظام والبيئة' : 'Architecture & Security'}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isAr ? 'قاعدة البيانات' : 'Database Engine'}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} strokeWidth={1.5} /> MySQL / Prisma
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isAr ? 'التوطين اللغوي' : 'Language Sync'}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} strokeWidth={1.5} /> EN + AR Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isAr ? 'محرك المظهر' : 'Theme Engine'}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} strokeWidth={1.5} /> Dark / Light 120 FPS
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isAr ? 'أمن الترويسات ومعدل الطلب' : 'Security Headers & Limit'}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} strokeWidth={1.5} /> Helmet + RateLimiter
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{isAr ? 'استجابة الـ Cold-Start' : 'Cold-Start Resilience'}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} strokeWidth={1.5} /> Skeletons & Cache Guard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
