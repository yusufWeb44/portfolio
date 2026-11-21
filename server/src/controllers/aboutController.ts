import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { syncAboutToTranslation } from '../utils/translationSync';

export const getAbout = async (req: Request, res: Response) => {
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
    res.status(500).json({ success: false, message: 'Failed to fetch about settings', error });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    // If arrays are passed, stringify them for storage
    if (typeof data.coreStack === 'object') data.coreStack = JSON.stringify(data.coreStack);
    if (typeof data.coreStackAr === 'object') data.coreStackAr = JSON.stringify(data.coreStackAr);

    // Ensure coreStack and coreStackAr are always kept in sync
    if (data.coreStack && (!data.coreStackAr || data.coreStackAr === 'null')) {
      data.coreStackAr = data.coreStack;
    } else if (data.coreStackAr && (!data.coreStack || data.coreStack === 'null')) {
      data.coreStack = data.coreStackAr;
    }

    if (typeof data.bentoCards === 'object') data.bentoCards = JSON.stringify(data.bentoCards);
    if (typeof data.bentoCardsAr === 'object') data.bentoCardsAr = JSON.stringify(data.bentoCardsAr);

    const about = await prisma.aboutSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    });
    // Synchronize matching fields to Translation table
    await syncAboutToTranslation(data);

    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update about settings', error });
  }
};
