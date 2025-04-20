import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update preferred language
// @route   PUT /api/users/language
// @access  Private
export const updatePreferredLanguage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.preferredLanguage = req.body.language;
    await user.save();

    res.json({ message: 'Preferred language updated', preferredLanguage: user.preferredLanguage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ===================== Admin Controllers =======================

// @desc    Get all users
// @route   GET /api/users/admin/all-users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Suspend a user
// @route   PUT /api/users/admin/suspend/:id
// @access  Admin
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = true;
    await user.save();

    res.json({ message: `User ${user.name} has been suspended.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unsuspend a user
// @route   PUT /api/users/admin/unsuspend/:id
// @access  Admin
export const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = false;
    await user.save();

    res.json({ message: `User ${user.name} has been unsuspended.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Ban a user
// @route   PUT /api/users/admin/ban/:id
// @access  Admin
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = true;
    await user.save();

    res.json({ message: `User ${user.name} has been banned.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unban a user
// @route   PUT /api/users/admin/unban/:id
// @access  Admin
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = false;
    await user.save();

    res.json({ message: `User ${user.name} has been unbanned.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/admin/delete/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `User ${user.name} has been deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
