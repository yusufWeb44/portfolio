import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { syncSettingsToTranslation } from '../utils/translationSync';
import {
  sanitizeText,
  sanitizeOptionalText,
  sanitizeUrl,
  sendSafeError,
  handlePrismaError,
} from '../utils/sanitize';

// --- Settings ---
export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.portfolioSettings.findUnique({ where: { id: 'singleton' } });
    res.json({ success: true, data: settings });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch settings', error);
  }
};

const ALLOWED_SETTINGS_KEYS = new Set([
  'name', 'nameAr', 'bio', 'bioAr', 'heroText', 'heroTextAr', 'ctaText', 'ctaTextAr',
  'location', 'locationAr', 'availability', 'availabilityAr', 'email', 'profilePhoto', 'profilePhotoHover',
  'logoUrl',
  'typewriterWords', 'typewriterWordsAr', 'footerText', 'footerTextAr', 'whatsappNumber',
  'heroStats', 'heroStatsAr', 'primaryThemeColor', 'fontFamilyEn', 'fontUrlEn', 'fontFamilyAr', 'fontUrlAr',
  'cardStyle', 'enableGlow', 'backgroundPattern', 'workflowBadge', 'workflowBadgeAr',
  'workflowTitle', 'workflowTitleAr', 'workflowSubtitle', 'workflowSubtitleAr',
  'projectsBadge', 'projectsBadgeAr', 'projectsTitle', 'projectsTitleAr',
  'projectsSubtitle', 'projectsSubtitleAr', 'skillsBadge', 'skillsBadgeAr',
  'skillsTitle', 'skillsTitleAr', 'skillsDescription', 'skillsDescriptionAr',
  'skillsParagraph1', 'skillsParagraph1Ar', 'skillsParagraph2', 'skillsParagraph2Ar',
  'skillsPoint1Title', 'skillsPoint1TitleAr', 'skillsPoint1Text', 'skillsPoint1TextAr',
  'skillsPoint2Title', 'skillsPoint2TitleAr', 'skillsPoint2Text', 'skillsPoint2TextAr',
  'experienceBadge', 'experienceBadgeAr', 'experienceTitle', 'experienceTitleAr',
  'experienceSubtitle', 'experienceSubtitleAr',
  'certificatesTitle', 'certificatesTitleAr', 'certificatesSubtitle', 'certificatesSubtitleAr',
  'servicesBadge', 'servicesBadgeAr',
  'servicesTitle', 'servicesTitleAr', 'servicesSubtitle', 'servicesSubtitleAr',
  'faqBadge', 'faqBadgeAr', 'faqTitle', 'faqTitleAr', 'faqSubtitle', 'faqSubtitleAr',
  'reviewsBadge', 'reviewsBadgeAr', 'reviewsTitle', 'reviewsTitleAr', 'reviewsSubtitle', 'reviewsSubtitleAr',
  'contactBadge', 'contactBadgeAr', 'contactTitle', 'contactTitleAr',
  'contactSubtitle', 'contactSubtitleAr'
]);

const URL_SETTINGS_KEYS = new Set([
  'profilePhoto', 'profilePhotoHover', 'logoUrl', 'fontUrlEn', 'fontUrlAr'
]);

const JSON_SETTINGS_KEYS = new Set([
  'typewriterWords', 'typewriterWordsAr', 'heroStats', 'heroStatsAr'
]);

export const updateSettings = async (req: Request, res: Response) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return sendSafeError(res, 400, 'Invalid settings payload');
    }

    const updateData: Record<string, string | boolean | null> = {};
    for (const key of Object.keys(req.body)) {
      if (!ALLOWED_SETTINGS_KEYS.has(key)) continue;
      const value = req.body[key];

      if (key === 'enableGlow') {
        updateData[key] = Boolean(value);
      } else if (URL_SETTINGS_KEYS.has(key)) {
        updateData[key] = sanitizeUrl(value) ?? null;
      } else if (JSON_SETTINGS_KEYS.has(key)) {
        updateData[key] =
          typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : value === null
              ? null
              : String(value);
      } else if (typeof value === 'string') {
        updateData[key] = value
          .replace(/<\s*\/?\s*script[^>]*>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/vbscript:/gi, '');
      } else if (value === null) {
        updateData[key] = null;
      }
    }

    const settings = await prisma.portfolioSettings.upsert({
      where: { id: 'singleton' },
      update: updateData as Prisma.PortfolioSettingsUpdateInput,
      create: {
        id: 'singleton',
        name: 'Yusuf',
        bio: '',
        heroText: '',
        ctaText: '',
        ...(updateData as Prisma.PortfolioSettingsUpdateInput),
      } as Prisma.PortfolioSettingsCreateInput,
    });
    // Synchronize matching fields to Translation table
    await syncSettingsToTranslation(updateData);

    res.json({ success: true, data: settings });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update settings');
  }
};

