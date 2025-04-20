// src/components/LanguageSelector.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getUserLanguage, setUserLanguage } from '../services/userApi'; // ✅ Fixed import

const LanguageSelector = () => {
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const res = await getUserLanguage();
        setLanguage(res.data.language || '');
      } catch (err) {
        console.error('Failed to fetch language:', err);
      }
    };
    fetchLanguage();
  }, []);

  const handleChange = async (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    try {
      await setUserLanguage(newLang);
    } catch (err) {
      console.error('Failed to set language:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🌐 Select Your Preferred Language
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Language</InputLabel>
        <Select value={language} onChange={handleChange} label="Language">
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
          <MenuItem value="Tamil">Tamil</MenuItem>
          <MenuItem value="Telugu">Telugu</MenuItem>
          <MenuItem value="Malayalam">Malayalam</MenuItem>
          {/* Add more as needed */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
