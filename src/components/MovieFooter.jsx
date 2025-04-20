import React, { useState } from 'react'; 
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const MovieFooter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
    if (!isValidEmail) {
      setError('Please enter a valid email address');
      toast.error('Invalid email address');

      // ✅ Reset form state after 3 seconds
      setTimeout(() => {
        setEmail('');
        setError('');
      }, 3000);

    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success('Thank you for subscribing!');
        navigate('/register');
      }, 2000);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const bgColor = darkMode ? '#0d0d0d' : '#f4f4f4';
  const textColor = darkMode ? '#ddd' : '#333';
  const linkColor = darkMode ? '#aaa' : '#444';

  return (
    <Box sx={{ backgroundColor: bgColor, color: textColor, px: { xs: 2, md: 6 }, py: 8 }}>
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Theme Switch */}
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <IconButton onClick={toggleTheme} sx={{ color: textColor }}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
      </Box>

      {/* Subscribe Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Join MovieZone Today!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Stay updated with our latest movies, offers & news.
        </Typography>

        <form onSubmit={handleFormSubmit}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              error={!!error}
              helperText={error}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '30px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                },
                '& input': {
                  padding: '12px 20px',
                },
              }}
            />
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                backgroundColor: '#e50914',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b81d24',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Started'}
            </Button>
          </Box>
        </form>
      </Box>

      <Divider sx={{ backgroundColor: '#555', mb: 4 }} />

      {/* Footer Links Section */}
      <Grid container spacing={4} justifyContent="center">
        {[
          { title: 'Company', links: ['About', 'Careers', 'Press'] },
          { title: 'Support', links: ['Help Center', 'Contact Us', 'Terms of Use'] },
          { title: 'Legal', links: ['Privacy Policy', 'Cookie Policy'] },
        ].map((section, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {section.title}
            </Typography>
            {section.links.map((text, idx) => (
              <Typography key={idx} variant="body2" sx={{ my: 0.5 }}>
                <Link href="#" underline="hover" sx={{ color: linkColor }}>
                  {text}
                </Link>
              </Typography>
            ))}
          </Grid>
        ))}

        {/* Social Links with Icons */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Connect with us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Link href="#" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaInstagram size={24} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaFacebookF size={24} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" color="inherit">
              <FaTwitter size={24} />
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieFooter;