// --- Skills ---
export const getSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    const normalized = skills.map((s) => {
      const positionX = s.positionX ?? s.x ?? 50;
      const positionY = s.positionY ?? s.y ?? 50;
      const depth = s.depth ?? 5.0;
      const weight = s.weight ?? (s.size ? Math.min(5, Math.max(1, Math.round(s.size / 6))) : 3);
      const size = s.size ?? (weight * 6);
      return {
        ...s,
        positionX,
        positionY,
        depth,
        weight,
        x: positionX,
        y: positionY,
        size,
      };
    });
    res.json({ success: true, data: normalized });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch skills', error);
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const raw = req.body || {};
    const name = sanitizeText(String(raw.name || '')).trim();
    if (!name) {
      return sendSafeError(res, 400, 'Skill name is required');
    }

    const posX = parseFloat(raw.positionX !== undefined ? raw.positionX : (raw.x !== undefined ? raw.x : 50));
    const posY = parseFloat(raw.positionY !== undefined ? raw.positionY : (raw.y !== undefined ? raw.y : 50));
    const positionX = !isNaN(posX) ? posX : 50;
    const positionY = !isNaN(posY) ? posY : 50;
    const d = parseFloat(raw.depth);
    const depth = !isNaN(d) ? d : 5.0;
    const w = parseInt(raw.weight, 10);
    const weight = !isNaN(w) ? Math.min(5, Math.max(1, w)) : 3;
    const weightSizes: Record<number, number> = { 1: 18, 2: 22, 3: 26, 4: 32, 5: 38 };
    const size = weightSizes[weight] || (weight * 6);

    const skill = await prisma.skill.create({
      data: {
        name,
        nameAr: sanitizeOptionalText(raw.nameAr) ?? null,
        category: sanitizeText(String(raw.category || 'Frontend')) || 'Frontend',
        categoryAr: sanitizeOptionalText(raw.categoryAr) ?? null,
        description: sanitizeOptionalText(raw.description) ?? null,
        descriptionAr: sanitizeOptionalText(raw.descriptionAr) ?? null,
        icon: sanitizeOptionalText(raw.icon) ?? null,
        positionX,
        positionY,
        depth,
        weight,
        size,
        x: positionX,
        y: positionY,
        order: parseInt(raw.order, 10) || 0,
        isEnabled: raw.isEnabled !== undefined ? Boolean(raw.isEnabled) : true,
      },
    });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create skill');
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const raw = req.body || {};

    const updateData: Prisma.SkillUpdateInput = {};

    if (raw.name !== undefined) {
      const cleanedName = sanitizeText(String(raw.name));
      if (!cleanedName) return sendSafeError(res, 400, 'Skill name cannot be empty');
      updateData.name = cleanedName;
    }
    if (raw.nameAr !== undefined) updateData.nameAr = sanitizeOptionalText(raw.nameAr) ?? null;
    if (raw.category !== undefined) updateData.category = sanitizeText(String(raw.category)) || 'Frontend';
    if (raw.categoryAr !== undefined) updateData.categoryAr = sanitizeOptionalText(raw.categoryAr) ?? null;
    if (raw.description !== undefined) updateData.description = sanitizeOptionalText(raw.description) ?? null;
    if (raw.descriptionAr !== undefined) updateData.descriptionAr = sanitizeOptionalText(raw.descriptionAr) ?? null;
    if (raw.icon !== undefined) updateData.icon = sanitizeOptionalText(raw.icon) ?? null;
    if (raw.isEnabled !== undefined) updateData.isEnabled = Boolean(raw.isEnabled);
    if (raw.order !== undefined) updateData.order = parseInt(raw.order, 10) || 0;

    if (raw.positionX !== undefined || raw.x !== undefined) {
      const posX = parseFloat(raw.positionX !== undefined ? raw.positionX : raw.x);
      if (!isNaN(posX)) {
        updateData.positionX = posX;
        updateData.x = posX;
      }
    }
    if (raw.positionY !== undefined || raw.y !== undefined) {
      const posY = parseFloat(raw.positionY !== undefined ? raw.positionY : raw.y);
      if (!isNaN(posY)) {
        updateData.positionY = posY;
        updateData.y = posY;
      }
    }
    if (raw.depth !== undefined) {
      const d = parseFloat(raw.depth);
      if (!isNaN(d)) updateData.depth = d;
    }
    if (raw.weight !== undefined) {
      const w = parseInt(raw.weight, 10);
      if (!isNaN(w)) {
        const clamped = Math.min(5, Math.max(1, w));
        updateData.weight = clamped;
        const weightSizes: Record<number, number> = { 1: 18, 2: 22, 3: 26, 4: 32, 5: 38 };
        updateData.size = weightSizes[clamped] || (clamped * 6);
      }
    }
    if (raw.size !== undefined && raw.weight === undefined) {
      const s = parseInt(raw.size, 10);
      if (!isNaN(s)) updateData.size = s;
    }

    const skill = await prisma.skill.update({ where: { id }, data: updateData });
    res.json({ success: true, data: skill });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update skill');
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.skill.delete({ where: { id } });
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete skill');
  }
};

