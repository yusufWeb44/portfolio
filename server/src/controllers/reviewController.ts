import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../utils/prisma';
import {
  sanitizeText,
  sanitizeOptionalText,
  sanitizeUrl,
  sendSafeError,
  handlePrismaError,
} from '../utils/sanitize';

const reviewSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  nameAr: z.string().max(150).optional().nullable(),
  role: z.string().trim().min(1, 'Role is required').max(150),
  roleAr: z.string().max(150).optional().nullable(),
  company: z.string().max(150).optional().nullable(),
  companyAr: z.string().max(150).optional().nullable(),
  avatarUrl: z.string().max(2000).optional().nullable(),
  linkedinUrl: z.string().max(2000).optional().nullable(),
  githubUrl: z.string().max(2000).optional().nullable(),
  content: z.string().trim().min(1, 'Review content is required').max(5000),
  contentAr: z.string().max(5000).optional().nullable(),
  order: z.coerce.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

const reorderReviewsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.coerce.number().int(),
    })
  ),
});

// Public: Get all enabled reviews ordered for visitor display
export const getReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isEnabled: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch reviews', error);
  }
};

// Admin: Get all reviews (including disabled)
export const getAdminReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch reviews', error);
  }
};

// Admin: Create new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Name, Role, and Review Content are required.', undefined, parsed.error.issues);
    }

    const f = parsed.data;
    let nextOrder = f.order;
    if (nextOrder === undefined || nextOrder === null) {
      const highest = await prisma.review.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      nextOrder = (highest?.order ?? 0) + 1;
    }

    const review = await prisma.review.create({
      data: {
        name: sanitizeText(f.name),
        nameAr: sanitizeOptionalText(f.nameAr) ?? null,
        role: sanitizeText(f.role),
        roleAr: sanitizeOptionalText(f.roleAr) ?? null,
        company: sanitizeOptionalText(f.company) ?? null,
        companyAr: sanitizeOptionalText(f.companyAr) ?? null,
        avatarUrl: sanitizeUrl(f.avatarUrl) ?? null,
        linkedinUrl: sanitizeUrl(f.linkedinUrl) ?? null,
        githubUrl: sanitizeUrl(f.githubUrl) ?? null,
        content: sanitizeText(f.content),
        contentAr: sanitizeOptionalText(f.contentAr) ?? null,
        order: nextOrder,
        isEnabled: f.isEnabled !== undefined ? f.isEnabled : true
      }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create review');
  }
};

// Admin: Update review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const parsed = reviewSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid review update data', undefined, parsed.error.issues);
    }

    const id = String(req.params.id);
    const f = parsed.data;
    const data: Prisma.ReviewUpdateInput = {};

    if (f.name !== undefined) data.name = sanitizeText(f.name);
    if (f.nameAr !== undefined) data.nameAr = sanitizeOptionalText(f.nameAr) ?? null;
    if (f.role !== undefined) data.role = sanitizeText(f.role);
    if (f.roleAr !== undefined) data.roleAr = sanitizeOptionalText(f.roleAr) ?? null;
    if (f.company !== undefined) data.company = sanitizeOptionalText(f.company) ?? null;
    if (f.companyAr !== undefined) data.companyAr = sanitizeOptionalText(f.companyAr) ?? null;
    if (f.avatarUrl !== undefined) data.avatarUrl = sanitizeUrl(f.avatarUrl) ?? null;
    if (f.linkedinUrl !== undefined) data.linkedinUrl = sanitizeUrl(f.linkedinUrl) ?? null;
    if (f.githubUrl !== undefined) data.githubUrl = sanitizeUrl(f.githubUrl) ?? null;
    if (f.content !== undefined) data.content = sanitizeText(f.content);
    if (f.contentAr !== undefined) data.contentAr = sanitizeOptionalText(f.contentAr) ?? null;
    if (f.order !== undefined) data.order = f.order;
    if (f.isEnabled !== undefined) data.isEnabled = f.isEnabled;

    const review = await prisma.review.update({ where: { id }, data });
    res.json({ success: true, data: review });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update review');
  }
};

// Admin: Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete review');
  }
};

// Admin: Reorder reviews
export const reorderReviews = async (req: Request, res: Response) => {
  try {
    const parsed = reorderReviewsSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Items array is required', undefined, parsed.error.issues);
    }

    await prisma.$transaction(
      parsed.data.items.map(item =>
        prisma.review.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ success: true, message: 'Reviews reordered successfully' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to reorder reviews');
  }
};
