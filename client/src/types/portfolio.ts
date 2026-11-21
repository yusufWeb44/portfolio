export interface HeroStatItem {
  value: string;
  label: string;
}

export interface PortfolioSettings {
  id?: string;
  name?: string;
  nameAr?: string;
  bio?: string;
  bioAr?: string;
  heroText?: string;
  heroTextAr?: string;
  ctaText?: string;
  ctaTextAr?: string;
  location?: string;
  locationAr?: string;
  availability?: string;
  availabilityAr?: string;
  email?: string;
  profilePhoto?: string;
  profilePhotoHover?: string;
  logoUrl?: string;
  typewriterWords?: string | string[];
  typewriterWordsAr?: string | string[];
  footerText?: string;
  footerTextAr?: string;
  whatsappNumber?: string;
  heroStats?: string | HeroStatItem[];
  heroStatsAr?: string | HeroStatItem[];
  primaryThemeColor?: string;
  fontFamilyEn?: string;
  fontUrlEn?: string;
  fontFamilyAr?: string;
  fontUrlAr?: string;
  cardStyle?: string;
  enableGlow?: boolean;
  backgroundPattern?: string;

  workflowBadge?: string;
  workflowBadgeAr?: string;
  workflowTitle?: string;
  workflowTitleAr?: string;
  workflowSubtitle?: string;
  workflowSubtitleAr?: string;

  projectsBadge?: string;
  projectsBadgeAr?: string;
  projectsTitle?: string;
  projectsTitleAr?: string;
  projectsSubtitle?: string;
  projectsSubtitleAr?: string;

  skillsBadge?: string;
  skillsBadgeAr?: string;
  skillsTitle?: string;
  skillsTitleAr?: string;
  skillsDescription?: string;
  skillsDescriptionAr?: string;
  skillsParagraph1?: string;
  skillsParagraph1Ar?: string;
  skillsParagraph2?: string;
  skillsParagraph2Ar?: string;
  skillsPoint1Title?: string;
  skillsPoint1TitleAr?: string;
  skillsPoint1Text?: string;
  skillsPoint1TextAr?: string;
  skillsPoint2Title?: string;
  skillsPoint2TitleAr?: string;
  skillsPoint2Text?: string;
  skillsPoint2TextAr?: string;

  experienceBadge?: string;
  experienceBadgeAr?: string;
  experienceTitle?: string;
  experienceTitleAr?: string;
  experienceSubtitle?: string;
  experienceSubtitleAr?: string;

  certificatesTitle?: string;
  certificatesTitleAr?: string;
  certificatesSubtitle?: string;
  certificatesSubtitleAr?: string;

  servicesBadge?: string;
  servicesBadgeAr?: string;
  servicesTitle?: string;
  servicesTitleAr?: string;
  servicesSubtitle?: string;
  servicesSubtitleAr?: string;

  faqBadge?: string;
  faqBadgeAr?: string;
  faqTitle?: string;
  faqTitleAr?: string;
  faqSubtitle?: string;
  faqSubtitleAr?: string;

  reviewsBadge?: string;
  reviewsBadgeAr?: string;
  reviewsTitle?: string;
  reviewsTitleAr?: string;
  reviewsSubtitle?: string;
  reviewsSubtitleAr?: string;

  contactBadge?: string;
  contactBadgeAr?: string;
  contactTitle?: string;
  contactTitleAr?: string;
  contactSubtitle?: string;
  contactSubtitleAr?: string;

  customSocialLinks?: string | SocialLinkData[];
}

export interface BentoCardItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  colSpan?: string;
}

export interface AboutSettingsData {
  id?: string;
  badge?: string;
  badgeAr?: string;
  headline?: string;
  headlineAr?: string;
  bioParagraph1?: string;
  bioParagraph1Ar?: string;
  bioParagraph2?: string;
  bioParagraph2Ar?: string;
  coreStack?: string | string[];
  coreStackAr?: string | string[];
  bentoCards?: string | BentoCardItem[];
  bentoCardsAr?: string | BentoCardItem[];
}

export interface SocialLinkData {
  id?: string;
  platform: string;
  url: string;
  icon?: string;
  order?: number;
  isEnabled?: boolean;
}

export interface SkillData {
  id?: string;
  name: string;
  nameAr?: string | null;
  category?: string;
  categoryAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  order?: number;
  isEnabled?: boolean;
}

export interface ServiceData {
  id: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  isEnabled: boolean;
  order?: number;
}

export interface WorkflowStepApiData {
  id?: string;
  num?: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  pinColor?: string | null;
  tilt?: number | null;
  side?: string | null;
  paperBg?: string | null;
  paperEdge?: string | null;
  order?: number;
  isEnabled?: boolean;
}

export interface FaqRawItem {
  id?: string;
  category?: string;
  categoryAr?: string | null;
  question: string;
  questionAr?: string | null;
  answer: string;
  answerAr?: string | null;
  order?: number;
  isEnabled?: boolean;
}