// --- Experience ---
const experienceBaseSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(200),
  companyAr: z.string().max(200).optional().nullable(),
  position: z.string().trim().min(1, 'Position is required').max(200),
  positionAr: z.string().max(200).optional().nullable(),
  startDate: z.string().trim().min(1, 'Start date is required').max(100),
  startDateAr: z.string().max(100).optional().nullable(),
  endDate: z.string().max(100).optional().nullable(),
  endDateAr: z.string().max(100).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  locationAr: z.string().max(200).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  descriptionAr: z.string().max(5000).optional().nullable(),
  responsibilities: z.string().max(5000).optional().nullable(),
  responsibilitiesAr: z.string().max(5000).optional().nullable(),
  type: z.string().max(50).optional(),
  icon: z.string().max(100).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  order: z.coerce.number().int().optional(),
  technologyIds: z.array(z.string()).optional(),
});

export const getExperience = async (_req: Request, res: Response) => {
  try {
    const exp = await prisma.experience.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ],
      include: { technologies: true }
    });
    res.json({ success: true, data: exp });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch experience records', error);
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const parsed = experienceBaseSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid experience data', undefined, parsed.error.issues);
    }
    const { technologyIds, ...fields } = parsed.data;
    const exp = await prisma.experience.create({
      data: {
        company: sanitizeText(fields.company),
        companyAr: sanitizeOptionalText(fields.companyAr) ?? null,
        position: sanitizeText(fields.position),
        positionAr: sanitizeOptionalText(fields.positionAr) ?? null,
        startDate: sanitizeText(fields.startDate),
        startDateAr: sanitizeOptionalText(fields.startDateAr) ?? null,
        endDate: sanitizeOptionalText(fields.endDate) ?? null,
        endDateAr: sanitizeOptionalText(fields.endDateAr) ?? null,
        location: sanitizeOptionalText(fields.location) ?? null,
        locationAr: sanitizeOptionalText(fields.locationAr) ?? null,
        description: sanitizeOptionalText(fields.description) ?? null,
        descriptionAr: sanitizeOptionalText(fields.descriptionAr) ?? null,
        responsibilities: sanitizeOptionalText(fields.responsibilities) ?? null,
        responsibilitiesAr: sanitizeOptionalText(fields.responsibilitiesAr) ?? null,
        type: fields.type ? sanitizeText(fields.type) : 'work',
        icon: sanitizeOptionalText(fields.icon) ?? 'briefcase',
        color: sanitizeOptionalText(fields.color) ?? 'blue',
        order: fields.order ?? 0,
        technologies: { connect: technologyIds?.map((id) => ({ id })) || [] }
      },
      include: { technologies: true }
    });
    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create experience');
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const parsed = experienceBaseSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid experience update data', undefined, parsed.error.issues);
    }
    const id = String(req.params.id);
    const { technologyIds, ...fields } = parsed.data;

    const data: Prisma.ExperienceUpdateInput = {};
    if (fields.company !== undefined) data.company = sanitizeText(fields.company);
    if (fields.companyAr !== undefined) data.companyAr = sanitizeOptionalText(fields.companyAr) ?? null;
    if (fields.position !== undefined) data.position = sanitizeText(fields.position);
    if (fields.positionAr !== undefined) data.positionAr = sanitizeOptionalText(fields.positionAr) ?? null;
    if (fields.startDate !== undefined) data.startDate = sanitizeText(fields.startDate);
    if (fields.startDateAr !== undefined) data.startDateAr = sanitizeOptionalText(fields.startDateAr) ?? null;
    if (fields.endDate !== undefined) data.endDate = sanitizeOptionalText(fields.endDate) ?? null;
    if (fields.endDateAr !== undefined) data.endDateAr = sanitizeOptionalText(fields.endDateAr) ?? null;
    if (fields.location !== undefined) data.location = sanitizeOptionalText(fields.location) ?? null;
    if (fields.locationAr !== undefined) data.locationAr = sanitizeOptionalText(fields.locationAr) ?? null;
    if (fields.description !== undefined) data.description = sanitizeOptionalText(fields.description) ?? null;
    if (fields.descriptionAr !== undefined) data.descriptionAr = sanitizeOptionalText(fields.descriptionAr) ?? null;
    if (fields.responsibilities !== undefined) data.responsibilities = sanitizeOptionalText(fields.responsibilities) ?? null;
    if (fields.responsibilitiesAr !== undefined) data.responsibilitiesAr = sanitizeOptionalText(fields.responsibilitiesAr) ?? null;
    if (fields.type !== undefined) data.type = sanitizeText(fields.type);
    if (fields.icon !== undefined) data.icon = sanitizeOptionalText(fields.icon) ?? null;
    if (fields.color !== undefined) data.color = sanitizeOptionalText(fields.color) ?? null;
    if (fields.order !== undefined) data.order = fields.order;

    if (technologyIds !== undefined) {
      data.technologies = {
        set: [],
        connect: technologyIds.map((techId) => ({ id: techId })),
      };
    }

    const exp = await prisma.experience.update({
      where: { id },
      data,
      include: { technologies: true }
    });
    res.json({ success: true, data: exp });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update experience');
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.experience.delete({ where: { id } });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete experience');
  }
};

