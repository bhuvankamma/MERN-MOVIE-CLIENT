// client/src/pages/ChatWithAdmin.jsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getUserMessages } from '../services/messageService';
import { useAuth } from '../auth_temp/AuthContext'; // ✅ FIXED IMPORT PATH
import MessageCard from '../components/MessageCard';

const ChatWithAdmin = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getUserMessages(user._id);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [user]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Your Chat With Admin
      </Typography>
      {messages.length === 0 ? (
        <Typography>No messages yet. Send a message to start chatting.</Typography>
      ) : (
        messages.map((msg) => (
          <MessageCard key={msg._id} message={msg} isUser />
        ))
      )}
    </Box>
  );
};

export default ChatWithAdmin;
