import express from 'express';
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject, reorderProjects } from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.put('/reorder', protect, reorderProjects);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.get('/slug/:slug', getProjectBySlug);
router.get('/:slug', getProjectBySlug);

export default router;