// --- Certificates ---
const certificateSchema = z.object({
  title: z.string().max(255).optional(),
  titleAr: z.string().max(255).optional().nullable(),
  issuer: z.string().max(255).optional(),
  issuerAr: z.string().max(255).optional().nullable(),
  issueDate: z.string().max(100).optional().nullable(),
  credentialUrl: z.string().max(2000).optional().nullable(),
  credentialId: z.string().max(255).optional().nullable(),
  imageUrl: z.string().max(2000).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  skills: z.string().max(1000).optional().nullable(),
  skillsAr: z.string().max(1000).optional().nullable(),
  order: z.coerce.number().int().optional(),
});

export const getCertificates = async (_req: Request, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ success: true, data: certificates });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch certificates', error);
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const parsed = certificateSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid certificate data', undefined, parsed.error.issues);
    }
    const f = parsed.data;
    const cert = await prisma.certificate.create({
      data: {
        title: sanitizeText(f.title || '') || 'Certificate',
        titleAr: sanitizeOptionalText(f.titleAr) ?? null,
        issuer: sanitizeText(f.issuer || '') || 'Verified Credential',
        issuerAr: sanitizeOptionalText(f.issuerAr) ?? null,
        issueDate: sanitizeOptionalText(f.issueDate) ?? null,
        credentialUrl: sanitizeUrl(f.credentialUrl) ?? null,
        credentialId: sanitizeOptionalText(f.credentialId) ?? null,
        imageUrl: sanitizeUrl(f.imageUrl) ?? null,
        icon: sanitizeOptionalText(f.icon) ?? 'award',
        skills: sanitizeOptionalText(f.skills) ?? null,
        skillsAr: sanitizeOptionalText(f.skillsAr) ?? null,
        order: f.order ?? 0,
      }
    });
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create certificate');
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const parsed = certificateSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid certificate update data', undefined, parsed.error.issues);
    }
    const id = String(req.params.id);
    const f = parsed.data;

    const data: Prisma.CertificateUpdateInput = {};
    if (f.title !== undefined) data.title = sanitizeText(f.title) || 'Certificate';
    if (f.titleAr !== undefined) data.titleAr = sanitizeOptionalText(f.titleAr) ?? null;
    if (f.issuer !== undefined) data.issuer = sanitizeText(f.issuer) || 'Verified Credential';
    if (f.issuerAr !== undefined) data.issuerAr = sanitizeOptionalText(f.issuerAr) ?? null;
    if (f.issueDate !== undefined) data.issueDate = sanitizeOptionalText(f.issueDate) ?? null;
    if (f.credentialUrl !== undefined) data.credentialUrl = sanitizeUrl(f.credentialUrl) ?? null;
    if (f.credentialId !== undefined) data.credentialId = sanitizeOptionalText(f.credentialId) ?? null;
    if (f.imageUrl !== undefined) data.imageUrl = sanitizeUrl(f.imageUrl) ?? null;
    if (f.icon !== undefined) data.icon = sanitizeOptionalText(f.icon) ?? null;
    if (f.skills !== undefined) data.skills = sanitizeOptionalText(f.skills) ?? null;
    if (f.skillsAr !== undefined) data.skillsAr = sanitizeOptionalText(f.skillsAr) ?? null;
    if (f.order !== undefined) data.order = f.order;

    const cert = await prisma.certificate.update({ where: { id }, data });
    res.json({ success: true, data: cert });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update certificate');
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.certificate.delete({ where: { id } });
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete certificate');
  }
};

