import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTrendingMovies } from '../data/mockTrendingData'; // Ensure this path is correct

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);
  const delay = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!paused) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === mockTrendingMovies.length - 1 ? 0 : prevIndex + 1
        );
      }, delay);
    }
    return () => {
      resetTimeout();
    };
  }, [currentIndex, paused]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? mockTrendingMovies.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === mockTrendingMovies.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const movie = mockTrendingMovies[currentIndex];

  return (
    <div
      style={{
        width: '100%',
        height: '75vh',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem',
          transition: 'opacity 1s ease-in-out',
          opacity: 1,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '1.5rem',
            borderRadius: '10px',
            maxWidth: '600px',
            color: 'white',
            width: '100%',
          }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            {movie.title}
          </h2>
          <p style={{ fontSize: '1rem' }}>{movie.overview}</p>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={handlePrev} style={arrowBtnStyle('left')}>
        <ChevronLeft />
      </button>
      <button onClick={handleNext} style={arrowBtnStyle('right')}>
        <ChevronRight />
      </button>

      {/* Dots */}
      <div style={dotContainerStyle}>
        {mockTrendingMovies.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              ...dotStyle,
              backgroundColor:
                currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Styling Utilities
const arrowBtnStyle = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: '20px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.5)',
  border: 'none',
  borderRadius: '50%',
  padding: '0.5rem',
  cursor: 'pointer',
  color: 'white',
  zIndex: 1,
});

const dotContainerStyle = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '10px',
};

const dotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  cursor: 'pointer',
};

export default HeroCarousel;
