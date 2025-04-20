// backend/routes/userRoutes.js

import express from 'express';
import {
  getUserProfile,
  updatePreferredLanguage,
  getAllUsers,
  suspendUser,
  banUser,
  unsuspendUser,
  unbanUser,
  deleteUser
} from '../controllers/userController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';




const router = express.Router();

// User routes
router.get('/profile', protect, getUserProfile);
router.put('/language', protect, updatePreferredLanguage);

// Admin routes
router.get('/admin/all-users', protect, adminOnly, getAllUsers);
router.put('/admin/suspend/:id', protect, adminOnly, suspendUser);
router.put('/admin/unsuspend/:id', protect, adminOnly, unsuspendUser);
router.put('/admin/ban/:id', protect, adminOnly, banUser);
router.put('/admin/unban/:id', protect, adminOnly, unbanUser);
router.delete('/admin/delete/:id', protect, adminOnly, deleteUser);

export default router;
