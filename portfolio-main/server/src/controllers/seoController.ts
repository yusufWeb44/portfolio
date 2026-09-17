import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSeo = async (req: Request, res: Response) => {
  try {
    let seo = await prisma.seoSettings.findUnique({ where: { id: 'singleton' } });
    if (!seo) {
      seo = await prisma.seoSettings.create({
        data: {
          id: 'singleton',
          metaTitle: 'Yusuf Ayoubi | Software Developer & Engineer',
          metaDescription: 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses.',
          keywords: 'Software Engineer, Full-Stack Developer, React, Next.js, Node.js, TypeScript',
          author: 'Yusuf Ayoubi',
          ogTitle: 'Yusuf Ayoubi | Full-Stack Software Engineer',
          ogDescription: 'End-to-End Web Development, Custom CRMs, and High-Performance APIs.',
          ogType: 'website',
          robots: 'index, follow'
        }
      });
    }
    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch SEO settings', error });
  }
};

export const updateSeo = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (typeof data.structuredData === 'object') data.structuredData = JSON.stringify(data.structuredData);
    if (typeof data.pageOverrides === 'object') data.pageOverrides = JSON.stringify(data.pageOverrides);

    const seo = await prisma.seoSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    });
    res.json({ success: true, data: seo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update SEO settings', error });
  }
};
