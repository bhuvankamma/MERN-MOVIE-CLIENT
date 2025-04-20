// components/Admin/AdminHome.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const AdminHome = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👋 Welcome Admin!
      </Typography>
      <Typography variant="body1">
        Use the sidebar to manage movies, users, and view messages.
      </Typography>
    </Box>
  );
};

export default AdminHome;
