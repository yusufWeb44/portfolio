import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { syncSettingsToTranslation } from '../utils/translationSync';

// --- Settings ---
export const getSettings = async (req: Request, res: Response) => {
  const settings = await prisma.portfolioSettings.findUnique({ where: { id: 'singleton' } });
  res.json({ success: true, data: settings });
};

const ALLOWED_SETTINGS_KEYS = new Set([
  'name', 'nameAr', 'bio', 'bioAr', 'heroText', 'heroTextAr', 'ctaText', 'ctaTextAr',
  'location', 'locationAr', 'availability', 'availabilityAr', 'email', 'profilePhoto',
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
  'experienceSubtitle', 'experienceSubtitleAr', 'servicesBadge', 'servicesBadgeAr',
  'servicesTitle', 'servicesTitleAr', 'servicesSubtitle', 'servicesSubtitleAr',
  'faqBadge', 'faqBadgeAr', 'faqTitle', 'faqTitleAr', 'faqSubtitle', 'faqSubtitleAr',
  'contactBadge', 'contactBadgeAr', 'contactTitle', 'contactTitleAr',
  'contactSubtitle', 'contactSubtitleAr'
]);

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updateData: Record<string, any> = {};
    for (const key of Object.keys(req.body)) {
      if (ALLOWED_SETTINGS_KEYS.has(key)) {
        updateData[key] = req.body[key];
      }
    }

    const settings = await prisma.portfolioSettings.upsert({
      where: { id: 'singleton' },
      update: updateData,
      create: { id: 'singleton', name: 'Yusuf', bio: '', heroText: '', ctaText: '', ...updateData }
    });
    // Synchronize matching fields to Translation table
    await syncSettingsToTranslation(updateData);

    res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update settings' });
  }
};

// --- Skills ---
export const getSkills = async (req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  res.json({ success: true, data: skills });
};

export const createSkill = async (req: Request, res: Response) => {
  const skill = await prisma.skill.create({ data: req.body });
  res.status(201).json({ success: true, data: skill });
};

export const updateSkill = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const skill = await prisma.skill.update({ where: { id }, data: req.body });
  res.json({ success: true, data: skill });
};

export const deleteSkill = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await prisma.skill.delete({ where: { id } });
  res.json({ success: true, message: 'Skill deleted' });
};

// --- Experience ---
export const getExperience = async (req: Request, res: Response) => {
  const exp = await prisma.experience.findMany({ 
    orderBy: [
      { order: 'asc' },
      { startDate: 'desc' }
    ],
    include: { technologies: true }
  });
  res.json({ success: true, data: exp });
};

export const createExperience = async (req: Request, res: Response) => {
  const { technologyIds, ...expData } = req.body;
  const exp = await prisma.experience.create({ 
    data: {
      ...expData,
      technologies: { connect: technologyIds?.map((id: string) => ({ id })) || [] }
    },
    include: { technologies: true }
  });
  res.status(201).json({ success: true, data: exp });
};

export const updateExperience = async (req: Request, res: Response) => {
  const { technologyIds, ...expData } = req.body;
  const id = req.params.id as string;
  const exp = await prisma.experience.update({ 
    where: { id }, 
    data: {
      ...expData,
      technologies: technologyIds !== undefined ? {
        set: [],
        connect: technologyIds?.map((id: string) => ({ id })) || []
      } : undefined
    },
    include: { technologies: true }
  });
  res.json({ success: true, data: exp });
};

export const deleteExperience = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.experience.delete({ where: { id } });
  res.json({ success: true, message: 'Experience deleted' });
};

// --- Certificates ---
export const getCertificates = async (req: Request, res: Response) => {
  const certificates = await prisma.certificate.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });
  res.json({ success: true, data: certificates });
};

export const createCertificate = async (req: Request, res: Response) => {
  const cert = await prisma.certificate.create({ data: req.body });
  res.status(201).json({ success: true, data: cert });
};

export const updateCertificate = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const cert = await prisma.certificate.update({
    where: { id },
    data: req.body
  });
  res.json({ success: true, data: cert });
};

export const deleteCertificate = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.certificate.delete({ where: { id } });
  res.json({ success: true, message: 'Certificate deleted' });
};

// --- Services ---
export const getServices = async (req: Request, res: Response) => {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  res.json({ success: true, data: services });
};

export const createService = async (req: Request, res: Response) => {
  const service = await prisma.service.create({ data: req.body });
  res.status(201).json({ success: true, data: service });
};

export const updateService = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const service = await prisma.service.update({ where: { id }, data: req.body });
  res.json({ success: true, data: service });
};

export const deleteService = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await prisma.service.delete({ where: { id } });
  res.json({ success: true, message: 'Service deleted' });
};

// --- Messages ---
export const getMessages = async (req: Request, res: Response) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: messages });
};

export const createMessage = async (req: Request, res: Response) => {
  // Public endpoint
  const msg = await prisma.message.create({ data: req.body });
  res.status(201).json({ success: true, data: msg });
};

export const updateMessage = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const msg = await prisma.message.update({ where: { id }, data: req.body });
  res.json({ success: true, data: msg });
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await prisma.message.delete({ where: { id } });
  res.json({ success: true, message: 'Message deleted' });
};

// --- Technologies ---
export const getTechnologies = async (req: Request, res: Response) => {
  const tech = await prisma.technology.findMany({ orderBy: { name: 'asc' } });
  res.json({ success: true, data: tech });
};

export const createTechnology = async (req: Request, res: Response) => {
  const tech = await prisma.technology.create({ data: req.body });
  res.status(201).json({ success: true, data: tech });
};

export const deleteTechnology = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await prisma.technology.delete({ where: { id } });
  res.json({ success: true, message: 'Technology deleted' });
};

// --- Social Links ---
export const getSocialLinks = async (req: Request, res: Response) => {
  const links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
  res.json({ success: true, data: links });
};

export const createSocialLink = async (req: Request, res: Response) => {
  const link = await prisma.socialLink.create({ data: req.body });
  res.status(201).json({ success: true, data: link });
};

export const updateSocialLink = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const link = await prisma.socialLink.update({ where: { id }, data: req.body });
  res.json({ success: true, data: link });
};

export const deleteSocialLink = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await prisma.socialLink.delete({ where: { id } });
  res.json({ success: true, message: 'Social link deleted' });
};
