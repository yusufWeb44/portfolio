import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const DEFAULT_QUICK_LINKS = [
  { id: '1', label: 'About Me', labelAr: 'من أنا ورؤيتي', url: '#about', isEnabled: true, order: 1 },
  { id: '2', label: 'Featured Projects', labelAr: 'أعمالي ومشاريعي', url: '#projects', isEnabled: true, order: 2 },
  { id: '3', label: 'Skills & Stack', labelAr: 'المهارات والخبرات', url: '#skills', isEnabled: true, order: 3 },
  { id: '4', label: 'Experience & Career', labelAr: 'المسيرة المهنية', url: '#experience', isEnabled: true, order: 4 },
  { id: '5', label: 'Contact Me', labelAr: 'تواصل معي', url: '#contact', isEnabled: true, order: 5 },
];

const DEFAULT_SOCIAL_LINKS = [
  { id: '1', platform: 'GitHub', url: 'https://github.com', isEnabled: true },
  { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', isEnabled: true },
  { id: '3', platform: 'Instagram', url: 'https://instagram.com', isEnabled: true },
  { id: '4', platform: 'X', url: 'https://x.com', isEnabled: true },
];

export const getFooter = async (req: Request, res: Response) => {
  try {
    let footer = await prisma.footerSettings.findUnique({ where: { id: 'singleton' } });

    if (!footer) {
      // Pull base portfolio settings if available for default values
      const settings = await prisma.portfolioSettings.findUnique({ where: { id: 'singleton' } });

      footer = await prisma.footerSettings.create({
        data: {
          id: 'singleton',
          brandName: settings?.name || 'Yousef Ayoubi',
          brandNameAr: settings?.nameAr || 'يوسف الأيوبي',
          brandRole: 'Software Engineer',
          brandRoleAr: 'هندسة برمجيات',
          brandDescription: settings?.footerText || settings?.bio || 'Architecting scalable digital products & high-performance software systems.',
          brandDescriptionAr: settings?.footerTextAr || settings?.bioAr || 'مهندس برمجيات متخصص في بناء وتطوير الأنظمة البرمجية المتقدمة والتطبيقات السحابية وحلول الذكاء الاصطناعي بأعلى المعايير العالمية.',
          showSocialLinks: true,
          customSocialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),

          servicesTitle: 'Services',
          servicesTitleAr: 'خدماتي',
          servicesLinkText: 'All Services',
          servicesLinkTextAr: 'جميع الخدمات',
          servicesLinkUrl: '#services',
          servicesLimit: 4,
          showServicesCol: true,

          quickLinksTitle: 'Quick Links',
          quickLinksTitleAr: 'روابط سريعة',
          quickLinks: JSON.stringify(DEFAULT_QUICK_LINKS),
          showQuickLinksCol: true,

          contactTitle: 'Support & Contact',
          contactTitleAr: 'الدعم والتواصل',
          contactEmail: settings?.email || 'support@yousef.dev',
          contactLocation: settings?.location || 'Istanbul, Turkey',
          contactLocationAr: settings?.locationAr || 'إسطنبول، تركيا',
          contactPhone: settings?.whatsappNumber || '',
          availabilityText: settings?.availability || 'Available for select opportunities',
          availabilityTextAr: settings?.availabilityAr || 'متاح للفرص والمشاريع الجديدة',
          showContactCol: true,

          copyrightText: `All rights reserved © ${new Date().getFullYear()} Yousef Ayoubi.`,
          copyrightTextAr: `جميع الحقوق محفوظة © ${new Date().getFullYear()} يوسف الأيوبي.`,
          secondaryBadge: 'Clean Code • High Performance',
          secondaryBadgeAr: 'كود نظيف • أداء فائق',
          showBackToTop: true,
        }
      });
    }

    // Ensure customSocialLinks has default fallback if empty
    if (!footer.customSocialLinks) {
      footer = {
        ...footer,
        customSocialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS)
      };
    }

    res.json({ success: true, data: footer });
  } catch (error: any) {
    console.error('Fetch footer settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch footer settings', error: error?.message });
  }
};

export const updateFooter = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    // Delete id and timestamps if passed
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    // Stringify JSON fields if passed as array or object
    if (typeof data.quickLinks === 'object' && data.quickLinks !== null) {
      data.quickLinks = JSON.stringify(data.quickLinks);
    }
    if (typeof data.customSocialLinks === 'object' && data.customSocialLinks !== null) {
      data.customSocialLinks = JSON.stringify(data.customSocialLinks);
    }

    if (data.servicesLimit !== undefined) {
      data.servicesLimit = parseInt(data.servicesLimit, 10) || 4;
    }

    const footer = await prisma.footerSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    });

    res.json({ success: true, data: footer });
  } catch (error: any) {
    console.error('Update footer settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update footer settings', error: error?.message });
  }
};
