import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Snackbar,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip, // Import Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarRateIcon from '@mui/icons-material/StarRate';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import Socket.IO client

const ReviewModeration = () => {
    const [movieData, setMovieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [socket, setSocket] = useState(null);

    // Fetch movie data
    const fetchAdminMovieData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/movies/admin/movies-data', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovieData(res.data);
        } catch (err) {
            console.error('Failed to fetch movie data:', err);
            setError('Failed to fetch movie data.');
        } finally {
            setLoading(false);
        }
    };

    // Delete entire history of likes, dislikes, and ratings (including user names)
    const deleteHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('/api/admin/delete-likes-dislikes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAdminMovieData();
            setSnackbar({ open: true, message: response.data.message || 'All history cleared successfully.' });
        } catch (err) {
            console.error('Failed to delete history:', err);
            setError('Failed to delete all history.');
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ open: false });
    };

    useEffect(() => {
        fetchAdminMovieData();

        // Initialize WebSocket connection
        const newSocket = io('http://localhost:5000', { // Replace with your backend URL
            withCredentials: true,
        });
        setSocket(newSocket);

        // Clean up socket connection on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listen for movie interaction updates
        socket.on('movieInteraction', (data) => {
            console.log('Received movieInteraction:', data);
            setMovieData((prevMovieData) =>
                prevMovieData.map((movie) =>
                    movie._id === data.movieId
                        ? { ...movie, likes: data.likes, dislikes: data.dislikes }
                        : movie
                )
            );
        });

        // Listen for new reviews (optional)
        socket.on('newReview', (data) => {
            console.log('Received newReview:', data);
            setMovieData((prevMovieData) =>
                prevMovieData.map((movie) =>
                    movie._id === data.movieId ? { ...movie, reviews: [...movie.reviews, data.review] } : movie
                )
            );
        });

        // Listen for deleted reviews (optional)
        socket.on('deletedReview', (data) => {
            console.log('Received deletedReview:', data);
            setMovieData((prevMovieData) =>
                prevMovieData.map((movie) =>
                    movie._id === data.movieId
                        ? { ...movie, reviews: movie.reviews.filter((review) => review._id !== data.reviewId) }
                        : movie
                )
            );
        });

        // Listen for other events if needed (e.g., newMovie, updatedMovie, deletedMovie)

        return () => {
            socket.off('movieInteraction');
            socket.off('newReview');
            socket.off('deletedReview');
            // socket.off('newMovie');
            // socket.off('updatedMovie');
            // socket.off('deletedMovie');
        };
    }, [socket]);


    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Review Moderation
                </Typography>
                {loading && <CircularProgress />}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {!loading && !error && (
                    <Grid container spacing={3}>
                        {movieData.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography>No movie data found.</Typography>
                            </Grid>
                        ) : (
                            movieData.map((movie) => (
                                <Grid item xs={12} sm={6} md={4} key={movie._id}>
                                    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {movie.title}
                                            </Typography>
                                            <Box display="flex" flexDirection="column" mb={1}>
                                                <Box display="flex" alignItems="center" mb={0.5}>
                                                    <ThumbUpIcon color="primary" sx={{ mr: 0.5 }} />
                                                    <Typography variant="body2" sx={{ mr: 1 }}>{movie.likes.length}</Typography>
                                                    {movie.likes.length > 0 && (
                                                        <Tooltip title={movie.likes.map(user => user.name).join(', ')}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                ({movie.likes.length} {movie.likes.length === 1 ? 'Like' : 'Likes'})
                                                            </Typography>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                                <Box display="flex" alignItems="center">
                                                    <ThumbDownIcon color="error" sx={{ mr: 0.5 }} />
                                                    <Typography variant="body2" sx={{ mr: 1 }}>{movie.dislikes.length}</Typography>
                                                    {movie.dislikes.length > 0 && (
                                                        <Tooltip title={movie.dislikes.map(user => user.name).join(', ')}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                ({movie.dislikes.length} {movie.dislikes.length === 1 ? 'Dislike' : 'Dislikes'})
                                                            </Typography>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>
                                            {movie.reviews.length > 0 ? (
                                                <Box mt={2}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Reviews:
                                                    </Typography>
                                                    <List dense>
                                                        {movie.reviews.map((review) => (
                                                            <ListItem key={review._id} divider>
                                                                <ListItemText
                                                                    primary={review.comment || 'No comment'}
                                                                    secondary={
                                                                        <>
                                                                            <Typography variant="caption" color="textSecondary">
                                                                                User: {review.userName || 'N/A'}
                                                                            </Typography>
                                                                            {review.rating && (
                                                                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                                                                    <StarRateIcon sx={{ fontSize: 'small', color: 'gold', verticalAlign: 'middle', mr: 0.3 }} />
                                                                                    {review.rating} / 5
                                                                                </Typography>
                                                                            )}
                                                                        </>
                                                                    }
                                                                />
                                                                <ListItemSecondaryAction>
                                                                    <IconButton edge="end" aria-label="delete">
                                                                        <DeleteIcon color="error" />
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" mt={2} color="textSecondary">
                                                    No reviews yet.
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteHistory}
                    sx={{ mt: 3 }}
                >
                    Delete All History
                </Button>
            </CardContent>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Card>
    );
};

export default ReviewModeration;