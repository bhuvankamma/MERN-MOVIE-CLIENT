import express from "express";
import {
  getAllMovies,
  toggleReaction,
  addOrUpdateReview,
  deleteReview,
  toggleWatchLater,
  toggleDownload,
  streamMovie,
  incrementViewCount,
  reportMovieAbuse,
  getDashboardStats,
  addMovie,          // New route handler for adding a movie
  editMovie,         // New route handler for editing a movie
  deleteMovie        // New route handler for deleting a movie
} from "../controllers/movieController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🎬 Get all movies or filter by category
router.get("/", getAllMovies);

// 👍 Like / Dislike a movie
router.put("/:id/react", protect, toggleReaction);

// 🗨️ Add or update a review
router.post("/:id/review", protect, addOrUpdateReview);

// ❌ Delete a review
router.delete("/:id/review/:reviewId", protect, deleteReview);

// ⏱️ Toggle Watch Later
router.patch("/:id/watch-later", protect, toggleWatchLater);

// 💾 Toggle Download
router.patch("/:id/download", protect, toggleDownload);

// ▶️ Stream Movie
router.get("/:id/stream", protect, streamMovie);

// 👁️ Increment View Count
router.post("/:id/view", protect, incrementViewCount);

// 🚩 Report Abuse
router.post("/:id/report", protect, reportMovieAbuse);

// 📊 Admin Stats for Dashboard
router.get("/stats", protect, isAdmin, getDashboardStats);

// 🎬 Admin Routes for managing movies
// 🆕 Add a new movie (Admin Only)
router.post("/", protect, isAdmin, addMovie);

// ✏️ Edit an existing movie (Admin Only)
router.put("/:id", protect, isAdmin, editMovie);

// ❌ Delete a movie (Admin Only)
router.delete("/:id", protect, isAdmin, deleteMovie);

export default router;
