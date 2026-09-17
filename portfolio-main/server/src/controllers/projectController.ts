import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  titleAr: z.string().optional().nullable(),
  slug: z.string().min(1),
  description: z.string(),
  descriptionAr: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  roleAr: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  challengeAr: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  solutionAr: z.string().optional().nullable(),
  features: z.string().optional().nullable(),
  featuresAr: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  resultsAr: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  categoryAr: z.string().optional().nullable(),
  liveDemo: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  order: z.number().int().default(0),
  technologyIds: z.array(z.string()).optional(),
  technologyNames: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string(),
    isCover: z.boolean().default(false)
  })).optional()
});

async function resolveTechnologyIds(technologyIds?: string[], technologyNames?: string[]): Promise<string[]> {
  const ids = new Set<string>(technologyIds || []);

  if (technologyNames && technologyNames.length > 0) {
    for (const rawName of technologyNames) {
      const name = rawName.trim();
      if (!name) continue;

      let tech = await prisma.technology.findFirst({
        where: { name }
      });
      if (!tech) {
        tech = await prisma.technology.create({
          data: { name }
        });
      }
      ids.add(tech.id);
    }
  }

  return Array.from(ids);
}

export const getProjects = async (req: Request, res: Response) => {
  try {
    const isPublic = req.query.public === 'true';
    const filter = isPublic ? { isPublished: true } : {};

    const projects = await prisma.project.findMany({
      where: filter,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        images: true,
        technologies: true
      }
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const reorderProjects = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        images: true,
        technologies: true
      }
    });

    res.json({ success: true, data: projects, message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: true,
        technologies: true
      }
    });

    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const { technologyIds, technologyNames, images, ...projectData } = data;

    const resolvedTechIds = await resolveTechnologyIds(technologyIds, technologyNames);

    let finalOrder = projectData.order;
    if (!finalOrder || finalOrder === 0) {
      const highest = await prisma.project.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      finalOrder = highest ? (highest.order + 1) : 1;
    }

    const project = await prisma.project.create({
      data: {
        ...projectData,
        order: finalOrder,
        technologies: {
          connect: resolvedTechIds.map(id => ({ id }))
        },
        images: {
          create: images || []
        }
      },
      include: { images: true, technologies: true }
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid input', errors: (error as any).errors || error.issues });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const { technologyIds, technologyNames, images, ...projectData } = data;
    const id = String(req.params.id);

    const resolvedTechIds = await resolveTechnologyIds(technologyIds, technologyNames);

    // Delete existing images to replace them with the new list
    if (images !== undefined) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        technologies: {
          set: [], // clear existing
          connect: resolvedTechIds.map(techId => ({ id: techId }))
        },
        ...(images !== undefined ? { images: { create: images } } : {})
      },
      include: { images: true, technologies: true }
    });
    res.json({ success: true, data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid input', errors: (error as any).errors || error.issues });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
