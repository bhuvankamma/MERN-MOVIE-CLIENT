// backend/routes/adminRoutes.js

import express from 'express';
import {
  getAllUsers,
  suspendUser,
  banUser,
  getAllContactMessages,
  deleteMovieById,
  addNewMovie,
  getDashboardStats
} from '../controllers/adminController.js';

import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';


const router = express.Router();

router.get('/dashboard-stats', protect, isAdmin, getDashboardStats);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/suspend', protect, isAdmin, suspendUser);
router.put('/users/:id/ban', protect, isAdmin, banUser);
router.get('/contact-messages', protect, isAdmin, getAllContactMessages);
router.post('/movies', protect, isAdmin, addNewMovie);
router.delete('/movies/:id', protect, isAdmin, deleteMovieById);

export default router;
