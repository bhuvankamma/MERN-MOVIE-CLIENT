import React, { useState } from 'react';
import { Box, Button, Typography, Slide } from '@mui/material';
import ContactUs from '../pages/ContactUs';
// adjust this path based on your folder structure

const Download = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Download Section
      </Typography>

      {/* Example: Download-related content */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        You can download up to 3 movies. Need help or facing issues? Reach out to us.
      </Typography>

      <Button
        onClick={() => setShowContactForm(!showContactForm)}
        variant="contained"
        color="error"
        sx={{ textTransform: 'none', mb: 2 }}
      >
        {showContactForm ? 'Close Contact Form' : 'Contact Us'}
      </Button>

      {/* Slide in/out Contact Form */}
      <Slide direction="up" in={showContactForm} mountOnEnter unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <ContactUs />
        </Box>
      </Slide>
    </Box>
  );
};

export default Download;
