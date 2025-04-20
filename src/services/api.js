// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this if your backend URL is different
  withCredentials: true, // optional, based on your CORS setup
});

export default api;
