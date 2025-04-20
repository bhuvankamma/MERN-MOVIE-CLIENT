if (user.suspended) {
    return res.status(403).json({ message: 'Your account is suspended.' });
  }
  if (user.banned) {
    return res.status(403).json({ message: 'Your account is banned.' });
  }
  