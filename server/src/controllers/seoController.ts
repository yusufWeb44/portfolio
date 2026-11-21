import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { sendSafeError, handlePrismaError } from '../utils/sanitize';

export const getSeo = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let seo = await prisma.seoSettings.findUnique({ where: { id: 'singleton' } });
    if (!seo) {
      seo = await prisma.seoSettings.create({
        data: {
          id: 'singleton',
          metaTitle: 'Yusuf Ayoubi | Full-Stack Developer & Software Engineer',
          metaDescription: 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses.',
          keywords: 'Software Engineer, Full-Stack Developer, React, Next.js, Node.js, TypeScript',
          author: 'Yusuf Ayoubi',
          ogTitle: 'Yusuf Ayoubi | Full-Stack Software Engineer',
          ogDescription: 'End-to-End Web Development, Custom CRMs, and High-Performance APIs.',
          ogType: 'website',
          robots: 'index, follow',
          pageOverrides: JSON.stringify({
            titleTemplate: '%s | Yusuf Ayoubi',
            schemaType: 'Person',
          }),
        }
      });
    }

    let titleTemplate = '%s | Yusuf Ayoubi';
    let schemaType = 'Person';

    if (seo.pageOverrides) {
      try {
        const overrides = typeof seo.pageOverrides === 'string' ? JSON.parse(seo.pageOverrides) : seo.pageOverrides;
        if (overrides?.titleTemplate) titleTemplate = overrides.titleTemplate;
        if (overrides?.schemaType) schemaType = overrides.schemaType;
      } catch {}
    }

    const payload = {
      ...seo,
      siteName: seo.author ?? 'Yusuf Ayoubi',
      defaultTitle: seo.metaTitle,
      defaultDescription: seo.metaDescription,
      titleTemplate,
      schemaType,
      jsonLdCustom: seo.structuredData ?? '',
    };

    res.json({ success: true, data: payload });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch SEO settings', error);
  }
};

export const updateSeo = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const body = req.body || {};

    // 1. Resolve every field supporting both frontend aliases and direct DB column names
    const metaTitle = body.metaTitle ?? body.defaultTitle ?? 'Yusuf Ayoubi | Full-Stack Developer & Software Engineer';
    const metaDescription = body.metaDescription ?? body.defaultDescription ?? '';
    const author = body.author ?? body.siteName ?? 'Yusuf Ayoubi';
    const keywords = body.keywords !== undefined ? String(body.keywords) : null;
    const ogTitle = body.ogTitle ?? body.defaultTitle ?? metaTitle;
    const ogDescription = body.ogDescription ?? body.defaultDescription ?? metaDescription;
    const ogImage = body.ogImage !== undefined ? String(body.ogImage) : null;
    const ogType = body.ogType ?? 'website';
    const twitterHandle = body.twitterHandle !== undefined ? String(body.twitterHandle) : null;
    const twitterCardType = body.twitterCardType ?? 'summary_large_image';
    const canonicalUrl = body.canonicalUrl !== undefined ? String(body.canonicalUrl) : null;
    const robots = body.robots ?? 'index, follow';

    // Structured Data (JSON-LD)
    let structuredData: string | null = null;
    if (body.jsonLdCustom !== undefined && body.jsonLdCustom !== null) {
      structuredData = String(body.jsonLdCustom).trim() || null;
    } else if (body.structuredData !== undefined && body.structuredData !== null) {
      structuredData = typeof body.structuredData === 'object' ? JSON.stringify(body.structuredData) : String(body.structuredData).trim() || null;
    }

    // Page Overrides / Extras (titleTemplate, schemaType)
    let pageOverridesObj: Record<string, any> = {};
    if (body.pageOverrides) {
      try {
        pageOverridesObj = typeof body.pageOverrides === 'string' ? JSON.parse(body.pageOverrides) : body.pageOverrides;
      } catch {}
    }
    if (body.titleTemplate !== undefined) {
      pageOverridesObj.titleTemplate = body.titleTemplate;
    }
    if (body.schemaType !== undefined) {
      pageOverridesObj.schemaType = body.schemaType;
    }
    const pageOverrides = Object.keys(pageOverridesObj).length > 0 ? JSON.stringify(pageOverridesObj) : null;

    const allowedData = {
      metaTitle,
      metaDescription,
      keywords,
      author,
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      twitterHandle,
      twitterCardType,
      canonicalUrl,
      robots,
      structuredData,
      pageOverrides,
    };

    const seo = await prisma.seoSettings.upsert({
      where: { id: 'singleton' },
      update: allowedData,
      create: {
        id: 'singleton',
        ...allowedData,
      },
    });

    const responseData = {
      ...seo,
      siteName: seo.author ?? 'Yusuf Ayoubi',
      defaultTitle: seo.metaTitle,
      defaultDescription: seo.metaDescription,
      titleTemplate: pageOverridesObj.titleTemplate ?? '%s | Yusuf Ayoubi',
      schemaType: pageOverridesObj.schemaType ?? 'Person',
      jsonLdCustom: seo.structuredData ?? '',
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update SEO settings');
  }
};