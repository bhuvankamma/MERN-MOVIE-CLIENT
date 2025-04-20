// AdminContactInbox.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Email, Reply } from '@mui/icons-material';
import axios from 'axios';

const AdminContactInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/contact-messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch contact messages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  return (
    <Card sx={{ mb: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <Email sx={{ mr: 1 }} />
          User Contact Inbox
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : messages.length === 0 ? (
          <Typography>No contact messages available.</Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${msg.name} (${msg.email})`}
                    secondary={
                      <>
                        <Typography variant="body2">{msg.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(msg.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton
                    onClick={() =>
                      window.location.href = `mailto:${msg.email}`
                    }
                  >
                    <Reply />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminContactInbox;
