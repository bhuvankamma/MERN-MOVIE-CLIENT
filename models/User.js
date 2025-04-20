// backend/models/User.js 

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  downloadedMovies: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
  ],
  isSuspended: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  // Optional: Add reason for action taken (useful for admin records)
  adminNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);
