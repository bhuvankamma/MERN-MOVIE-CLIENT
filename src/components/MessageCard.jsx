// client/src/components/MessageCard.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MessageCard = ({ message, currentUserId }) => {
  const isSender = message.senderId === currentUserId;
  const align = isSender ? 'right' : 'left';

  return (
    <Box mb={2} display="flex" justifyContent={align}>
      <Paper
        sx={{
          p: 2,
          maxWidth: '75%',
          backgroundColor: isSender ? '#d1e7dd' : '#f8d7da',
        }}
      >
        <Typography variant="subtitle2">
          {isSender ? 'You' : 'Admin'} — {new Date(message.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
    </Box>
  );
};

export default MessageCard;
