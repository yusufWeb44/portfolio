import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { syncTranslationToSettings } from '../utils/translationSync';
import { sanitizeText, sendSafeError, handlePrismaError } from '../utils/sanitize';

const translationDirectionSchema = z.enum(['ltr', 'rtl']);

export const getTranslations = async (_req: Request, res: Response) => {
  try {
    const translations = await prisma.translation.findMany({
      orderBy: [{ isDefault: 'desc' }, { languageCode: 'asc' }]
    });
    res.json({ success: true, data: translations });
  } catch (error) {
    sendSafeError(res, 500, 'Failed to fetch translations', error);
  }
};

export const getTranslationByLang = async (req: Request, res: Response) => {
  try {
    const lang = String(req.params.lang).trim().toLowerCase();
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
    sendSafeError(res, 500, 'Failed to fetch translation by language', error);
  }
};

export const createOrUpdateTranslation = async (req: Request, res: Response) => {
  try {
    const rawCode = req.body?.languageCode || req.body?.lang;
    const rawName = req.body?.languageName || req.body?.name;
    const rawDirection = req.body?.direction || (req.body?.isRtl ? 'rtl' : 'ltr') || 'ltr';
    const isDefault = Boolean(req.body?.isDefault);
    const isEnabled = req.body?.isEnabled !== undefined ? Boolean(req.body.isEnabled) : true;
    const data = req.body?.data;

    if (!rawCode || !rawName) {
      return sendSafeError(res, 400, 'Language code and name are required');
    }

    const languageCode = sanitizeText(String(rawCode)).toLowerCase();
    const languageName = sanitizeText(String(rawName));
    if (!/^[a-z]{2,8}(-[a-z0-9]{2,8})?$/i.test(languageCode)) {
      return sendSafeError(res, 400, 'Invalid language code format');
    }
    const dirParsed = translationDirectionSchema.safeParse(rawDirection);
    const direction = dirParsed.success ? dirParsed.data : 'ltr';

    // If marked as default, unset other defaults
    if (isDefault) {
      await prisma.translation.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    const dataString = typeof data === 'object' && data !== null ? JSON.stringify(data, null, 2) : (data ? String(data) : '{}');

    const translation = await prisma.translation.upsert({
      where: { languageCode },
      update: {
        languageName,
        direction,
        isDefault,
        isEnabled,
        data: dataString
      },
      create: {
        languageCode,
        languageName,
        direction,
        isDefault,
        isEnabled,
        data: dataString
      }
    });

    // Synchronize matching fields to PortfolioSettings & AboutSettings
    await syncTranslationToSettings(languageCode, data);

    res.json({ success: true, data: translation });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to save translation');
  }
};

export const deleteTranslation = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const target = await prisma.translation.findUnique({ where: { id } });
    if (target?.isDefault) {
      return sendSafeError(res, 400, 'Cannot delete the default language');
    }
    await prisma.translation.delete({ where: { id } });
    res.json({ success: true, message: 'Translation deleted' });
  } catch (error) {
    handlePrismaError(res, error, 'Failed to delete translation');
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
    handlePrismaError(res, error, 'Failed to set default language');
  }
};
