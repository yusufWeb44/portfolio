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
    const body = req.body || {};

    const allowedData: Record<string, any> = {
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription ?? '',
      keywords: body.keywords ?? null,
      author: body.author ?? null,
      ogTitle: body.ogTitle ?? null,
      ogDescription: body.ogDescription ?? null,
      ogImage: body.ogImage ?? null,
      ogType: body.ogType ?? null,
      twitterHandle: body.twitterHandle ?? null,
      twitterCardType: body.twitterCardType ?? null,
      canonicalUrl: body.canonicalUrl ?? null,
      robots: body.robots ?? null,
      structuredData:
        body.structuredData && typeof body.structuredData === 'object'
          ? JSON.stringify(body.structuredData)
          : body.structuredData ?? null,
      pageOverrides:
        body.pageOverrides && typeof body.pageOverrides === 'object'
          ? JSON.stringify(body.pageOverrides)
          : body.pageOverrides ?? null,
    };

    const seo = await prisma.seoSettings.upsert({
      where: { id: 'singleton' },
      update: allowedData,
      create: {
        id: 'singleton',
        metaTitle: allowedData.metaTitle || 'Yusuf Ayoubi | Software Developer & Engineer',
        metaDescription: allowedData.metaDescription || '',
        ...allowedData,
      },
    });

    res.json({ success: true, data: seo });
  } catch (error) {
    console.error('SEO Update Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update SEO settings', error });
  }
};