import api from './api';

// ============================
// LANGUAGE PREFERENCE
// ============================

export const getUserLanguage = () => api.get('/user/language');
export const setUserLanguage = (language) =>
  api.post('/user/language', { language });

// ============================
// USER PROFILE (Optional)
// ============================

export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (profileData) =>
  api.put('/user/profile', profileData);

// ============================
// REVIEWS
// ============================

export const getUserReviews = (movieId) =>
  api.get(`/user/reviews/${movieId}`);

export const submitReview = (movieId, reviewData) =>
  api.post(`/user/reviews/${movieId}`, reviewData);

export const getMovieReviews = getUserReviews; // ✅ Added alias

// ============================
// CONTINUE WATCHING
// ============================

export const getContinueWatching = () =>
  api.get('/user/continue-watching');
