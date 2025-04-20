import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Snackbar, Alert, Box } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setSnackbar({ open: true, message: 'Failed to fetch users.', severity: 'error' });
    }
  };

  const toggleSuspend = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint =
        currentStatus === 'active'
          ? `/api/admin/users/${userId}/suspend`
          : `/api/admin/users/${userId}/activate`;

      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit(currentStatus === 'active' ? 'suspend' : 'reactivate', { userId });

      setSnackbar({
        open: true,
        message: `User ${currentStatus === 'active' ? 'suspended' : 'reactivated'} successfully!`,
        severity: 'success',
      });

      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err.message);
      setSnackbar({ open: true, message: 'Failed to update user status.', severity: 'error' });
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    fetchUsers();

    newSocket.on('userSuspended', ({ userId }) => {
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, status: 'suspended' } : user))
      );
    });

    newSocket.on('userActivated', ({ userId }) => {
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, status: 'active' } : user))
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderUsers = (filterStatus) => {
    return users
      .filter((user) => user.status === filterStatus)
      .map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user._id}>
          <Card>
            <CardContent>
              <Typography>
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography>
                <strong>Status:</strong> {user.status}
              </Typography>
              {user.status !== 'banned' && (
                <Button
                  variant="contained"
                  color={user.status === 'active' ? 'error' : 'success'}
                  onClick={() => toggleSuspend(user._id, user.status)}
                  sx={{ mt: 2 }}
                >
                  {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ));
  };

  return (
    <>
      <Card sx={{ mb: 4, backgroundColor: '#f7f7f7', p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          <Grid container spacing={2}>{renderUsers('active')}</Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 4, backgroundColor: '#e0f7fa', borderRadius: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#00796b', textAlign: 'center' }}>
          Suspended Accounts
        </Typography>
        <Grid container spacing={2}>{renderUsers('suspended')}</Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserManagement;
