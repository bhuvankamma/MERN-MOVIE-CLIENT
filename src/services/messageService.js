// client/src/services/messageService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/messages';

// 🧠 Helper to get headers with auth token
const getAuthHeaders = (token) => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

// 📨 Send a message (user → admin or vice versa)
export const sendMessage = async (messageData, token) => {
  try {
    const res = await axios.post(API_URL, messageData, getAuthHeaders(token));
    return res.data;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error?.response?.data || { error: 'Message send failed' };
  }
};

// 📬 Fetch messages sent by the current user
export const getUserMessages = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/user`, getAuthHeaders(token));
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching user messages:', error);
    throw error?.response?.data || { error: 'Could not fetch user messages' };
  }
};

// 🔥 Fetch all messages (admin only)
// Updated to the correct endpoint '/admin' to match the backend route
export const getAllMessages = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/admin`, getAuthHeaders(token));
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching all messages:', error);
    throw error?.response?.data || { error: 'Could not fetch all messages' };
  }
};
