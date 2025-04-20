import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
//import FeatureBoxes from '../components/FeatureBoxes';
import MovieFooter from '../components/MovieFooter';

const categorizedMovies = {
  Hollywood: ['Batman Begins', 'The Dark Knight', 'Inception', 'Interstellar', 'Dunkirk', 'Tenet'],
  Bollywood: ['WAR-2', 'RRR', 'NTRNEEL-Dragon'],
  Tollywood: ['Temper', 'JanathaGarage', 'Jai lava kusa', 'Aravinda Sametha Vera Raghava', 'Devara Part-1'],
};

const LandingPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleGetStartedClick = () => {
    if (!email) {
      setError('Please enter your email');
      setTimeout(() => {
        setError('');
      }, 3000); // <- added logic to reset error after 3 seconds
    } else {
      navigate('/register');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGetStartedClick();
  };

  const handleCategoryToggle = (category) => {
    setExpandedCategory(prev => (prev === category ? '' : category));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const allMovies = Object.values(categorizedMovies).flat();
      const filtered = allMovies.filter(movie =>
        movie.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      const logo = document.getElementById('logo-animate');
      if (logo) {
        logo.style.animation = 'slideIn 1s ease forwards';
      }
    });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        color: isDark ? 'white' : 'black',
        backgroundImage: isDark
          ? 'url("https://assets.nflxext.com/ffe/siteui/vlv3/2ba85aa9-7024-49ea-a5eb-057cdfdb372b/12e0f5e6-19b0-4f5a-82a7-c48f144d0160/IN-en-20240304-popsignuptwoweeks-perspective_alpha_website_small.jpg")'
          : 'none',
        backgroundColor: isDark ? '#000' : '#fff',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem' }}>
          <div
            id="logo-animate"
            onClick={() => navigate('/register')}
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e50914',
              cursor: 'pointer',
              borderBottom: '2px solid #e50914',
            }}
          >
            MovieFlix
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search movies..."
              style={searchInputStyle}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select value={language} onChange={e => setLanguage(e.target.value)} style={dropdownStyle}>
              <option>English</option>
              <option>हिन्दी</option>
            </select>
            <button onClick={() => navigate('/login')} style={btnStyle}>Sign In</button>
            <button onClick={() => navigate('/register')} style={btnStyle}>Sign Up</button>
            <button onClick={toggleTheme}>{isDark ? '🌙' : '☀️'}</button>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ background: '#222', color: '#fff', padding: '0.5rem', margin: '0 2rem' }}>
            {suggestions.map((movie, idx) => (
              <div key={idx}>{movie}</div>
            ))}
          </div>
        )}

        {/* Hero Section */}
        <div style={heroSection}>
          <h1 style={heroTitle}>Unlimited movies, TV shows and more</h1>
          <p style={heroSub}>Watch anywhere. Cancel anytime.</p>

          <div ref={emailRef} style={emailInputSection}>
            <input
              type="email"
              placeholder="Enter your email"
              style={emailInputStyle}
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
            />
            <button style={getStartedBtn} onClick={handleGetStartedClick}>Get Started</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
        </div>

        {/* Movie Categories */}
        <div style={{ padding: '2rem' }}>
          {Object.entries(categorizedMovies).map(([category, movies]) => {
            const filtered = searchQuery
              ? movies.filter(movie => movie.toLowerCase().includes(searchQuery.toLowerCase()))
              : movies;

            return (
              <div key={category} style={{ marginBottom: '1rem' }}>
                <button
                  onClick={() => handleCategoryToggle(category)}
                  style={{ ...btnStyle, width: '100%', textAlign: 'left', padding: '1rem', backgroundColor: '#333' }}
                >
                  {category} {expandedCategory === category ? '▲' : '▼'}
                </button>
                {expandedCategory === category && (
                  <div style={movieGrid}>
                    {filtered.map((movie, idx) => (
                      <div key={idx} style={movieCard}>{movie}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <HeroCarousel />
      { <MovieFooter /> }
    </div>
  );
};

// === Styles ===
const btnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem',
};

const getStartedBtn = {
  ...btnStyle,
  padding: '0.75rem 1.5rem',
};

const searchInputStyle = {
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const dropdownStyle = {
  padding: '0.3rem 0.6rem',
  borderRadius: '6px',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
};

const heroSection = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '2rem 1rem',
};

const heroTitle = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: '900',
  marginBottom: '1rem',
  lineHeight: '1.2',
};

const heroSub = {
  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
  marginBottom: '1.5rem',
  fontWeight: '500',
};

const emailInputSection = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  width: '100%',
  maxWidth: '500px',
  justifyContent: 'center',
};

const emailInputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  flex: '1 1 60%',
  minWidth: '200px',
  outline: 'none',
};

const movieGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const movieCard = {
  padding: '1rem',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '6px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1rem',
};

export default LandingPage;
