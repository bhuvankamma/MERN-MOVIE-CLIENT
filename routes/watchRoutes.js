// backend/routes/watchRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { saveWatchProgress, getContinueWatching } from '../controllers/watchController.js';

const router = express.Router();

router.post('/save', verifyToken, saveWatchProgress);
router.get('/progress', verifyToken, getContinueWatching);

export default router;
