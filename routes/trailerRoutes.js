import express from 'express';
import {
  addTrailer,
  getAllTrailers,
  deleteTrailer
} from '../controllers/trailerController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, addTrailer);         // admin
router.get('/', protect, getAllTrailers);               // user & admin
router.delete('/:id', protect, isAdmin, deleteTrailer); // admin

export default router;
