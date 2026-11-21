import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { sanitizeText, sanitizeOptionalText, sendSafeError, handlePrismaError } from '../utils/sanitize';

const faqSchema = z.object({
  category: z.string().trim().min(1).max(100).optional(),
  categoryAr: z.string().max(100).optional().nullable(),
  question: z.string().trim().min(1, 'Question is required').max(1000),
  questionAr: z.string().max(1000).optional().nullable(),
  answer: z.string().trim().min(1, 'Answer is required').max(5000),
  answerAr: z.string().max(5000).optional().nullable(),
  order: z.coerce.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

export const getFaqs = async (_req: Request, res: Response) => {
  try {
    const faqs = await prisma.faqItem.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: faqs });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch FAQs', error);
  }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid FAQ data', undefined, parsed.error.issues);
    }

    const f = parsed.data;
    const count = await prisma.faqItem.count();
    const faq = await prisma.faqItem.create({
      data: {
        category: f.category ? sanitizeText(f.category) : 'general',
        categoryAr: sanitizeOptionalText(f.categoryAr) ?? null,
        question: sanitizeText(f.question),
        questionAr: sanitizeOptionalText(f.questionAr) ?? null,
        answer: sanitizeText(f.answer),
        answerAr: sanitizeOptionalText(f.answerAr) ?? null,
        order: f.order !== undefined ? f.order : count + 1,
        isEnabled: f.isEnabled !== undefined ? f.isEnabled : true
      }
    });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create FAQ item');
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const parsed = faqSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid FAQ update data', undefined, parsed.error.issues);
    }

    const id = String(req.params.id);
    const f = parsed.data;
    const data: Prisma.FaqItemUpdateInput = {};

    if (f.category !== undefined) data.category = sanitizeText(f.category);
    if (f.categoryAr !== undefined) data.categoryAr = sanitizeOptionalText(f.categoryAr) ?? null;
    if (f.question !== undefined) data.question = sanitizeText(f.question);
    if (f.questionAr !== undefined) data.questionAr = sanitizeOptionalText(f.questionAr) ?? null;
    if (f.answer !== undefined) data.answer = sanitizeText(f.answer);
    if (f.answerAr !== undefined) data.answerAr = sanitizeOptionalText(f.answerAr) ?? null;
    if (f.order !== undefined) data.order = f.order;
    if (f.isEnabled !== undefined) data.isEnabled = f.isEnabled;

    const faq = await prisma.faqItem.update({ where: { id }, data });
    res.json({ success: true, data: faq });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update FAQ item');
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.faqItem.delete({ where: { id } });
    res.json({ success: true, message: 'FAQ item deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete FAQ item');
  }
};
