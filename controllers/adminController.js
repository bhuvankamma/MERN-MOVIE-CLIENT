import User from '../models/User.js';
import ContactMessage from '../models/ContactMessage.js';
import Movie from '../models/Movie.js';

// 👥 Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// 🚫 Suspend a user
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.suspended = true;
    await user.save();

    res.status(200).json({ message: 'User suspended successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to suspend user', error: err.message });
  }
};

// ⛔ Ban a user
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.banned = true;
    await user.save();

    res.status(200).json({ message: 'User banned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to ban user', error: err.message });
  }
};

// 📬 Fetch all contact messages
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// ❌ Delete a movie by ID
export const deleteMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    await movie.remove();
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete movie', error: err.message });
  }
};

// 🎬 Add a new movie
export const addNewMovie = async (req, res) => {
  try {
    const { title, description, videoUrl, language, genre, thumbnailUrl } = req.body;

    const movie = new Movie({
      title,
      description,
      videoUrl,
      language,
      genre,
      thumbnailUrl
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add movie', error: err.message });
  }
};

// 📈 Admin Dashboard Summary Cards
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();

    // TODO: Replace with actual download and view tracking logic
    const totalDownloads = 123; // Placeholder
    const totalViews = 4567;    // Placeholder

    res.status(200).json({
      totalUsers,
      totalMovies,
      totalDownloads,
      totalViews,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
};

// 📊 Admin Dashboard Analytics Charts
export const getDashboardAnalytics = async (req, res) => {
  try {
    const viewsOverTime = [
      { month: 'Jan', views: 120 },
      { month: 'Feb', views: 200 },
      { month: 'Mar', views: 150 },
      { month: 'Apr', views: 300 },
    ];

    const ratingDistribution = [
      { rating: '5⭐', value: 50 },
      { rating: '4⭐', value: 30 },
      { rating: '3⭐', value: 10 },
      { rating: '2⭐', value: 7 },
      { rating: '1⭐', value: 3 },
    ];

    res.status(200).json({ viewsOverTime, ratingDistribution });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};
