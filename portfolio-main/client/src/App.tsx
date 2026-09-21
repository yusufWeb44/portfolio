import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages (Home eager for instant first paint, others lazy)
import Home from './pages/Home';
const ProjectsPage = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Experience = lazy(() => import('./pages/Experience'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Demo = lazy(() => import('./demo'));

// Admin Pages (Lazy loaded so visitors don't download admin code)
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminSkills = lazy(() => import('./pages/admin/Skills'));
const AdminExperience = lazy(() => import('./pages/admin/Experience'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminAbout = lazy(() => import('./pages/admin/About'));
const AdminWorkflow = lazy(() => import('./pages/admin/Workflow'));
const AdminCertificates = lazy(() => import('./pages/admin/Certificates'));
const AdminFaqs = lazy(() => import('./pages/admin/Faqs'));
const AdminSeo = lazy(() => import('./pages/admin/Seo'));
const AdminTranslations = lazy(() => import('./pages/admin/Translations'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <LazyMotion features={domAnimation} strict={false}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="skills" element={<Skills />} />
              <Route path="experience" element={<Experience />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="demo" element={<Demo />} />
            </Route>

            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="workflow" element={<AdminWorkflow />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="seo" element={<AdminSeo />} />
              <Route path="translations" element={<AdminTranslations />} />
            </Route>
          </Routes>
        </Suspense>
      </LazyMotion>
    </Router>
  );
}

export default App;

