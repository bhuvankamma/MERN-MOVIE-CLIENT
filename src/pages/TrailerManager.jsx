import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  CardMedia,
  Stack,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllTrailers, deleteTrailer } from '../services/trailerService';
import { useAuth } from '../auth_temp/AuthContext';

const TrailerManager = () => {
  const { user } = useAuth();
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getAllTrailers(token);
        setTrailers(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching trailers:', err);
        setError('Failed to load trailers.');
        setLoading(false);
      }
    };

    fetchTrailers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this trailer?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await deleteTrailer(id, token);
      setTrailers((prev) => prev.filter((trailer) => trailer._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete trailer:', err);
      alert('Failed to delete trailer.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading trailers...</Typography>
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
        🎬 Trailer Manager
      </Typography>
      {trailers.length === 0 ? (
        <Typography>No trailers uploaded yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {trailers.map((trailer) => (
            <Card key={trailer._id} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CardMedia
                component="video"
                src={trailer.videoUrl}
                controls
                sx={{ width: 250, height: 140, borderRadius: 2, mr: 3 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{trailer.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded on: {new Date(trailer.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
              <Tooltip title="Delete Trailer">
                <IconButton color="error" onClick={() => handleDelete(trailer._id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TrailerManager;
