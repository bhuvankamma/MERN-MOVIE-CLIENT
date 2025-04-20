import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
  subject: yup.string().required('Please enter a subject'),
  message: yup.string().required('Please enter your message'),
});

const ContactUs = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const formRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const payload = {
        ...data,
        senderId: user?._id,
      };

      await axios.post('/api/messages', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: '✅ Message sent successfully!', severity: 'success' });

      // Reset the form after 3 seconds
      setTimeout(() => {
        reset();
      }, 3000);
    } catch (err) {
      setSnackbar({ open: true, message: '❌ Failed to send message.', severity: 'error' });
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const isValid = await trigger();
      if (isValid) handleSubmit(onSubmit)();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        px: 2,
      }}
    >
      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 5,
          p: isMobile ? 3 : 4,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#007BFF' }}
        >
          📩 Contact Us
        </Typography>

        <Stack spacing={2} mt={2}>
          <TextField
            label="Subject"
            fullWidth
            size="small"
            {...register('subject')}
            error={!!errors.subject}
            helperText={errors.subject?.message}
            onKeyDown={handleKeyDown}
          />

          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            size="small"
            {...register('message')}
            error={!!errors.message}
            helperText={errors.message?.message}
            onKeyDown={handleKeyDown}
          />

          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                borderRadius: '30px',
                backgroundColor: '#9c27b0',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
              }}
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontWeight: 'bold',
            bgcolor: snackbar.severity === 'success' ? 'green' : 'error.main',
            color: 'white',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;
