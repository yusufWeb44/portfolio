import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { applyCustomFonts } from '../utils/fontLoader';

export interface LanguageItem {
  id: string;
  languageCode: string;
  languageName: string;
  direction: 'ltr' | 'rtl';
  isDefault: boolean;
  isEnabled: boolean;
  data: string; // JSON string
}

interface LanguageContextType {
  currentLang: string;
  currentDirection: 'ltr' | 'rtl';
  availableLanguages: LanguageItem[];
  t: (path: string, fallback?: string) => string;
  setLanguage: (langCode: string) => void;
  refreshLanguages: () => Promise<void>;
  isLoading: boolean;
}

export const defaultEnTranslations: Record<string, string> = {
  "nav.about": "About",
  "nav.workflow": "Workflow",
  "nav.projects": "Projects",
  "nav.skills": "Skills",
  "nav.experience": "Experience",
  "nav.services": "Services",
  "nav.faq": "FAQ",
  "nav.contact": "Contact",
  "nav.startProject": "Start a project",

  "hero.greeting": "Available for Freelance & Consulting",
  "hero.headline": "End-to-End Web Development & Software Engineering",
  "hero.bio": "Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.",
  "hero.cta": "See My Work",
  "hero.contactCta": "Let's Talk",
  "hero.availability": "Available for Freelance & Consulting",
  "hero.resume": "Download CV",
  "hero.stats.experienceValue": "4+",
  "hero.stats.experienceLabel": "Years Experience",
  "hero.stats.projectsValue": "35+",
  "hero.stats.projectsLabel": "Completed Projects",
  "hero.stats.satisfactionValue": "100%",
  "hero.stats.satisfactionLabel": "Client Satisfaction",
  "hero.stats.uptimeValue": "99.9%",
  "hero.stats.uptimeLabel": "Code Quality & Uptime",
  "hero.typewriter.fullStack": "Full-Stack Developer",
  "hero.typewriter.softwareEngineer": "Software Engineer",
  "hero.typewriter.reactNext": "React & Next.js Specialist",
  "hero.typewriter.backendNode": "Node.js & API Architect",
  "hero.typewriter.uiUx": "Modern UI/UX Crafter",

  "about.badge": "About Me",
  "about.headline": "Crafting Scalable Software with Purpose & Precision.",
  "about.bio1": "I'm Yousef — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production. From custom CRMs and business operations platforms to high-performance web applications and scalable REST & GraphQL APIs.",
  "about.bio2": "My focus is on modern frontends (React, Next.js) paired with robust server-side architectures (Node.js) — with a sharp eye on performance, maintainability, and real business value delivery.",
  "about.coreStack": "Core Stack",
  "about.sayHello": "Say hello",
  "about.downloadCv": "Resume",
  "about.shippedProjects": "Projects shipped",
  "about.card1.title": "Clean Architecture",
  "about.card1.desc": "Maintainable, scalable codebases built on proven patterns. Every module, layer, and abstraction is intentional — with React, Next.js, and Node.js as the engineering backbone.",
  "about.card2.title": "Business-First Mindset",
  "about.card2.desc": "Software engineered to solve real operational bottlenecks and unlock growth. Custom CRMs, workflow automation, and APIs designed around measurable business outcomes — not just technical elegance.",
  "about.card3.title": "Performance & Reliability",
  "about.card3.desc": "Zero compromise on load speeds, database query optimization, and robust API architecture. Sub-second response times, efficient caching strategies, and battle-tested error handling baked in from day one.",
  "about.howIBuild": "How I Build.",
  "about.value1.label": "Performance-First",
  "about.value1.desc": "Fast by default. Every millisecond matters.",
  "about.value2.label": "Type Safety",
  "about.value2.desc": "TypeScript everywhere. Confident, self-documenting code.",
  "about.value3.label": "Ship Fast, Refine Often",
  "about.value3.desc": "Iterative delivery beats big-bang releases.",
  "about.value4.label": "Systems Thinking",
  "about.value4.desc": "Reusable, composable, maintainable architectures.",
  "about.philosophyQuote": "Great software is invisible to the user but impossible to ignore in its effects.",
  "about.philosophySub": "My engineering philosophy",
  "about.approachTitle": "My Approach.",
  "about.approach1.title": "Understand Deeply",
  "about.approach1.desc": "Before writing a line of code, I invest in understanding the problem, the user, and the business constraints.",
  "about.approach2.title": "Design for Scale",
  "about.approach2.desc": "I architect systems that can grow. Clean separation of concerns, clear interfaces, well-defined boundaries.",
  "about.approach3.title": "Deliver with Craft",
  "about.approach3.desc": "The final 20% matters. Smooth interactions, precise error handling, accessible markup, and optimized performance.",

  "workflow.badge": "Workflow & Methodology",
  "workflow.title": "How I Engineer Digital Products",
  "workflow.subtitle": "A structured, end-to-end development process ensuring total reliability and business alignment.",
  "workflow.step1.title": "Discovery & Scoping",
  "workflow.step1.desc": "Deep-dive into business requirements, user personas, technical constraints, and data models to define clear project deliverables.",
  "workflow.step2.title": "Architecture & Prototyping",
  "workflow.step2.desc": "Drafting database schemas, API contracts, system components, and high-fidelity wireframes before writing business logic.",
  "workflow.step3.title": "Full-Stack Development",
  "workflow.step3.desc": "Executing iterative milestones with clean TypeScript, robust state management, secure auth, and performant UI components.",
  "workflow.step4.title": "Testing & QA",
  "workflow.step4.desc": "Unit tests, integration audits, cross-browser compatibility checks, and load performance optimizations.",
  "workflow.step5.title": "Deployment & CI/CD",
  "workflow.step5.desc": "Automated build pipelines, environment configurations, edge caching, and seamless cloud deployments.",
  "workflow.step6.title": "Monitoring & Maintenance",
  "workflow.step6.desc": "Real-time telemetry, error tracking, database maintenance, and feature enhancements to support continuous scale.",

  "projects.badge": "Selected Works & Case Studies",
  "projects.title": "Featured Projects.",
  "projects.subtitle": "A curated selection of client projects, SaaS platforms, and enterprise solutions.",
  "projects.viewAll": "View all projects",
  "projects.viewCaseStudy": "View Case Study",
  "projects.liveDemo": "Live Demo",
  "projects.sourceCode": "Source Code",
  "projects.production": "PRODUCTION",
  "projects.filterAll": "All Projects",
  "projects.filterFeatured": "Featured",
  "projects.searchPlaceholder": "Search projects by title, stack, or category...",
  "projects.noProjects": "No projects found matching your search.",
  "projects.backToProjects": "Back to all projects",
  "projects.projectDetails": "Project Overview",
  "projects.challenge": "The Challenge",
  "projects.solution": "The Solution",
  "projects.keyFeatures": "Key Features",
  "projects.impact": "Impact & Results",
  "projects.technologies": "Technologies Used",
  "projects.year": "Year",
  "projects.category": "Category",
  "projects.role": "Role",

  "skills.badge": "Technical Arsenal & Core Stack",
  "skills.title": "Skills & Capabilities.",
  "skills.subtitle": "Full-stack systems engineered end-to-end with proven modern tools and architectural standards.",
  "skills.searchPlaceholder": "Search technologies, frameworks, tools...",
  "skills.point1.title": "Architecture First",
  "skills.point1.desc": "Clean domain boundaries, predictable data flows, and decoupled modular architectures that scale effortlessly.",
  "skills.point2.title": "Full-Cycle Delivery",
  "skills.point2.desc": "From database schema design and API contracts to pixel-perfect responsive user interfaces.",
  "skills.point3.title": "Production Resilience",
  "skills.point3.desc": "Defensive validation, resilient error boundaries, and observability built into every layer.",
  "skills.categories.all": "All Technologies",
  "skills.categories.frontend": "Frontend",
  "skills.categories.backend": "Backend & APIs",
  "skills.categories.database": "Databases",
  "skills.categories.devops": "DevOps & Cloud",
  "skills.categories.tools": "Tools & Utilities",

  "experience.badge": "Career History & Academic Journey",
  "experience.title": "Experience & Credentials.",
  "experience.subtitle": "A chronological journey detailing academic foundations, industry experience, high-impact software projects, and recognized industry credentials.",
  "experience.filterAll": "All Journey",
  "experience.filterWork": "Work & Contracts",
  "experience.filterEducation": "Academic Degrees",
  "experience.filterMilestones": "Milestones & Achievements",
  "experience.present": "Present",
  "experience.responsibilities": "Key Responsibilities & Deliverables",
  "experience.technologiesUsed": "Technologies Applied",
  "experience.certificatesTitle": "Professional Certifications",
  "experience.certificatesSubtitle": "Verified industry credentials and specialized technical achievements.",
  "experience.viewCredential": "Verify Credential",
  "experience.loading": "Loading career timeline...",

  "services.badge": "Consulting & Offerings",
  "services.title": "What I Deliver.",
  "services.subtitle": "End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.",
  "services.orderNumber": "Service",
  "services.startProject": "Request This Service",
  "services.chatWhatsapp": "Discuss via WhatsApp",
  "services.customConsultation": "Need a tailored solution? Let's discuss your specific scope.",
  "services.contactUs": "Contact Now",
  "services.noServices": "Services are being updated.",

  "faq.badge": "Got a question?",
  "faq.title": "Common Questions.",
  "faq.subtitle": "Got a question? Everything you need to know about working together, timelines, and deliverables.",
  "faq.categories.services": "Services & Scope",
  "faq.categories.process": "Process & Timeline",
  "faq.categories.tech": "Tech Stack & Quality",
  "faq.categories.collab": "Collaboration & Pricing",
  "faq.stillHaveQuestions": "Still have unanswered questions?",
  "faq.reachOut": "Reach out directly anytime",

  "contact.badge": "Get In Touch",
  "contact.headline": "Have an idea?",
  "contact.subheadline": "Let's talk.",
  "contact.subtitle": "Whether you need a full-stack application, a custom API, a modern dashboard, or a mobile app — I'm ready to bring your vision to life.",
  "contact.chatWhatsapp": "Chat on WhatsApp",
  "contact.sendEmail": "Send an Email",
  "contact.findMe": "Find me on",
  "contact.formTitle": "Send a Direct Message",
  "contact.nameLabel": "Your Name",
  "contact.namePlaceholder": "e.g. John Doe",
  "contact.emailLabel": "Your Email Address",
  "contact.emailPlaceholder": "e.g. john@example.com",
  "contact.subjectLabel": "Subject / Project Scope",
  "contact.subjectPlaceholder": "e.g. New Web Application Project",
  "contact.messageLabel": "Your Message",
  "contact.messagePlaceholder": "Describe your project, timeline, and key requirements...",
  "contact.submitButton": "Send Message",
  "contact.sending": "Sending message...",
  "contact.successTitle": "Message Sent Successfully!",
  "contact.successMessage": "Thank you for reaching out. I'll get back to you within 24 hours.",
  "contact.sendAnother": "Send another message",
  "contact.errorDefault": "Something went wrong. Please try again or reach out directly on WhatsApp.",
  "contact.directStatement": "Let's build something great together.",
  "contact.statementDesc": "Whether it's a new project, a consulting engagement, or a full-time opportunity — I'm always open to discussing high-impact ideas.",

  "footer.navigation": "Navigation",
  "footer.connect": "Connect",
  "footer.rights": "All rights reserved.",
  "footer.startProject": "Start a project",
  "footer.tagline": "Full-Stack Engineer crafting performant digital products and resilient software architectures.",

  "common.loading": "Loading...",
  "common.back": "Back",
  "common.close": "Close",
  "common.viewDetails": "View Details",
  "common.filter": "Filter",
  "common.search": "Search",
  "common.remote": "Remote / Worldwide",
  "common.fullStackEngineer": "Full-Stack Engineer"
};

