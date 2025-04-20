import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  withCredentials: true, // for cookies if using auth
});

// Fetch data functions
export const getTotalUsers = () => API.get('/total-users');
export const getTotalMovies = () => API.get('/total-movies');
export const getSuspendedUsers = () => API.get('/suspended-users');
export const getAnalyticsData = () => API.get('/analytics');
export const getAdminNotifications = () => API.get('/notifications');
export const getAllUsers = () => API.get('/users'); // Get all users for management

// User management functions
export const suspendUser = (userId) => API.put(`/suspend/${userId}`);
export const banUser = (userId) => API.put(`/ban/${userId}`);
export const activateUser = (userId) => API.put(`/activate/${userId}`);

// Example of handling API errors and success in response
export const handleApiCall = async (apiCall, userId) => {
  try {
    const response = await apiCall(userId);
    return response.data; // Return data if call is successful
  } catch (error) {
    console.error('API Error: ', error);
    throw error.response?.data || error.message || 'Error occurred while processing your request.';
  }
};
