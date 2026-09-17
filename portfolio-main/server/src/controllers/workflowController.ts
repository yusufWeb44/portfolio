import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getWorkflowSteps = async (req: Request, res: Response) => {
  try {
    const steps = await prisma.workflowStep.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: steps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workflow steps', error });
  }
};

export const createWorkflowStep = async (req: Request, res: Response) => {
  try {
    const count = await prisma.workflowStep.count();
    const step = await prisma.workflowStep.create({
      data: {
        num: req.body.num || String(count + 1).padStart(2, '0'),
        title: req.body.title,
        titleAr: req.body.titleAr || null,
        description: req.body.description,
        descriptionAr: req.body.descriptionAr || null,
        pinColor: req.body.pinColor || '#E8732A',
        order: req.body.order !== undefined ? req.body.order : count + 1,
        isEnabled: req.body.isEnabled !== undefined ? req.body.isEnabled : true
      }
    });
    res.status(201).json({ success: true, data: step });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create workflow step', error });
  }
};

export const updateWorkflowStep = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const step = await prisma.workflowStep.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, data: step });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update workflow step', error });
  }
};

export const deleteWorkflowStep = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.workflowStep.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Workflow step deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete workflow step', error });
  }
};

export const reorderWorkflowSteps = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, order }
    if (Array.isArray(items)) {
      await Promise.all(
        items.map((item) =>
          prisma.workflowStep.update({
            where: { id: item.id },
            data: { order: item.order }
          })
        )
      );
    }
    const updated = await prisma.workflowStep.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder workflow steps', error });
  }
};
