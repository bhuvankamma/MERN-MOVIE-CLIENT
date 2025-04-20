import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AccountSuspended = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally, you could handle any necessary actions when this page loads
    // For example, log this event for tracking or analytics.
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('/suspended-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={10} sx={{ padding: 4, width: { xs: 300, sm: 400 }, borderRadius: 4, backgroundColor: '#fffafa' }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ color: '#e53935' }}>
            Account Suspended
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ color: '#555' }} mt={2}>
            We're sorry, your account has been temporarily suspended due to unusual activity or violations of our terms.
          </Typography>

          <Typography variant="body2" textAlign="center" sx={{ color: '#888' }} mt={2}>
            Please contact support or try again later for more information.
          </Typography>

          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/contact-us')}
              sx={{
                backgroundColor: '#e53935',
                '&:hover': { backgroundColor: '#c62828' },
                fontWeight: 'bold',
              }}
            >
              Contact Support
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', marginTop: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                color: '#555',
                borderColor: '#555',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#f4c542' }
              }}
            >
              Go Back to Home
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AccountSuspended;
