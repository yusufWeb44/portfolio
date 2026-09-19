import prisma from './prisma';

// Mapping: Translation key -> PortfolioSettings field (English)
export const EN_SETTINGS_MAP: Record<string, string> = {
  'hero.headline': 'heroText',
  'hero.bio': 'bio',
  'hero.cta': 'ctaText',
  'hero.availability': 'availability',
  'workflow.badge': 'workflowBadge',
  'workflow.title': 'workflowTitle',
  'workflow.subtitle': 'workflowSubtitle',
  'projects.badge': 'projectsBadge',
  'projects.title': 'projectsTitle',
  'projects.subtitle': 'projectsSubtitle',
  'skills.badge': 'skillsBadge',
  'skills.title': 'skillsTitle',
  'skills.subtitle': 'skillsDescription',
  'skills.point1.title': 'skillsPoint1Title',
  'skills.point1.desc': 'skillsPoint1Text',
  'skills.point2.title': 'skillsPoint2Title',
  'skills.point2.desc': 'skillsPoint2Text',
  'experience.badge': 'experienceBadge',
  'experience.title': 'experienceTitle',
  'experience.subtitle': 'experienceSubtitle',
  'services.badge': 'servicesBadge',
  'services.title': 'servicesTitle',
  'services.subtitle': 'servicesSubtitle',
  'faq.badge': 'faqBadge',
  'faq.title': 'faqTitle',
  'faq.subtitle': 'faqSubtitle',
  'contact.badge': 'contactBadge',
  'contact.headline': 'contactTitle',
  'contact.subtitle': 'contactSubtitle',
  'footer.tagline': 'footerText',
};

// Mapping: Translation key -> PortfolioSettings field (Arabic)
export const AR_SETTINGS_MAP: Record<string, string> = {
  'hero.headline': 'heroTextAr',
  'hero.bio': 'bioAr',
  'hero.cta': 'ctaTextAr',
  'hero.availability': 'availabilityAr',
  'workflow.badge': 'workflowBadgeAr',
  'workflow.title': 'workflowTitleAr',
  'workflow.subtitle': 'workflowSubtitleAr',
  'projects.badge': 'projectsBadgeAr',
  'projects.title': 'projectsTitleAr',
  'projects.subtitle': 'projectsSubtitleAr',
  'skills.badge': 'skillsBadgeAr',
  'skills.title': 'skillsTitleAr',
  'skills.subtitle': 'skillsDescriptionAr',
  'skills.point1.title': 'skillsPoint1TitleAr',
  'skills.point1.desc': 'skillsPoint1TextAr',
  'skills.point2.title': 'skillsPoint2TitleAr',
  'skills.point2.desc': 'skillsPoint2TextAr',
  'experience.badge': 'experienceBadgeAr',
  'experience.title': 'experienceTitleAr',
  'experience.subtitle': 'experienceSubtitleAr',
  'services.badge': 'servicesBadgeAr',
  'services.title': 'servicesTitleAr',
  'services.subtitle': 'servicesSubtitleAr',
  'faq.badge': 'faqBadgeAr',
  'faq.title': 'faqTitleAr',
  'faq.subtitle': 'faqSubtitleAr',
  'contact.badge': 'contactBadgeAr',
  'contact.headline': 'contactTitleAr',
  'contact.subtitle': 'contactSubtitleAr',
  'footer.tagline': 'footerTextAr',
};

// Mapping: Translation key -> AboutSettings field (English)
export const EN_ABOUT_MAP: Record<string, string> = {
  'about.badge': 'badge',
  'about.headline': 'headline',
  'about.bio1': 'bioParagraph1',
  'about.bio2': 'bioParagraph2',
};

// Mapping: Translation key -> AboutSettings field (Arabic)
export const AR_ABOUT_MAP: Record<string, string> = {
  'about.badge': 'badgeAr',
  'about.headline': 'headlineAr',
  'about.bio1': 'bioParagraph1Ar',
  'about.bio2': 'bioParagraph2Ar',
};

// Reverse mappings
export const SETTINGS_TO_EN_TRANS: Record<string, string> = Object.fromEntries(
  Object.entries(EN_SETTINGS_MAP).map(([k, v]) => [v, k])
);
export const SETTINGS_TO_AR_TRANS: Record<string, string> = Object.fromEntries(
  Object.entries(AR_SETTINGS_MAP).map(([k, v]) => [v, k])
);
export const ABOUT_TO_EN_TRANS: Record<string, string> = Object.fromEntries(
  Object.entries(EN_ABOUT_MAP).map(([k, v]) => [v, k])
);
export const ABOUT_TO_AR_TRANS: Record<string, string> = Object.fromEntries(
  Object.entries(AR_ABOUT_MAP).map(([k, v]) => [v, k])
);

/**
 * Sync translations data into PortfolioSettings and AboutSettings tables
 * Triggered when admin updates translations in /admin/translations
 */
