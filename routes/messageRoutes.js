import express from 'express';
import {
  sendMessage,
  getAllMessages,
  replyMessage,
  getUserMessages,
  deleteAllMessages, // ✅ Make sure this is imported
} from '../controllers/messageController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📨 User sends a message
router.post('/', protect, sendMessage);

// 📬 User retrieves their own messages (with replies)
router.get('/user', protect, getUserMessages);

// 📥 Admin retrieves all user messages
router.get('/admin', protect, isAdmin, getAllMessages);

// 💬 Admin replies to a message
router.put('/reply/:id', protect, isAdmin, replyMessage);

// 🧨 Admin deletes all messages
router.delete('/admin/delete-all', protect, isAdmin, deleteAllMessages);

export default router;
