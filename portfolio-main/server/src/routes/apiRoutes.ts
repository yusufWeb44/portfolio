import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getSettings, updateSettings,
  getSkills, createSkill, updateSkill, deleteSkill,
  getExperience, createExperience, updateExperience, deleteExperience,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getServices, createService, updateService, deleteService,
  getMessages, createMessage, updateMessage, deleteMessage,
  getTechnologies, createTechnology, deleteTechnology,
  getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink
} from '../controllers/portfolioController';
import { getAbout, updateAbout } from '../controllers/aboutController';
import {
  getWorkflowSteps, createWorkflowStep, updateWorkflowStep,
  deleteWorkflowStep, reorderWorkflowSteps
} from '../controllers/workflowController';
import {
  getFaqs, createFaq, updateFaq, deleteFaq
} from '../controllers/faqController';
import { getSeo, updateSeo } from '../controllers/seoController';
import {
  getTranslations, getTranslationByLang, createOrUpdateTranslation,
  deleteTranslation, setDefaultLanguage
} from '../controllers/translationController';

const router = express.Router();

// Settings
router.route('/settings')
  .get(getSettings)
  .put(protect, updateSettings);

// About Section
router.route('/about')
  .get(getAbout)
  .put(protect, updateAbout);

// Workflow Steps
router.route('/workflow')
  .get(getWorkflowSteps)
  .post(protect, createWorkflowStep);
router.put('/workflow/reorder', protect, reorderWorkflowSteps);
router.route('/workflow/:id')
  .put(protect, updateWorkflowStep)
  .delete(protect, deleteWorkflowStep);

// FAQs
router.route('/faqs')
  .get(getFaqs)
  .post(protect, createFaq);
router.route('/faqs/:id')
  .put(protect, updateFaq)
  .delete(protect, deleteFaq);

// SEO Settings
router.route('/seo')
  .get(getSeo)
  .put(protect, updateSeo);

// Translations
router.route('/translations')
  .get(getTranslations)
  .post(protect, createOrUpdateTranslation)
  .put(protect, createOrUpdateTranslation);
router.get('/translations/:lang', getTranslationByLang);
router.delete('/translations/:id', protect, deleteTranslation);
router.put('/translations/:id/default', protect, setDefaultLanguage);

// Skills
router.route('/skills')
  .get(getSkills)
  .post(protect, createSkill);
router.route('/skills/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

// Experience
router.route('/experience')
  .get(getExperience)
  .post(protect, createExperience);
router.route('/experience/:id')
  .put(protect, updateExperience)
  .delete(protect, deleteExperience);

// Certificates
router.route('/certificates')
  .get(getCertificates)
  .post(protect, createCertificate);
router.route('/certificates/:id')
  .put(protect, updateCertificate)
  .delete(protect, deleteCertificate);

// Services
router.route('/services')
  .get(getServices)
  .post(protect, createService);
router.route('/services/:id')
  .put(protect, updateService)
  .delete(protect, deleteService);

// Messages (Public can create, Admin can read/update/delete)
router.get('/messages', protect, getMessages);
router.post('/messages', createMessage);
router.put('/messages/:id', protect, updateMessage);
router.delete('/messages/:id', protect, deleteMessage);

// Technologies (Public can read, Admin can manage)
router.get('/technologies', getTechnologies);
router.post('/technologies', protect, createTechnology);
router.delete('/technologies/:id', protect, deleteTechnology);

// Social Links (Public can read, Admin can manage)
router.get('/social-links', getSocialLinks);
router.post('/social-links', protect, createSocialLink);
router.put('/social-links/:id', protect, updateSocialLink);
router.delete('/social-links/:id', protect, deleteSocialLink);

export default router;
