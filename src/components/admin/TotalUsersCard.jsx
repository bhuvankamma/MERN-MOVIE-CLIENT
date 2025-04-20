import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAuth } from '../../auth_temp/AuthContext';

const TotalUsersCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true); // Visibility state

  const fetchTotalUsers = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');

      if (!token) {
        console.error('Token missing: Cannot fetch total users');
        setErrorMessage('Unauthorized: Token missing');
        return;
      }

      const res = await axios.get('/api/admin/total-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalUsers(res.data.totalUsers || 0);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error fetching total users:', err);
      const msg = err.response?.data?.message || 'Failed to fetch total users';
      setErrorMessage(msg);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    const interval = setInterval(fetchTotalUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null; // Hide the card if not visible

  return (
    <Card
      sx={{
        backgroundColor: '#1e1e1e',
        color: '#00e676',
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 300, // Limit the width
        margin: '20px auto', // Center the card
        padding: 2, // Add internal spacing
        position: 'relative', // Enable positioning for the close button
        '@media (max-width: 600px)': {
          maxWidth: '95%', // Adjust for smaller screens
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#ffffff',
        }}
        aria-label="close"
        onClick={() => setIsVisible(false)} // Function to hide the card
      >
        <CloseIcon />
      </IconButton>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <GroupIcon sx={{ fontSize: 40 }} />
        <div>
          <Typography variant="h6" fontWeight="bold">
            Total Users
          </Typography>
          {errorMessage ? (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          ) : (
            <Typography variant="h4">{totalUsers}</Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalUsersCard;