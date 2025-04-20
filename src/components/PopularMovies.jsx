// components/PopularMovies.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, Grid } from '@mui/material';

const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        🎬 Popular Movies
      </Typography>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{ borderRadius: '12px', height: 280 }}
              />
              <Typography variant="subtitle2" align="center" p={1}>
                {movie.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularMovies;
