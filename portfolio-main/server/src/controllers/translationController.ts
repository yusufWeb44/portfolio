import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTranslations = async (req: Request, res: Response) => {
  try {
    const translations = await prisma.translation.findMany({
      orderBy: [{ isDefault: 'desc' }, { languageCode: 'asc' }]
    });
    res.json({ success: true, data: translations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch translations', error });
  }
};

export const getTranslationByLang = async (req: Request, res: Response) => {
  try {
    const lang = String(req.params.lang);
    const translation = await prisma.translation.findUnique({
      where: { languageCode: lang }
    });
    if (!translation) {
      // Fallback to default
      const defaultTrans = await prisma.translation.findFirst({
        where: { isDefault: true }
      });
      return res.json({ success: true, data: defaultTrans });
    }
    res.json({ success: true, data: translation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch translation by language', error });
  }
};

export const createOrUpdateTranslation = async (req: Request, res: Response) => {
  try {
    const languageCode = req.body.languageCode || req.body.lang;
    const languageName = req.body.languageName || req.body.name;
    const direction = req.body.direction || (req.body.isRtl ? 'rtl' : 'ltr') || 'ltr';
    const isDefault = !!req.body.isDefault;
    const isEnabled = req.body.isEnabled !== undefined ? !!req.body.isEnabled : true;
    const data = req.body.data;

    if (!languageCode || !languageName) {
      return res.status(400).json({ success: false, message: 'Language code and name are required' });
    }

    // If marked as default, unset other defaults
    if (isDefault) {
      await prisma.translation.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    const dataString = typeof data === 'object' ? JSON.stringify(data, null, 2) : (data || '{}');

    const translation = await prisma.translation.upsert({
      where: { languageCode },
      update: {
        languageName,
        direction: direction || 'ltr',
        isDefault: isDefault || false,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        data: dataString
      },
      create: {
        languageCode,
        languageName,
        direction: direction || 'ltr',
        isDefault: isDefault || false,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        data: dataString
      }
    });

    res.json({ success: true, data: translation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save translation', error });
  }
};

export const deleteTranslation = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const target = await prisma.translation.findUnique({ where: { id } });
    if (target?.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete the default language' });
    }
    await prisma.translation.delete({ where: { id } });
    res.json({ success: true, message: 'Translation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete translation', error });
  }
};

export const setDefaultLanguage = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.translation.updateMany({
      where: { isDefault: true },
      data: { isDefault: false }
    });
    const updated = await prisma.translation.update({
      where: { id },
      data: { isDefault: true }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set default language', error });
  }
};
