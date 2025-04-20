// src/api/AuthService.js
import apiClient from '../api/apiClient';

// ============================
// AUTH SECTION
// =========================

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Registration failed';
    console.error('📛 Registration Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Login failed';
    console.error('🔐 Login Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// Unsuspend user (Admin-only usage)
export const unsuspendUser = async (userId) => {
  try {
    const response = await apiClient.put(`/auth/unsuspend/${userId}`);
    return response.data;
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Unsuspend failed';
    console.error('⚠️ Unsuspend Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// ============================
// CONTINUE WATCHING SECTION
// ============================

// ✅ Fetch Continue Watching data
export const getContinueWatching = async () => {
  try {
    const response = await apiClient.get('/user/continue-watching');
    return response.data;
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch continue watching';
    console.error('⏯️ Continue Watching Error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// ============================
// WATCHLIST SECTION
// ============================

export const getUserWatchlist = () => apiClient.get('/user/watchlist');

export const removeFromWatchlist = (movieId) =>
  apiClient.delete(`/user/watchlist/${movieId}`);

// ============================
// DOWNLOADS SECTION
// ============================

export const getUserDownloads = () => apiClient.get('/user/downloads');

export const requestDownload = (movieId) =>
  apiClient.post(`/user/downloads/${movieId}`);

export const deleteDownload = (downloadId) =>
  apiClient.delete(`/user/downloads/${downloadId}`);

// ============================
// RECOMMENDATIONS SECTION
// ============================

export const getRecommendedMovies = () =>
  apiClient.get('/user/recommendations');
