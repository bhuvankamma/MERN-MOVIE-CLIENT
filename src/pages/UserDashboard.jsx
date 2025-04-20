import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, AppBar, Toolbar, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Divider, useTheme, useMediaQuery, Snackbar
} from '@mui/material';
import {
  Menu as MenuIcon, ExitToApp as ExitToAppIcon, Movie as MovieIcon,
  PlaylistPlay as PlaylistPlayIcon, ThumbUp as ThumbUpIcon, Favorite as FavoriteIcon,
  Language as LanguageIcon, GetApp as GetAppIcon, Gavel as GavelIcon,
  Subscriptions as SubscriptionsIcon, ContactMail as ContactMailIcon,
  Close as CloseIcon, NewReleases as NewReleasesIcon, Message as MessageIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { useAuth } from '../auth_temp/AuthContext';
import ContinueWatching from '../components/ContinueWatching';
import RecommendedSection from '../components/Recommended';
import WatchlistSection from '../components/Watchlist';
import DownloadSection from '../components/Downloads';
import ReviewSection from '../components/ReviewSection';
import NewTrailers from '../components/NewTrailers';
import UserMessages from '../components/UserMessages';
import ContactForm from '../pages/ContactUs';
import Subscribe from './Subscribe';
import Guidelines from './Guidelines';

const drawerItems = [
  { text: 'All Movies', icon: <MovieIcon /> },
  { text: 'Catch New trailers', icon: <NewReleasesIcon /> },
  { text: 'Continue Watching', icon: <PlaylistPlayIcon /> },
  { text: 'Recommended For You', icon: <ThumbUpIcon /> },
  { text: 'Your Watchlist', icon: <FavoriteIcon /> },
  { text: 'Download Access', icon: <GetAppIcon /> },
  { text: 'Guidelines', icon: <GavelIcon /> },
  { text: 'Subscribe for More Features', icon: <SubscriptionsIcon /> },
  { text: 'Contact Us', icon: <ContactMailIcon /> },
  { text: 'Replies From Admin', icon: <MessageIcon /> }
];

const sectionContent = {
  'Catch New trailers': {
    title: 'Catch New Trailers',
    description: 'Check out the latest movie trailers.',
    component: <NewTrailers />
  },
  'Continue Watching': {
    title: 'Continue Watching',
    description: 'Pick up right where you left off.',
    component: <ContinueWatching />
  },
  'Recommended For You': {
    title: 'Recommended For You',
    description: 'Curated just for you.',
    component: <RecommendedSection />
  },
  'Your Watchlist': {
    title: 'Your Watchlist',
    description: 'All your saved movies in one place.',
    component: <WatchlistSection />
  },
  'Download Access': {
    title: 'Download Access',
    description: 'You can download up to 3 movies.',
    component: <DownloadSection />
  },
  'Guidelines': {
    title: 'Community Guidelines',
    description: 'Abusive reviews = suspension.',
    component: <Box sx={{ mt: 1, textAlign: 'center' }}><Guidelines /></Box>
  },
  'Subscribe for More Features': {
    title: 'Subscribe for More Features',
    description: 'Get premium features coming soon!',
    component: <Box sx={{ mt: 1, textAlign: 'center' }}><Subscribe /></Box>
  },
  'Contact Us': {
    title: 'Contact Us',
    description: 'We\'d love to hear from you!',
    component: (
      <Box component="form" sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
        <ContactForm />
      </Box>
    )
  },
  'Replies From Admin': {
    title: 'Replies From Admin',
    description: 'See messages from admin.',
    component: <Box sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}><UserMessages /></Box>
  }
};

const welcomeMessages = [
  "What's up, movie buff?",
  "Glad to see you again!",
  "Ready for your next binge?",
  "Lights. Camera. You!",
  "Hope you brought popcorn!",
  "Streaming greatness awaits.",
  "Your watchlist misses you!",
  "Ready to pick up where you left off?"
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [inactivitySnackbarOpen, setInactivitySnackbarOpen] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user?.status === 'suspended') {
      setIsSuspended(true);
    }

    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    setWelcomeMessage(welcomeMessages[randomIndex]);

    const resetTimer = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setInactivitySnackbarOpen(true);
        logoutUser();
        navigate('/');
      }, 10 * 60 * 1000);
    };

    let inactivityTimeout = setTimeout(() => {
      setInactivitySnackbarOpen(true);
      logoutUser();
      navigate('/');
    }, 10 * 60 * 1000);

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(inactivityTimeout);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
      document.removeEventListener('click', resetTimer);
    };
  }, [navigate, logoutUser, user]);

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleDrawerItemClick = (text) => {
    setDrawerOpen(false);
    if (text === 'All Movies') navigate('/all-movies');
    else setActiveSection(text);
  };

  const renderSection = () => {
    if (isSuspended) {
      return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h5" sx={{ color: '#e74c3c' }}>
            Your account is suspended. Please contact the admin for more details.
          </Typography>
        </Box>
      );
    }

    if (!activeSection || !sectionContent[activeSection]) return null;
    const { title, description, component } = sectionContent[activeSection];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{
          backgroundColor: '#2c2c2c',
          borderRadius: 2,
          boxShadow: 4,
          p: 2,
          mt: 3,
          mx: 'auto',
          maxWidth: 420,
          color: '#fff',
          position: 'relative'
        }}>
          <IconButton onClick={() => setActiveSection('')} sx={{
            position: 'absolute', top: 10, right: 10, color: '#ccc', backgroundColor: '#444',
            '&:hover': { backgroundColor: '#666' }
          }} size="small">
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ color: '#f39c12', mb: 1 }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: '#bbb', mb: 2 }}>{description}</Typography>
          {component}
        </Box>
      </motion.div>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#fff', p: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: '#111' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#f1c40f' }}>🎥 MovieFlix</Typography>
            </motion.div>
          </Box>
          <Button
            variant="contained"
            onClick={handleSignOut}
            startIcon={<ExitToAppIcon />}
            sx={{
              backgroundColor: '#e74c3c', fontWeight: 'bold', borderRadius: 3,
              fontSize: '0.75rem', px: 2, py: 1,
              '&:hover': { backgroundColor: '#c0392b' }
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ width: 250, flexShrink: 0,
          '& .MuiDrawer-paper': { backgroundColor: '#1a1a1a', color: '#fff' }
        }}
        variant="temporary"
      >
        <List>
          {drawerItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleDrawerItemClick(item.text)}>
                <ListItemIcon sx={{ color: '#f1c40f' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ mt: 5, textAlign: 'center', px: 2 }}>
        {isSuspended ? (
          <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
            Suspended Account
          </Typography>
        ) : (
          <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
            {welcomeMessage}
          </Typography>
        )}
        {renderSection()}
      </Box>

      <Snackbar
        open={inactivitySnackbarOpen}
        autoHideDuration={6000}
        message="You were signed out due to inactivity."
        onClose={() => setInactivitySnackbarOpen(false)}
      />
    </Box>
  );
};

export default UserDashboard;
