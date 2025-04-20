// client/src/services/trailerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trailers';

// 🎞️ Upload a trailer
export const uploadTrailer = async (trailerData, token) => {
  const res = await axios.post(API_URL, trailerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 📽️ Get all trailers
export const getAllTrailers = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ❌ Delete a trailer by ID
export const deleteTrailer = async (trailerId, token) => {
  const res = await axios.delete(`${API_URL}/${trailerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
