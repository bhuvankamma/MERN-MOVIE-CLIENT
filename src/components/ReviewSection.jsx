import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMovieReviews, submitReview } from '../services/userApi'; // ✅ Use correct API

const abusiveWords = ['badword1', 'badword2', 'abuse'];

const ReviewSection = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [message, setMessage] = useState({ open: false, type: 'info', text: '' });
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const res = await getMovieReviews(movieId);
      setReviews(res.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage({ open: true, type: 'error', text: 'Failed to load reviews.' });
    }
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  const containsAbuse = (text) => {
    const lowerText = text.toLowerCase();
    return abusiveWords.some((word) => lowerText.includes(word));
  };

  const handleSubmit = async () => {
    if (!newReview.trim()) {
      setMessage({ open: true, type: 'warning', text: 'Review cannot be empty.' });
      return;
    }

    if (containsAbuse(newReview)) {
      setMessage({ open: true, type: 'error', text: 'Abusive language is not allowed.' });
      return;
    }

    try {
      const res = await submitReview({ content: newReview, movieId });
      setReviews((prev) => [res.data, ...prev]);
      setNewReview('');
      setMessage({ open: true, type: 'success', text: 'Review submitted!' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage({ open: true, type: 'error', text: 'Failed to submit review.' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📝 Your Reviews
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Share your thoughts about the movie.
      </Typography>

      <Box sx={{ mt: 2, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Write a review"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          variant="outlined"
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={handleSubmit}
          disabled={!newReview.trim()}
        >
          Submit Review
        </Button>
      </Box>

      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {review.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/user/dashboard')}>
          ⬅ Back to Dashboard
        </Button>
      </Box>

      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={() => setMessage({ ...message, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={message.type}
          onClose={() => setMessage({ ...message, open: false })}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewSection;
