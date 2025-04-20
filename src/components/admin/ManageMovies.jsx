import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import movieService from '../../services/movieService';
import { green } from '@mui/material/colors';

const ManageMovies = () => {
    const [movies, setMovies] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: '',
        releaseYear: '',
        genre: '',
        thumbnailUrl: '',
        videoUrl: '',
    });
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const res = await movieService.getAllMovies();
            setMovies(res);
        } catch (err) {
            setSnackbarMessage(err.message || 'Error occurred while fetching movies.');
            setSnackbarOpen(true);
            console.error('Failed to fetch movies:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (movie = null) => {
        if (movie) {
            setEditingMovieId(movie._id);
            setFormData({ ...movie });
        } else {
            setEditingMovieId(null);
            setFormData({
                title: '', description: '', language: '', releaseYear: '', genre: '', thumbnailUrl: '', videoUrl: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            title: '', description: '', language: '', releaseYear: '', genre: '', thumbnailUrl: '', videoUrl: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            console.log('Token from localStorage (handleSubmit):', token); // ADDED LOG
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            };

            if (editingMovieId) {
                await movieService.editMovie(editingMovieId, formData, { headers });
                setSnackbarMessage('Movie updated successfully!');
            } else {
                await movieService.addMovie(formData, { headers });
                setSnackbarMessage('Movie added successfully!');
            }
            fetchMovies();
            setSnackbarOpen(true);
            handleClose();
        } catch (err) {
            setSnackbarMessage(err.message || 'Error occurred while saving the movie.');
            setSnackbarOpen(true);
            console.error('Error saving movie:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            console.log('Token from localStorage (handleDelete):', token); // ADDED LOG
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            await movieService.deleteMovie(id, { headers });
            fetchMovies();
            setSnackbarMessage('Movie deleted successfully!');
            setSnackbarOpen(true);
        } catch (err) {
            setSnackbarMessage(err.message || 'Error occurred while deleting the movie.');
            setSnackbarOpen(true);
            console.error('Error deleting movie:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>🎬 Manage Movies</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2, borderRadius: 2, paddingX: 3, fontWeight: 'bold', textTransform: 'capitalize' }}
                    onClick={() => handleOpen()}
                >
                    ➕ Add Movie
                </Button>
                {loading ? (
                    <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
                ) : (
                    <Grid container spacing={2} mt={2}>
                        {movies.map((movie) => (
                            <Grid item xs={12} sm={6} md={4} key={movie._id}>
                                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{movie.title}</Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>{movie.description}</Typography>
                                        <Typography variant="caption" sx={{ mb: 1 }}>
                                            🎭 {movie.genre} | 🌐 {movie.language} | 📅 {movie.releaseYear}
                                        </Typography>
                                        <div style={{ marginTop: '10px' }}>
                                            <Button
                                                variant="outlined"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleOpen(movie)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(movie._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CardContent>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingMovieId ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
                <DialogContent>
                    <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                    <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} sx={{ mt: 2 }} />
                    <TextField label="Language" name="language" value={formData.language} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                    <TextField label="Release Year" name="releaseYear" type="number" value={formData.releaseYear} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                    <TextField label="Genre" name="genre" value={formData.genre} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                    <TextField label="Thumbnail URL" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                    <TextField label="Video URL" name="videoUrl" value={formData.videoUrl} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ backgroundColor: green[500], '&:hover': { backgroundColor: green[700] } }}
                    >
                        {editingMovieId ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Card>
    );
};

export default ManageMovies;