export async function syncTranslationToSettings(languageCode: string, translationData: any) {
  try {
    const dict = typeof translationData === 'string' ? JSON.parse(translationData) : (translationData || {});
    if (typeof dict !== 'object' || dict === null) return;

    const settingsUpdate: Record<string, any> = {};
    const aboutUpdate: Record<string, any> = {};

    if (languageCode === 'en') {
      for (const [transKey, settingCol] of Object.entries(EN_SETTINGS_MAP)) {
        if (dict[transKey] !== undefined && dict[transKey] !== null) {
          settingsUpdate[settingCol] = String(dict[transKey]);
        }
      }
      for (const [transKey, aboutCol] of Object.entries(EN_ABOUT_MAP)) {
        if (dict[transKey] !== undefined && dict[transKey] !== null) {
          aboutUpdate[aboutCol] = String(dict[transKey]);
        }
      }
    } else if (languageCode === 'ar') {
      for (const [transKey, settingCol] of Object.entries(AR_SETTINGS_MAP)) {
        if (dict[transKey] !== undefined && dict[transKey] !== null) {
          settingsUpdate[settingCol] = String(dict[transKey]);
        }
      }
      for (const [transKey, aboutCol] of Object.entries(AR_ABOUT_MAP)) {
        if (dict[transKey] !== undefined && dict[transKey] !== null) {
          aboutUpdate[aboutCol] = String(dict[transKey]);
        }
      }
    }

    if (Object.keys(settingsUpdate).length > 0) {
      await prisma.portfolioSettings.upsert({
        where: { id: 'singleton' },
        update: settingsUpdate,
        create: { id: 'singleton', name: 'Yusuf', bio: '', heroText: '', ctaText: '', ...settingsUpdate }
      });
    }

    if (Object.keys(aboutUpdate).length > 0) {
      await prisma.aboutSettings.upsert({
        where: { id: 'singleton' },
        update: aboutUpdate,
        create: { id: 'singleton', ...aboutUpdate }
      });
    }
  } catch (err) {
    console.error('Failed to sync translation to settings:', err);
  }
}

/**
 * Sync PortfolioSettings changes back into Translation table
 * Triggered when admin updates settings in /admin/settings or section editors
 */
export async function syncSettingsToTranslation(settingsData: Record<string, any>) {
  try {
    const enChanges: Record<string, string> = {};
    const arChanges: Record<string, string> = {};

    for (const [key, value] of Object.entries(settingsData)) {
      if (value === undefined || value === null) continue;
      const strVal = String(value);

      if (SETTINGS_TO_EN_TRANS[key]) {
        enChanges[SETTINGS_TO_EN_TRANS[key]] = strVal;
      }
      if (SETTINGS_TO_AR_TRANS[key]) {
        arChanges[SETTINGS_TO_AR_TRANS[key]] = strVal;
      }
    }

    if (Object.keys(enChanges).length > 0) {
      await updateTranslationDict('en', enChanges);
    }
    if (Object.keys(arChanges).length > 0) {
      await updateTranslationDict('ar', arChanges);
    }
  } catch (err) {
    console.error('Failed to sync settings to translation:', err);
  }
}

/**
 * Sync AboutSettings changes back into Translation table
 * Triggered when admin updates about in /admin/about
 */
export async function syncAboutToTranslation(aboutData: Record<string, any>) {
  try {
    const enChanges: Record<string, string> = {};
    const arChanges: Record<string, string> = {};

    for (const [key, value] of Object.entries(aboutData)) {
      if (value === undefined || value === null) continue;
      const strVal = String(value);

      if (ABOUT_TO_EN_TRANS[key]) {
        enChanges[ABOUT_TO_EN_TRANS[key]] = strVal;
      }
      if (ABOUT_TO_AR_TRANS[key]) {
        arChanges[ABOUT_TO_AR_TRANS[key]] = strVal;
      }
    }

    if (Object.keys(enChanges).length > 0) {
      await updateTranslationDict('en', enChanges);
    }
    if (Object.keys(arChanges).length > 0) {
      await updateTranslationDict('ar', arChanges);
    }
  } catch (err) {
    console.error('Failed to sync about to translation:', err);
  }
}

/**
 * Helper to patch specific keys in a Translation record without overwriting other keys
 */
async function updateTranslationDict(languageCode: string, changes: Record<string, string>) {
  const record = await prisma.translation.findUnique({
    where: { languageCode }
  });

  if (!record) return;

  try {
    const currentDict = typeof record.data === 'string' ? JSON.parse(record.data) : (record.data || {});
    let hasChanged = false;

    for (const [k, v] of Object.entries(changes)) {
      if (currentDict[k] !== v) {
        currentDict[k] = v;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      await prisma.translation.update({
        where: { languageCode },
        data: {
          data: JSON.stringify(currentDict, null, 2)
        }
      });
    }
  } catch (err) {
    console.error(`Error updating translation dict for ${languageCode}:`, err);
  }
}

/**
 * Reconcile Translation -> PortfolioSettings & AboutSettings
 * Used to immediately push any existing translated values into Settings
 */
export async function reconcileInitialTranslations() {
  try {
    const translations = await prisma.translation.findMany();
    for (const item of translations) {
      if (item.languageCode === 'en' || item.languageCode === 'ar') {
        await syncTranslationToSettings(item.languageCode, item.data);
      }
    }
    console.log('[Two-Way Sync] Reconciled all translations with portfolio settings successfully.');
  } catch (err) {
    console.error('Error during initial translation reconciliation:', err);
  }
}
