// src/pages/ContactAdmin.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { sendMessage } from '../services/messageService';
import { useAuth } from '../auth_temp/AuthContext';

const ContactAdmin = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setSuccessMsg('❌ Subject and message cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      await sendMessage(
        {
          senderId: user._id,
          senderName: user.name,
          subject,
          message,
        },
        token
      );

      setSuccessMsg('✅ Message sent successfully!');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('❌ Message sending failed:', error);
      setSuccessMsg('❌ Failed to send. Try again later.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Contact Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Subject"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={!subject.trim() || !message.trim()}
          >
            Send Message
          </Button>
        </form>
        {successMsg && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: successMsg.startsWith('✅') ? 'green' : 'red',
            }}
          >
            {successMsg}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ContactAdmin;
