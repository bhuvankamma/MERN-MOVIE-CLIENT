import React, { useEffect, useState, useRef } from 'react';  
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, Snackbar, Alert, Card, CardContent
} from '@mui/material';
import {
  Group, Movie, PeopleAlt, Report, Insights, ChildCare, ShowChart, Block, WarningAmber,
  Paid, Notifications, Menu as MenuIcon, Logout, VideoLibrary, Close
} from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { motion } from 'framer-motion';
import { useAuth } from '../auth_temp/AuthContext';
import axios from 'axios';

// Admin Sections
import TotalUsersCard from '../components/admin/TotalUsersCard';
import ManageMovies from '../components/admin/ManageMovies';
import TrailerManager from '../pages/TrailerManager';
import UserManagement from '../components/admin/UserManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import NotificationBanner from '../components/admin/NotificationBanner';
import AnalyticsChart from '../components/admin/AnalyticsChart';
import AdminMessages from '../components/admin/AdminMessages';

import {
  LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, Line
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const [caption, setCaption] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);

  const inactivityTimer = useRef(null);
  const unreadInterval = useRef(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000;

  const welcomeCaptions = [
    "Running the show like a boss! 🎬", "Admin mode: Activated. Drama incoming. 🎭",
    "Guess who's back to fix everyone's mess? 😏", "You're the firewall between chaos and order 🔥🧊",
    "Slicker than code in production. Welcome, legend 🕶️", "Time to push buttons and look important 🧑‍💻",
  ];

  const adminSections = [
    { label: 'Total Users', icon: <Group /> },
    { label: 'Manage Movies', icon: <Movie /> },
    { label: 'Trailer Manager', icon: <VideoLibrary /> },
    { label: 'User Management', icon: <PeopleAlt /> },
    { label: 'Comment Moderation', icon: <Report /> },
    { label: 'Review Moderation', icon: <Insights /> },
    { label: 'Admin Notifications', icon: <Notifications /> },
    { label: 'Analytics Dashboard', icon: <Insights /> },
    { label: 'Chart Overview', icon: <ShowChart /> },
    { label: 'Suspended Users', icon: <Block /> },
    { label: 'Abusive Reports', icon: <WarningAmber /> },
    { label: 'Age Restrictions', icon: <ChildCare /> },
    { label: 'Subscription Monitoring', icon: <Paid /> },
    { label: 'Admin Messages', icon: <MailOutlineIcon /> },
    { label: 'Admin Inbox', icon: <MailOutlineIcon /> },
  ];

  const chartData = [
    { name: 'Week 1', views: 2000, subs: 400 },
    { name: 'Week 2', views: 3500, subs: 600 },
    { name: 'Week 3', views: 3000, subs: 550 },
    { name: 'Week 4', views: 4000, subs: 700 },
  ];

  const fetchUnreadMessages = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get('/api/messages/unread-count', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const count = res.data.unreadCount;
      setUnreadMessagesCount(count);
      if (count > 0) {
        setSnackbarMessage(`📩 You have ${count} unread message${count > 1 ? 's' : ''}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error?.response?.data || error.message);
    }
  };

  const fetchFeedbackData = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get('/api/feedbacks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFeedbackData(res.data);
    } catch (error) {
      console.error('Error fetching feedback data:', error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    setCaption(welcomeCaptions[Math.floor(Math.random() * welcomeCaptions.length)]);
    fetchUnreadMessages();
    fetchFeedbackData();
    unreadInterval.current = setInterval(fetchUnreadMessages, 20000);

    startInactivityTimer();
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    return () => {
      clearInterval(unreadInterval.current);
      clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
    };
  }, [user?.token]);

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => handleSignOut(), INACTIVITY_LIMIT);
  };

  const resetInactivityTimer = () => startInactivityTimer();
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  const handleSectionClick = (label) => {
    setActiveSection(label);
    setSidebarOpen(false);
    setSnackbarMessage(`✅ "${label}" loaded!`);
    setSnackbarOpen(true);
  };

  const clearActiveSection = () => setActiveSection('');

  const renderSectionComponent = () => {
    const sectionStyle = { mt: 2, position: 'relative' };
    const closeBtn = activeSection !== 'Total Users' && (
      <IconButton onClick={clearActiveSection} sx={{ position: 'absolute', top: 0, right: 0, color: '#ff4081' }}>
        <Close />
      </IconButton>
    );

    switch (activeSection) {
      case 'Total Users': return <Box sx={sectionStyle}><TotalUsersCard /></Box>;
      case 'Manage Movies': return <Box sx={sectionStyle}>{closeBtn}<ManageMovies /></Box>;
      case 'Trailer Manager': return <Box sx={sectionStyle}>{closeBtn}<TrailerManager /></Box>;
      case 'User Management': return <Box sx={sectionStyle}>{closeBtn}<UserManagement /></Box>;
      case 'Comment Moderation': return <Box sx={sectionStyle}>{closeBtn}<Typography>Comment Moderation Section</Typography></Box>;
      case 'Review Moderation': return <Box sx={sectionStyle}>{closeBtn}<ReviewModeration feedbackData={feedbackData} /></Box>;
      case 'Admin Notifications': return <Box sx={sectionStyle}>{closeBtn}<NotificationBanner /></Box>;
      case 'Analytics Dashboard': return <Box sx={sectionStyle}>{closeBtn}<AnalyticsChart /></Box>;
      case 'Chart Overview': return (
        <Box sx={sectionStyle}>
          {closeBtn}
          <Card sx={{ backgroundColor: '#fff', color: '#333', borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>📊 Viewership & Subscriptions</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#ff4081" strokeWidth={2} />
                  <Line type="monotone" dataKey="subs" stroke="#3f51b5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      );
      case 'Admin Messages': return <Box sx={sectionStyle}>{closeBtn}<AdminMessages /></Box>;
      default: return activeSection ? <Box sx={sectionStyle}>{closeBtn}<Typography color="#ccc">Feature coming soon...</Typography></Box> : null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff' }}>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" sx={{ backgroundColor: '#333', color: '#00e676' }}>{snackbarMessage}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2 }}>
        <IconButton onClick={toggleSidebar} sx={{ color: '#00e676', mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">MovieFlix Admin</Typography>
        <Box sx={{ ml: 'auto' }}>
          <Button variant="outlined" color="error" startIcon={<Logout />} onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Centered Welcome */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="4" fontWeight="bold" sx={{ color: '#00e676' }}>
          Welcome {user?.name}👋🤝
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#ccc' }}>
          {caption}
        </Typography>
      </Box>

      {/* Sidebar */}
      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
  <Box sx={{ width: 250, backgroundColor: '#121212', height: '100vh', color: '#fff' }}>
    <List>
      {adminSections.map((section, index) => (
        <ListItem
          key={index}
          onClick={() => handleSectionClick(section.label)}
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#1e1e1e' },
            backgroundColor: '#121212', // Dark background for each menu item
          }}
        >
          <ListItemIcon sx={{ color: '#00e676' }}>{section.icon}</ListItemIcon>
          <ListItemText primary={section.label} />
        </ListItem>
      ))}
    </List>
    <Divider sx={{ backgroundColor: '#444', margin: '8px 0' }} /> {/* Dark divider */}
  </Box>
</Drawer>


      {/* Active Section */}
      <Box sx={{ px: 3, pt: 2, pb: 5 }}>
        {renderSectionComponent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
