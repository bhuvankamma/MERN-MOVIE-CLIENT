import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { getRecommendedMovies } from '../services/AuthService';

const Recommended = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getRecommendedMovies();
        setRecommended(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        background: '#000',
        minHeight: '30vh',
        color: '#fff',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 400,
          mb: 2,
          px: 1,
          fontSize: '1.2rem',
        }}
      >
        🎯 Recommended For You
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress sx={{ color: '#e50914' }} />
        </Box>
      ) : recommended.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 1,
          }}
        >
          {recommended.map((movie) => (
            <Tooltip title={movie.title} arrow key={movie._id}>
              <Box
                component="img"
                src={movie.poster || 'https://via.placeholder.com/100x150'}
                alt={movie.title}
                sx={{
                  width: '100%',
                  height: '10px',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    cursor: 'pointer',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      ) : (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>
          No recommendations:🤷‍♂️
        </Typography>
      )}
    </Box>
  );
};

export default Recommended;
