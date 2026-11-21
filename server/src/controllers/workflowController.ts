import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { sanitizeText, sanitizeOptionalText, sendSafeError, handlePrismaError } from '../utils/sanitize';

const workflowStepSchema = z.object({
  num: z.string().max(20).optional(),
  title: z.string().trim().min(1, 'Step title is required').max(255),
  titleAr: z.string().max(255).optional().nullable(),
  description: z.string().trim().min(1, 'Step description is required').max(5000),
  descriptionAr: z.string().max(5000).optional().nullable(),
  pinColor: z.string().max(32).optional(),
  order: z.coerce.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.coerce.number().int(),
    })
  ),
});

export const getWorkflowSteps = async (_req: Request, res: Response) => {
  try {
    const steps = await prisma.workflowStep.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: steps });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch workflow steps', error);
  }
};

export const createWorkflowStep = async (req: Request, res: Response) => {
  try {
    const parsed = workflowStepSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid workflow step data', undefined, parsed.error.issues);
    }

    const f = parsed.data;
    const count = await prisma.workflowStep.count();
    const step = await prisma.workflowStep.create({
      data: {
        num: f.num ? sanitizeText(f.num) : String(count + 1).padStart(2, '0'),
        title: sanitizeText(f.title),
        titleAr: sanitizeOptionalText(f.titleAr) ?? null,
        description: sanitizeText(f.description),
        descriptionAr: sanitizeOptionalText(f.descriptionAr) ?? null,
        pinColor: f.pinColor ? sanitizeText(f.pinColor) : '#E8732A',
        order: f.order !== undefined ? f.order : count + 1,
        isEnabled: f.isEnabled !== undefined ? f.isEnabled : true
      }
    });
    res.status(201).json({ success: true, data: step });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create workflow step');
  }
};

export const updateWorkflowStep = async (req: Request, res: Response) => {
  try {
    const parsed = workflowStepSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid workflow step update data', undefined, parsed.error.issues);
    }

    const id = String(req.params.id);
    const f = parsed.data;
    const data: Prisma.WorkflowStepUpdateInput = {};

    if (f.num !== undefined) data.num = sanitizeText(f.num);
    if (f.title !== undefined) data.title = sanitizeText(f.title);
    if (f.titleAr !== undefined) data.titleAr = sanitizeOptionalText(f.titleAr) ?? null;
    if (f.description !== undefined) data.description = sanitizeText(f.description);
    if (f.descriptionAr !== undefined) data.descriptionAr = sanitizeOptionalText(f.descriptionAr) ?? null;
    if (f.pinColor !== undefined) data.pinColor = sanitizeText(f.pinColor);
    if (f.order !== undefined) data.order = f.order;
    if (f.isEnabled !== undefined) data.isEnabled = f.isEnabled;

    const step = await prisma.workflowStep.update({ where: { id }, data });
    res.json({ success: true, data: step });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update workflow step');
  }
};

export const deleteWorkflowStep = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.workflowStep.delete({ where: { id } });
    res.json({ success: true, message: 'Workflow step deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete workflow step');
  }
};

export const reorderWorkflowSteps = async (req: Request, res: Response) => {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid reorder payload', undefined, parsed.error.issues);
    }

    await prisma.$transaction(
      parsed.data.items.map((item) =>
        prisma.workflowStep.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
    const updated = await prisma.workflowStep.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: updated });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to reorder workflow steps');
  }
};
