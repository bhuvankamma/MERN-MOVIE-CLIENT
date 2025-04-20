import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationBanner = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success" sx={{ backgroundColor: '#333', color: '#00e676' }} onClose={onClose}>
        ✅ "{message}" loaded!
      </Alert>
    </Snackbar>
  );
};

export default NotificationBanner;
