import { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LogOut, LayoutDashboard, FolderKanban, Briefcase, Wrench, 
  MessageSquare, Settings, Menu, X, ArrowLeft, Terminal,
  Layers, Pin, Award, HelpCircle, Globe, Languages 
} from 'lucide-react';
import { clsx } from 'clsx';
import { Helmet } from 'react-helmet-async';

const AdminLayout = () => {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const contentNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={17} /> },
    { label: 'Hero & Settings', path: '/admin/settings', icon: <Settings size={17} /> },
    { label: 'About Section', path: '/admin/about', icon: <Layers size={17} /> },
    { label: 'Workflow Steps', path: '/admin/workflow', icon: <Pin size={17} /> },
    { label: 'Projects', path: '/admin/projects', icon: <FolderKanban size={17} /> },
    { label: 'Skills', path: '/admin/skills', icon: <Terminal size={17} /> },
    { label: 'Experience', path: '/admin/experience', icon: <Briefcase size={17} /> },
    { label: 'Certificates', path: '/admin/certificates', icon: <Award size={17} /> },
    { label: 'Services', path: '/admin/services', icon: <Wrench size={17} /> },
    { label: 'FAQs', path: '/admin/faqs', icon: <HelpCircle size={17} /> },
  ];

  const systemNavItems = [
    { label: 'Messages', path: '/admin/messages', icon: <MessageSquare size={17} /> },
    { label: 'SEO Hub', path: '/admin/seo', icon: <Globe size={17} /> },
    { label: 'Translations', path: '/admin/translations', icon: <Languages size={17} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-border/40 shrink-0">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-foreground text-background rounded flex items-center justify-center font-bold font-serif">Y</div>
          <div>
            <span className="font-bold tracking-tight text-base block leading-none">Yusuf CMS</span>
            <span className="text-[10px] text-muted-foreground">Admin Control Center</span>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">Portfolio Content</p>
          <nav className="space-y-0.5">
            {contentNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium",
                    isActive 
                      ? "bg-foreground text-background font-bold shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">Growth &amp; Settings</p>
          <nav className="space-y-0.5">
            {systemNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium",
                    isActive 
                      ? "bg-foreground text-background font-bold shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold uppercase">
            {user?.email?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/20 font-sans selection:bg-foreground selection:text-background">
      <Helmet>
        <title>Admin Dashboard | Yusuf</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-72 max-w-[80%] bg-card h-full flex flex-col shadow-2xl border-r border-border animate-in slide-in-from-left duration-300">
            <button 
              className="absolute top-6 right-4 p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top bar for mobile / quick actions */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to public site</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Contextual actions could go here */}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