export const flattenTranslations = (obj: any, prefix = ''): Record<string, string> => {
  if (!obj || typeof obj !== 'object') return {};
  const res: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(res, flattenTranslations(v, newKey));
    } else if (typeof v === 'string' || typeof v === 'number') {
      res[newKey] = String(v);
    }
  }
  return res;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableLanguages, setAvailableLanguages] = useState<LanguageItem[]>([]);
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('portfolio_lang') || 'en';
  });
  const [translationsMap, setTranslationsMap] = useState<Record<string, Record<string, any>>>({
    en: defaultEnTranslations
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/translations');
      if (res.data.success && res.data.data) {
        const rawList = res.data.data || [];
        const langs: LanguageItem[] = rawList.map((l: any) => ({
          id: l.id,
          languageCode: l.lang || l.languageCode || 'en',
          languageName: l.name || l.languageName || 'English',
          direction: (l.isRtl ? 'rtl' : (l.direction || 'ltr')) as 'ltr' | 'rtl',
          isDefault: !!l.isDefault,
          isEnabled: l.isEnabled !== false,
          data: l.data,
        }));
        setAvailableLanguages(langs);

        const newMap: Record<string, Record<string, any>> = { en: defaultEnTranslations };
        langs.forEach((l) => {
          try {
            const raw = typeof l.data === 'string' ? JSON.parse(l.data) : (l.data || {});
            const flattened = flattenTranslations(raw);
            newMap[l.languageCode] = { ...raw, ...flattened };
          } catch {
            newMap[l.languageCode] = {};
          }
        });
        setTranslationsMap(newMap);

        // If stored language not in enabled list, fallback to default
        const active = langs.find((l) => l.languageCode === currentLang);
        if (!active) {
          const def = langs.find((l) => l.isDefault) || langs[0];
          if (def) {
            setCurrentLang(def.languageCode);
            localStorage.setItem('portfolio_lang', def.languageCode);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load translations, using defaults', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const activeLangObj = availableLanguages.find((l) => l.languageCode === currentLang);
  const currentDirection = activeLangObj?.direction || (currentLang === 'ar' ? 'rtl' : 'ltr');

  // Update HTML document attributes and active font family when language changes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentDirection;
    if (currentDirection === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }

    try {
      const cached = localStorage.getItem('portfolio_settings');
      if (cached) {
        applyCustomFonts(JSON.parse(cached));
      }
    } catch {}
  }, [currentLang, currentDirection]);

  const setLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('portfolio_lang', langCode);
  };

  const t = (path: string, fallback?: string): string => {
    const currentDict = translationsMap[currentLang];
    const fallbackDict = translationsMap['en'] || defaultEnTranslations;

    // Helper to traverse object or direct key
    const getVal = (obj: any): string | undefined => {
      if (!obj || typeof obj !== 'object') return undefined;

      // 1. Direct match (e.g. "nav.about")
      if (path in obj && typeof obj[path] === 'string') {
        return obj[path];
      }

      // 2. Nested traversal (e.g. obj.nav.about)
      const keys = path.split('.');
      let cur = obj;
      for (const k of keys) {
        if (cur && typeof cur === 'object' && k in cur) {
          cur = cur[k];
        } else {
          return undefined;
        }
      }
      return typeof cur === 'string' ? cur : undefined;
    };

    const val = getVal(currentDict);
    if (val !== undefined && val !== '') return val;

    const fallbackVal = getVal(fallbackDict);
    if (fallbackVal !== undefined && fallbackVal !== '') return fallbackVal;

    return fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentDirection,
        availableLanguages,
        t,
        setLanguage,
        refreshLanguages: fetchLanguages,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguage = useTranslation;
export default LanguageContext;
