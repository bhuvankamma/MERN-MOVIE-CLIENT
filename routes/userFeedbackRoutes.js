import express from 'express';
import {
  getAllReviews,
  deleteReviewById,
  likeMovie,
  dislikeMovie,
  rateMovie,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; // ✅ FIXED: missing import

const router = express.Router();

// 📝 Admin Review Moderation Routes
router.get('/reviews', protect, adminOnly, getAllReviews);
router.delete('/reviews/:id', protect, adminOnly, deleteReviewById);

// ❤️ Like / Dislike / Rate (for users)
router.post('/movies/like', protect, likeMovie);
router.post('/movies/dislike', protect, dislikeMovie);
router.post('/movies/rate', protect, rateMovie);

export default router;
