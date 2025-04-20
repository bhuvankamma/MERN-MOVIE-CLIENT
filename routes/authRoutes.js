// backend/routes/authRoutes.js

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; // ✅ Include adminOnly
import { getDashboardStats } from '../controllers/adminController.js'; // ✅ Import the controller

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// 🧠 Only accessible by admins
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;