// --- Services ---
const serviceSchema = z.object({
  title: z.string().trim().min(1, 'Service title is required').max(255),
  titleAr: z.string().max(255).optional().nullable(),
  description: z.string().trim().min(1, 'Service description is required').max(5000),
  descriptionAr: z.string().max(5000).optional().nullable(),
  order: z.coerce.number().int().optional(),
  isEnabled: z.boolean().optional(),
});

export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: services });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch services', error);
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid service data', undefined, parsed.error.issues);
    }
    const f = parsed.data;
    const service = await prisma.service.create({
      data: {
        title: sanitizeText(f.title),
        titleAr: sanitizeOptionalText(f.titleAr) ?? null,
        description: sanitizeText(f.description),
        descriptionAr: sanitizeOptionalText(f.descriptionAr) ?? null,
        order: f.order ?? 0,
        isEnabled: f.isEnabled ?? true,
      }
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create service');
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid service update data', undefined, parsed.error.issues);
    }
    const id = String(req.params.id);
    const f = parsed.data;

    const data: Prisma.ServiceUpdateInput = {};
    if (f.title !== undefined) data.title = sanitizeText(f.title);
    if (f.titleAr !== undefined) data.titleAr = sanitizeOptionalText(f.titleAr) ?? null;
    if (f.description !== undefined) data.description = sanitizeText(f.description);
    if (f.descriptionAr !== undefined) data.descriptionAr = sanitizeOptionalText(f.descriptionAr) ?? null;
    if (f.order !== undefined) data.order = f.order;
    if (f.isEnabled !== undefined) data.isEnabled = f.isEnabled;

    const service = await prisma.service.update({ where: { id }, data });
    res.json({ success: true, data: service });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update service');
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete service');
  }
};

// --- Messages ---
export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: messages });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch messages', error);
  }
};

// Strict input validation schema for contact messages
const contactMessageServerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject cannot exceed 150 characters'),
  content: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message cannot exceed 3000 characters'),
  hp_company: z.string().optional(),
  website: z.string().optional(),
  clientTimestamp: z.number().optional(),
});

