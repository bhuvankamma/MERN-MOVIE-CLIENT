import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/contact
router.post('/', protect, submitContactForm);

export default router;
