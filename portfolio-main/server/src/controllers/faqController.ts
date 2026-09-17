import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.faqItem.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs', error });
  }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const count = await prisma.faqItem.count();
    const faq = await prisma.faqItem.create({
      data: {
        category: req.body.category || 'general',
        categoryAr: req.body.categoryAr || null,
        question: req.body.question,
        questionAr: req.body.questionAr || null,
        answer: req.body.answer,
        answerAr: req.body.answerAr || null,
        order: req.body.order !== undefined ? req.body.order : count + 1,
        isEnabled: req.body.isEnabled !== undefined ? req.body.isEnabled : true
      }
    });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create FAQ item', error });
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const faq = await prisma.faqItem.update({
      where: { id },
      data: req.body
    });
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update FAQ item', error });
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.faqItem.delete({
      where: { id }
    });
    res.json({ success: true, message: 'FAQ item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ item', error });
  }
};
