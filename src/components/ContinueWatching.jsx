// src/components/ContinueWatching.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  LinearProgress
} from '@mui/material';
import { getContinueWatching } from '../services/userApi';
import { useAuth } from '../auth_temp/AuthContext';


const ContinueWatching = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useAuth(); // ✅ should work now

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getContinueWatching();
        setMovies(res.data || []);
      } catch (err) {
        console.error('Error fetching continue watching data:', err);
      }
    };

    if (user) fetchData();
  }, [user]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        ⏯️ Continue Watching
      </Typography>

      {movies.length === 0 ? (
        <Typography>You haven't started watching anything yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={movie.poster || 'https://via.placeholder.com/300x450'}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progress: {movie.progress || 0}%
                  </Typography>
                  <LinearProgress variant="determinate" value={movie.progress || 0} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ContinueWatching;
