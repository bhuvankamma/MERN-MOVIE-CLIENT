import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, CircularProgress,
  Alert, TextField, IconButton, Tooltip, Snackbar, Button
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replies, setReplies] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [unreadCount, setUnreadCount] = useState(0);  // New state to track unread messages

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unreadMessages = response.data.filter((msg) => !msg.isRead); // Filter unread messages
      setMessages(response.data);
      setUnreadCount(unreadMessages.length); // Update unread message count
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendReply = async (id) => {
    const token = localStorage.getItem('token');
    const replyText = replies[id]?.trim();
    if (!replyText) return;

    try {
      await axios.put(`/api/messages/reply/${id}`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: 'Reply sent successfully!' });
      setReplies((prev) => ({ ...prev, [id]: '' }));
      setShowReplyBox((prev) => ({ ...prev, [id]: false }));

      // Remove message from UI after 5s
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      }, 5000);

      // Mark message as read after replying
      markMessageAsRead(id);
    } catch (error) {
      console.error('Reply error:', error);
      alert('Error sending reply. Try again.');
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(id);
    }
  };

  const toggleReplyBox = (id) => {
    setShowReplyBox((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeMessageFromUI = (id) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  };

  const handleDeleteAllMessages = async () => {
    const confirm = window.confirm("Are you sure you want to delete all chat history?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/messages/admin/delete-all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([]);
      setSnackbar({ open: true, message: 'All chat history deleted successfully.' });
    } catch (err) {
      console.error('Delete history failed:', err);
      setSnackbar({ open: true, message: 'Failed to delete chat history.' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  const markMessageAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/messages/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update message status locally to avoid refetching
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg))
      );
      setUnreadCount((prev) => prev - 1); // Decrease unread message count
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          <MailOutlineIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Admin Messages
        </Typography>

        {unreadCount > 0 && (
          <Box
            sx={{
              bgcolor: '#f44336',
              color: '#fff',
              borderRadius: 2,
              padding: '6px 12px',
              fontSize: '14px',
            }}
          >
            You have {unreadCount} unread messages!
          </Box>
        )}

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteAllMessages}
          sx={{ borderRadius: 3 }}
        >
          Delete History
        </Button>
      </Box>

      {messages.length === 0 ? (
        <Typography>No messages found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {messages.map((msg) => (
            <Grid item xs={12} sm={6} md={4} key={msg._id}>
              <Card
                sx={{
                  minHeight: 350,
                  p: 2,
                  bgcolor: '#f3f4f6',
                  borderRadius: 4,
                  boxShadow: 5,
                  position: 'relative',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">{msg?.user?.name || 'Unknown User'}</Typography>
                    <Tooltip title="Close Message">
                      <IconButton onClick={() => removeMessageFromUI(msg._id)}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    Email: {msg?.user?.email || 'N/A'}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1, color: '#333' }}>
                    Subject: {msg.subject}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1.5 }}>{msg.message}</Typography>

                  <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                    Sent on: {new Date(msg.createdAt).toLocaleString()}
                  </Typography>

                  {/* Reply Section */}
                  {!showReplyBox[msg._id] ? (
                    <IconButton
                      onClick={() => {
                        toggleReplyBox(msg._id);
                        markMessageAsRead(msg._id); // Mark as read when message is opened
                      }}
                      sx={{
                        mt: 1,
                        bgcolor: '#1976d2',
                        color: '#fff',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#115293' },
                      }}
                    >
                      <ReplyIcon />
                    </IconButton>
                  ) : (
                    <Box mt={2}>
                      <TextField
                        label="Type your reply..."
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={3}
                        value={replies[msg._id] || ''}
                        onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, msg._id)}
                        sx={{ mb: 2, backgroundColor: '#fff', borderRadius: 2 }}
                      />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Tooltip title="Send Reply">
                          <IconButton
                            color="success"
                            onClick={() => handleSendReply(msg._id)}
                            disabled={!replies[msg._id]?.trim()}
                            sx={{
                              bgcolor: 'success.main',
                              color: '#fff',
                              borderRadius: 2,
                              '&:hover': { bgcolor: 'success.dark' },
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                        <Button
                          color="error"
                          onClick={() => toggleReplyBox(msg._id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default AdminMessages;
