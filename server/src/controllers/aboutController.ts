import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { syncAboutToTranslation } from '../utils/translationSync';
import { sendSafeError, handlePrismaError } from '../utils/sanitize';

const ALLOWED_ABOUT_KEYS = new Set([
  'badge', 'badgeAr',
  'headline', 'headlineAr',
  'bioParagraph1', 'bioParagraph1Ar',
  'bioParagraph2', 'bioParagraph2Ar',
  'coreStack', 'coreStackAr',
  'bentoCards', 'bentoCardsAr',
]);

export const getAbout = async (_req: Request, res: Response) => {
  try {
    let about = await prisma.aboutSettings.findUnique({ where: { id: 'singleton' } });
    if (!about) {
      about = await prisma.aboutSettings.create({
        data: {
          id: 'singleton',
          badge: 'About Me',
          headline: 'Crafting Scalable Software with Purpose & Precision.',
          bioParagraph1: "I'm Yousef — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production.",
          bioParagraph2: 'My focus is on modern frontends paired with robust server-side architectures.',
          coreStack: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'MySQL', 'PostgreSQL', 'REST APIs', 'GraphQL', 'MongoDB']),
          bentoCards: JSON.stringify([
            { id: '01', title: 'Clean Architecture', description: 'Maintainable, scalable codebases built on proven patterns.', icon: 'layers' },
            { id: '02', title: 'Business-First Mindset', description: 'Software engineered to solve real operational bottlenecks and unlock growth.', icon: 'trending-up' },
            { id: '03', title: 'Performance & Reliability', description: 'Zero compromise on load speeds and query optimization.', icon: 'zap', colSpan: 'sm:col-span-2' }
          ])
        }
      });
    }
    res.json({ success: true, data: about });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch about settings', error);
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return sendSafeError(res, 400, 'Invalid about settings payload');
    }

    const data: Record<string, string | null> = {};
    for (const key of Object.keys(req.body)) {
      if (!ALLOWED_ABOUT_KEYS.has(key)) continue;
      const val = req.body[key];
      if (key === 'coreStack' || key === 'coreStackAr' || key === 'bentoCards' || key === 'bentoCardsAr') {
        data[key] =
          typeof val === 'object' && val !== null
            ? JSON.stringify(val)
            : val === null
              ? null
              : String(val);
      } else if (typeof val === 'string') {
        data[key] = val.replace(/<\s*\/?\s*script[^>]*>/gi, '').replace(/javascript:/gi, '');
      } else if (val === null) {
        data[key] = null;
      }
    }

    // Ensure coreStack and coreStackAr are always kept in sync
    if (data.coreStack && (!data.coreStackAr || data.coreStackAr === 'null')) {
      data.coreStackAr = data.coreStack;
    } else if (data.coreStackAr && (!data.coreStack || data.coreStack === 'null')) {
      data.coreStack = data.coreStackAr;
    }

    const about = await prisma.aboutSettings.upsert({
      where: { id: 'singleton' },
      update: data as Prisma.AboutSettingsUpdateInput,
      create: { id: 'singleton', ...(data as Prisma.AboutSettingsCreateInput) }
    });
    // Synchronize matching fields to Translation table
    await syncAboutToTranslation(data);

    res.json({ success: true, data: about });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update about settings');
  }
};