export const createMessage = async (req: Request, res: Response) => {
  try {
    // 1. Zod input validation
    const parseResult = contactMessageServerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorDetails = (parseResult.error.issues || []).map((e) => e.message).join(', ');
      return sendSafeError(
        res,
        400,
        `Invalid form submission: ${errorDetails}`,
        undefined,
        parseResult.error.issues
      );
    }

    const { name, email, subject, content, hp_company, website, clientTimestamp } = parseResult.data;

    // 2. Honeypot check (traps automated bots that fill hidden fields)
    if (hp_company || website) {
      return res.status(201).json({
        success: true,
        data: { id: 'bot-filtered' },
        message: 'Message received successfully',
      });
    }

    // 3. Time-based heuristic check (humans take at least 1.5s to fill a form)
    if (clientTimestamp && Date.now() - clientTimestamp < 1500) {
      return res.status(201).json({
        success: true,
        data: { id: 'bot-filtered' },
        message: 'Message received successfully',
      });
    }

    // 4. Sanitize and whitelist only valid fields to avoid Mass Assignment & Stored XSS
    const msg = await prisma.message.create({
      data: {
        name: sanitizeText(name),
        email: email.toLowerCase().trim(),
        subject: sanitizeText(subject),
        content: sanitizeText(content),
      },
    });

    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to submit message');
  }
};

const updateMessageSchema = z.object({
  isRead: z.boolean(),
});

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const parsed = updateMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid message update payload', undefined, parsed.error.issues);
    }
    const id = String(req.params.id);
    const msg = await prisma.message.update({
      where: { id },
      data: { isRead: parsed.data.isRead }
    });
    res.json({ success: true, data: msg });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update message');
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.message.delete({ where: { id } });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete message');
  }
};

// --- Technologies ---
const technologySchema = z.object({
  name: z.string().trim().min(1, 'Technology name is required').max(120),
  icon: z.string().max(255).optional().nullable(),
});

export const getTechnologies = async (_req: Request, res: Response) => {
  try {
    const tech = await prisma.technology.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: tech });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch technologies', error);
  }
};

export const createTechnology = async (req: Request, res: Response) => {
  try {
    const parsed = technologySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid technology data', undefined, parsed.error.issues);
    }
    const tech = await prisma.technology.create({
      data: {
        name: sanitizeText(parsed.data.name),
        icon: sanitizeOptionalText(parsed.data.icon) ?? null,
      }
    });
    res.status(201).json({ success: true, data: tech });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create technology');
  }
};

export const deleteTechnology = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.technology.delete({ where: { id } });
    res.json({ success: true, message: 'Technology deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete technology');
  }
};

// --- Social Links ---
const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, 'Platform name is required').max(100),
  url: z.string().trim().min(1, 'URL is required').max(2000),
  icon: z.string().max(100).optional().nullable(),
  order: z.coerce.number().int().optional(),
});

export const getSocialLinks = async (_req: Request, res: Response) => {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: links });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch social links', error);
  }
};

export const createSocialLink = async (req: Request, res: Response) => {
  try {
    const parsed = socialLinkSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid social link data', undefined, parsed.error.issues);
    }
    const safeUrl = sanitizeUrl(parsed.data.url);
    if (!safeUrl) {
      return sendSafeError(res, 400, 'Invalid or unsafe social link URL');
    }
    const link = await prisma.socialLink.create({
      data: {
        platform: sanitizeText(parsed.data.platform),
        url: safeUrl,
        icon: sanitizeOptionalText(parsed.data.icon) ?? null,
        order: parsed.data.order ?? 0,
      }
    });
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to create social link');
  }
};

export const updateSocialLink = async (req: Request, res: Response) => {
  try {
    const parsed = socialLinkSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return sendSafeError(res, 400, 'Invalid social link update data', undefined, parsed.error.issues);
    }
    const id = String(req.params.id);
    const f = parsed.data;
    const data: Prisma.SocialLinkUpdateInput = {};

    if (f.platform !== undefined) data.platform = sanitizeText(f.platform);
    if (f.url !== undefined) {
      const safeUrl = sanitizeUrl(f.url);
      if (!safeUrl) return sendSafeError(res, 400, 'Invalid or unsafe social link URL');
      data.url = safeUrl;
    }
    if (f.icon !== undefined) data.icon = sanitizeOptionalText(f.icon) ?? null;
    if (f.order !== undefined) data.order = f.order;

    const link = await prisma.socialLink.update({ where: { id }, data });
    res.json({ success: true, data: link });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to update social link');
  }
};

export const deleteSocialLink = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.socialLink.delete({ where: { id } });
    res.json({ success: true, message: 'Social link deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete social link');
  }
};
