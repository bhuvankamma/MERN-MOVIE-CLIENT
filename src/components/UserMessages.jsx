// src/components/UserMessages.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', text: '' });
  const [loading, setLoading] = useState(true);

  const fetchUserMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messages/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch user messages:', error);
      setSnackbar({ open: true, type: 'error', text: 'Failed to load your messages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMessages();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        py: 4,
        px: 2,
        minHeight: '80vh',
      }}
    >
      <Typography variant="h5" gutterBottom align="center" fontWeight={600}>
        📬 Your Messages & Admin Replies
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Typography variant="body1" align="center" mt={2}>
          You haven’t sent any messages yet.
        </Typography>
      ) : (
        messages.map((msg) => (
          <Paper
            key={msg._id}
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              border: '1px solid #ddd',
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" color="primary">
              Subject: {msg.subject}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Your Message:</strong> {msg.message}
            </Typography>

            {msg.isReplied ? (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                  🟢 Admin Replied:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontStyle: 'italic',
                    color: '#2e7d32',
                    backgroundColor: '#e8f5e9',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  “{msg.reply}”
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                ⏳ Awaiting admin response...
              </Typography>
            )}
          </Paper>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserMessages;
