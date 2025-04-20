import axios from 'axios';

// Setup the base API instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// General error handler
const handleError = (error) => {
    if (error.response) {
        console.error('Response error:', error.response.data);
        return error.response.data.message || 'An error occurred while processing your request.';
    } else if (error.request) {
        console.error('Request error:', error.request);
        return 'No response received from the server. Please try again.';
    } else {
        console.error('Error:', error.message);
        return 'An unexpected error occurred. Please try again later.';
    }
};

// API call to fetch all movies (no token required)
export const getAllMovies = async () => {
    try {
        const response = await API.get('/movies');
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error(handleError(error));
    }
};

// API call to add a new movie
export const addMovie = async (movieData, config = {}) => {
    try {
        const response = await API.post('/movies', movieData, config); // Use the config argument
        return response.data;
    } catch (error) {
        console.error('Error adding movie:', error);
        throw new Error(handleError(error));
    }
};

// API call to edit an existing movie
export const editMovie = async (id, updatedData, config = {}) => {
    try {
        const response = await API.put(`/movies/${id}`, updatedData, config); // Use the config argument
        return response.data;
    } catch (error) {
        console.error('Error editing movie:', error);
        throw new Error(handleError(error));
    }
};

// API call to delete a movie
export const deleteMovie = async (id, config = {}) => {
    try {
        const response = await API.delete(`/movies/${id}`, config); // Use the config argument
        return response.data;
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw new Error(handleError(error));
    }
};

const movieService = {
    getAllMovies,
    addMovie,
    editMovie,
    deleteMovie,
};

export default movieService;