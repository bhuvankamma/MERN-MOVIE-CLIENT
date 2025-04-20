import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
  MailOutline as MailOutlineIcon,
} from '@mui/icons-material';

const defaultSections = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Manage Movies', icon: <MovieIcon /> },
  { label: 'User Management', icon: <PeopleIcon /> },
  { label: 'User Messages', icon: <MailOutlineIcon /> }, // ✅ New section added
];

const AdminSidebar = ({ open, onClose, sections = defaultSections, onSectionClick }) => {
  return (
    <Box
      sx={{ width: 240, backgroundColor: '#1e1e1e', height: '100vh', color: '#fff' }}
      role="presentation"
      onClick={onClose}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">🎛️ Admin Menu</Typography>
      </Box>
      <Divider />
      <List>
        {sections.map((section, index) => (
          <ListItem
            button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSectionClick(section.label);
            }}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#333' } }}
          >
            <ListItemIcon sx={{ color: '#00e676' }}>{section.icon}</ListItemIcon>
            <ListItemText primary={section.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminSidebar;
