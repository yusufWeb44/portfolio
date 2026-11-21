import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Public: Get all enabled reviews ordered for visitor display
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isEnabled: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch reviews' });
  }
};

// Admin: Get all reviews (including disabled)
export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch reviews' });
  }
};

// Admin: Create new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const {
      name,
      nameAr,
      role,
      roleAr,
      company,
      companyAr,
      avatarUrl,
      linkedinUrl,
      githubUrl,
      content,
      contentAr,
      order,
      isEnabled
    } = req.body;

    if (!name || !role || !content) {
      return res.status(400).json({ success: false, message: 'Name, Role, and Review Content are required.' });
    }

    let nextOrder = order;
    if (nextOrder === undefined || nextOrder === null) {
      const highest = await prisma.review.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      nextOrder = (highest?.order ?? 0) + 1;
    }

    const review = await prisma.review.create({
      data: {
        name,
        nameAr: nameAr || null,
        role,
        roleAr: roleAr || null,
        company: company || null,
        companyAr: companyAr || null,
        avatarUrl: avatarUrl || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        content,
        contentAr: contentAr || null,
        order: Number(nextOrder),
        isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true
      }
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create review' });
  }
};

// Admin: Update review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      name,
      nameAr,
      role,
      roleAr,
      company,
      companyAr,
      avatarUrl,
      linkedinUrl,
      githubUrl,
      content,
      contentAr,
      order,
      isEnabled
    } = req.body;

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (nameAr !== undefined) data.nameAr = nameAr;
    if (role !== undefined) data.role = role;
    if (roleAr !== undefined) data.roleAr = roleAr;
    if (company !== undefined) data.company = company;
    if (companyAr !== undefined) data.companyAr = companyAr;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
    if (linkedinUrl !== undefined) data.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) data.githubUrl = githubUrl;
    if (content !== undefined) data.content = content;
    if (contentAr !== undefined) data.contentAr = contentAr;
    if (order !== undefined) data.order = Number(order);
    if (isEnabled !== undefined) data.isEnabled = Boolean(isEnabled);

    const review = await prisma.review.update({
      where: { id },
      data
    });

    res.json({ success: true, data: review });
  } catch (error: any) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update review' });
  }
};

// Admin: Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete review' });
  }
};

// Admin: Reorder reviews
export const reorderReviews = async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string; order: number }[] };
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required' });
    }

    await prisma.$transaction(
      items.map(item =>
        prisma.review.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ success: true, message: 'Reviews reordered successfully' });
  } catch (error: any) {
    console.error('Error reordering reviews:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to reorder reviews' });
  }
};
