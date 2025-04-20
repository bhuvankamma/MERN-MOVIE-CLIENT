import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const MovieCard = ({ movie, onReview }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleWatch = () => {
    setShowPlayer(!showPlayer);
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Card
        sx={{
          maxWidth: 300,
          borderRadius: 4,
          boxShadow: 4,
          m: 2,
          backgroundColor: '#fffef5'
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={movie.poster || 'https://via.placeholder.com/300x400.png?text=No+Image'}
          alt={movie.title}
        />
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.genre} | {movie.year}
          </Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={() => onReview(movie)}
              variant="outlined"
              sx={{ color: '#e0a800', borderColor: '#e0a800', fontWeight: 'bold' }}
            >
              Review
            </Button>

            {/* Watch Button */}
            {movie.videoUrl && (
              <Button
                onClick={handleWatch}
                variant="contained"
                sx={{ backgroundColor: '#e0a800', color: '#fff', fontWeight: 'bold' }}
              >
                {showPlayer ? 'Close' : 'Watch'}
              </Button>
            )}
          </Box>

          {/* Video iframe toggle */}
          {showPlayer && movie.videoUrl && (
            <Box mt={2}>
              <iframe
                width="100%"
                height="315"
                src={movie.videoUrl}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
