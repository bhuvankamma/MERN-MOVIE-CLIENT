// src/pages/MessagesAdmin.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Divider } from '@mui/material';
import { getAllMessages } from '../services/messageService';
import { useAuth } from '../auth_temp/AuthContext';

const MessagesAdmin = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getAllMessages(token);
        setMessages(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading messages...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📩 User Messages
      </Typography>
      {messages.length === 0 ? (
        <Typography>No messages found.</Typography>
      ) : (
        messages.map((msg) => (
          <Card key={msg._id} sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                From: {msg.senderName}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Subject: {msg.subject || 'No Subject'}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{msg.message}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                Sent on: {new Date(msg.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MessagesAdmin;
