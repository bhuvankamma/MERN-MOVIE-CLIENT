import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getUserWatchlist, removeFromWatchlist } from '../services/AuthService';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await getUserWatchlist();
        setWatchlist(res.data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
        setSnack({ open: true, message: 'Failed to load watchlist.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((movie) => movie._id !== movieId));
      setSnack({ open: true, message: 'Removed from watchlist.', severity: 'success' });
    } catch (err) {
      console.error('Error removing movie:', err);
      setSnack({ open: true, message: 'Could not remove movie.', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📺 Your Watchlist
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : watchlist.length === 0 ? (
        <Typography variant="body1">You have no movies in your watchlist.</Typography>
      ) : (
        <Grid container spacing={3}>
          {watchlist.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.description?.slice(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Button size="small" onClick={() => navigate(`/movie/${movie._id}`)}>
                    ▶ Watch Now
                  </Button>
                  <IconButton onClick={() => handleRemove(movie._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/user/dashboard')}>
          ⬅ Back to Dashboard
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Watchlist;
