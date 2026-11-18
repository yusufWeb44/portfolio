import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FolderKanban, 
  MessageSquare, 
  Briefcase, 
  Terminal, 
  Wrench,
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

interface Stats {
  projects: { total: number; published: number; draft: number };
  messages: { total: number; unread: number };
  experience: number;
  certificates: number;
  skills: number;
  services: number;
}

const Dashboard = () => {
  const { currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, msgRes, expRes, certRes, skillRes, servRes] = await Promise.all([
          api.get('/projects'),
          api.get('/messages'),
          api.get('/experience'),
          api.get('/certificates'),
          api.get('/skills'),
          api.get('/services')
        ]);
        
        const projects = projRes.data.data;
        const messages = msgRes.data.data;

        setStats({
          projects: {
            total: projects.length,
            published: projects.filter((p: any) => p.isPublished).length,
            draft: projects.filter((p: any) => !p.isPublished).length
          },
          messages: {
            total: messages.length,
            unread: messages.filter((m: any) => !m.isRead).length
          },
          experience: expRes.data.data.length,
          certificates: certRes.data.data.length,
          skills: skillRes.data.data.length,
          services: servRes.data.data.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      title: isAr ? 'المشاريع' : 'Projects',
      value: stats.projects.total,
      icon: <FolderKanban className="text-muted-foreground" size={20} />,
      link: '/admin/projects',
      details: (
        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t border-border">
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Eye size={14} /> {stats.projects.published} {isAr ? 'منشورة' : 'Published'}
          </span>
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <EyeOff size={14} /> {stats.projects.draft} {isAr ? 'مسودات' : 'Drafts'}
          </span>
        </div>
      )
    },
    {
      title: isAr ? 'الرسائل' : 'Messages',
      value: stats.messages.total,
      icon: <MessageSquare className="text-muted-foreground" size={20} />,
      link: '/admin/messages',
      details: (
        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t border-border">
          <span className={stats.messages.unread > 0 ? "flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold" : "flex items-center gap-1 text-muted-foreground"}>
            <div className={`w-2 h-2 rounded-full ${stats.messages.unread > 0 ? 'bg-blue-500 animate-pulse' : 'bg-muted-foreground'}`}></div>
            {stats.messages.unread} {isAr ? 'غير مقروءة' : 'Unread'}
          </span>
        </div>
      )
    },
    {
      title: isAr ? 'الخبرات والشهادات' : 'Experience & Certs',
      value: stats.experience + stats.certificates,
      icon: <Briefcase className="text-muted-foreground" size={20} />,
      link: '/admin/experience',
      details: (
        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t border-border text-muted-foreground">
          <span>{stats.experience} {isAr ? 'محطة' : 'Milestones'}</span>
          <span>•</span>
          <span>{stats.certificates} {isAr ? 'شهادة' : 'Certificates'}</span>
        </div>
      )
    },
    {
      title: isAr ? 'المهارات والتقنيات' : 'Skills',
      value: stats.skills,
      icon: <Terminal className="text-muted-foreground" size={20} />,
      link: '/admin/skills',
      details: (
        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t border-border text-muted-foreground">
          <span className="flex items-center gap-1">
            {isAr ? 'تقنية مسجلة' : 'Tracked technologies'}
          </span>
        </div>
      )
    },
    {
      title: isAr ? 'الخدمات' : 'Services',
      value: stats.services,
      icon: <Wrench className="text-muted-foreground" size={20} />,
      link: '/admin/services',
      details: (
        <div className="flex items-center gap-4 text-xs mt-4 pt-4 border-t border-border text-muted-foreground">
          <span className="flex items-center gap-1">
            {isAr ? 'خدمات معروضة' : 'Service offerings'}
          </span>
        </div>
      )
    }
  ] : [];

  return (
    <div dir={currentDirection}>
      <Helmet>
        <title>{isAr ? 'نظرة عامة | لوحة الإدارة' : 'Overview | Admin Dashboard'}</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isAr ? 'نظرة عامة' : 'Overview'}
        </h1>
        <p className="text-muted-foreground">
          {isAr ? 'مرحباً بك مجدداً في مركز القيادة وإدارة محتوى البورتفوليو.' : 'Welcome back to your portfolio command center.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 h-40"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-4xl font-bold tracking-tighter">{card.value}</h3>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                  {card.icon}
                </div>
              </div>
              
              <div className="mt-auto">
                {card.details}
              </div>

              <Link 
                to={card.link}
                className="absolute inset-0 z-10"
                aria-label={`Go to ${card.title}`}
              >
                <span className="sr-only">Go to {card.title}</span>
              </Link>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold tracking-tight mb-4">
            {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/projects" className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
              {isAr ? '+ إضافة مشروع جديد' : '+ New Project'}
            </Link>
            <Link to="/admin/hero" className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors">
              {isAr ? 'قسم الواجهة والإحصائيات' : 'Hero & Stats'}
            </Link>
            <Link to="/admin/settings" className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors">
              {isAr ? 'الإعدادات العامة والمظهر' : 'General Settings'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
