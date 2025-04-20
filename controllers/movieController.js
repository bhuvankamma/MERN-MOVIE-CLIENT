import fs from "fs";
import path from "path";
import Movie from "../models/Movie.js";
import User from "../models/User.js"; // Needed for dashboard stats

// 1. Get all movies or by category
export const getAllMovies = async (req, res) => {
  const category = req.query.category;
  try {
    const query = category ? { category } : {};
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies", error: err });
  }
};

// 2. Toggle Like / Dislike
export const toggleReaction = async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    if (reaction === "like") {
      movie.dislikes.pull(userId);
      if (!movie.likes.includes(userId)) movie.likes.push(userId);
    } else if (reaction === "dislike") {
      movie.likes.pull(userId);
      if (!movie.dislikes.includes(userId)) movie.dislikes.push(userId);
    }

    await movie.save();
    res.json({
      status: reaction === "like" ? "Liked" : "Disliked",
      likes: movie.likes.length,
      dislikes: movie.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Reaction error", error: err });
  }
};

// 3. Add or Update Review
export const addOrUpdateReview = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const existingReview = movie.reviews.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReview) {
      existingReview.comment = comment;
      existingReview.createdAt = Date.now();
    } else {
      movie.reviews.push({ userId, name: userName, comment });
    }

    await movie.save();
    res.json({ message: "Review saved", reviews: movie.reviews });
  } catch (err) {
    res.status(500).json({ message: "Review error", error: err });
  }
};

// 4. Delete Review
export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    movie.reviews = movie.reviews.filter(
      (r) => !(r.userId.toString() === userId && r._id.toString() === reviewId)
    );
    await movie.save();
    res.json({ message: "Review deleted", reviews: movie.reviews });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err });
  }
};

// 5. Toggle Watch Later
export const toggleWatchLater = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const index = movie.watchLater.findIndex((uid) => uid.toString() === userId);

    if (index !== -1) {
      movie.watchLater.splice(index, 1);
    } else {
      movie.watchLater.push(userId);
    }

    await movie.save();
    res.json({
      message: index === -1 ? "Added to Watch Later" : "Removed from Watch Later",
    });
  } catch (err) {
    res.status(500).json({ message: "Watch Later toggle failed", error: err });
  }
};

// 6. Toggle Download
export const toggleDownload = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const index = movie.downloads.findIndex((uid) => uid.toString() === userId);

    if (index !== -1) {
      movie.downloads.splice(index, 1);
    } else {
      if (movie.downloads.length >= 3) {
        return res.status(403).json({ message: "Download limit reached (3 per user)" });
      }
      movie.downloads.push(userId);
    }

    await movie.save();
    res.json({
      message: index === -1 ? "Marked as Downloaded" : "Download removed",
    });
  } catch (err) {
    res.status(500).json({ message: "Download toggle failed", error: err });
  }
};

// 7. Stream Movie
export const streamMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie || !movie.filePath) {
      return res.status(404).json({ message: "Video file not found" });
    }

    const filePath = path.join("uploads", "videos", movie.filePath);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) return res.status(416).send("Requires Range header");

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    file.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Streaming failed", error: err });
  }
};

// 8. Increment View Count
export const incrementViewCount = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    if (!movie.views.includes(userId)) {
      movie.views.push(userId);
      await movie.save();
    }

    res.json({ message: "View recorded", totalViews: movie.views.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to record view", error: err });
  }
};

// 9. Report Abuse
export const reportMovieAbuse = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.abuseReports.push({ userId, reason, reportedAt: new Date() });
    await movie.save();

    res.json({ message: "Abuse reported", reports: movie.abuseReports.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to report abuse", error: err });
  }
};

// 10. Get Dashboard Stats (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();

    const movieStats = await Movie.find({});
    const totalDownloads = movieStats.reduce((acc, m) => acc + m.downloads.length, 0);
    const totalViews = movieStats.reduce((acc, m) => acc + m.views.length, 0);

    res.json({
      totalUsers,
      totalMovies,
      totalDownloads,
      totalViews,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats", error: err });
  }
};

// Admin: Add a new movie
export const addMovie = async (req, res) => {
  const { title, description, category, filePath, duration } = req.body;
  try {
    const newMovie = new Movie({
      title,
      description,
      category,
      filePath,
      duration,
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie added successfully", movie: newMovie });
  } catch (err) {
    res.status(500).json({ message: "Failed to add movie", error: err });
  }
};

// Admin: Edit an existing movie
export const editMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, filePath, duration } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.category = category || movie.category;
    movie.filePath = filePath || movie.filePath;
    movie.duration = duration || movie.duration;

    await movie.save();
    res.json({ message: "Movie updated", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to update movie", error: err });
  }
};

// Admin: Delete a movie
export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json({ message: "Movie deleted successfully", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete movie", error: err });
  }
};
