import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Snackbar, Alert,
  CssBaseline, ThemeProvider, createTheme, MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { registerUser } from '../services/AuthService';

const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['user', 'admin']).required('Role is required'),
});

const yellowTheme = createTheme({
  typography: { fontFamily: 'Segoe UI, sans-serif' },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': { color: '#ffcc00' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#ffd700' },
            '&:hover fieldset': { borderColor: '#f1c40f' },
            '&.Mui-focused fieldset': { borderColor: '#ffcc00' }
          }
        }
      }
    }
  }
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { name, email, password, role } = data;
      const response = await registerUser({ name, email, password, role });

      if (response?.user && response?.token) {
        setAlert({
          open: true,
          message: '✅ Registration successful!',
          severity: 'success'
        });

        setTimeout(() => {
          reset();

          // Navigate to login page with pre-filled credentials
          navigate('/login', {
            state: { email, password, showSuccess: true }
          });
        }, 6000);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error?.response?.data?.message || '❌ Registration failed. Try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={yellowTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url('/register-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <Paper elevation={10} sx={{ p: 4, width: { xs: 320, sm: 400 }, borderRadius: 4, backgroundColor: '#fffefa' }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: '#e0ac1c' }}>
              Create Your Account
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                defaultValue="user"
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Role"
                    margin="normal"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#f4c542',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#d4a51e' }
                  }}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>

                <Button
                  fullWidth
                  onClick={() => navigate('/')}
                  sx={{
                    backgroundColor: '#555',
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#333' }
                  }}
                >
                  ⬅ Home
                </Button>
              </Box>
            </form>

            <Typography variant="body2" textAlign="center" mt={2}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#f4c542', fontWeight: 'bold', textDecoration: 'none' }}>
                Login here
              </Link>
            </Typography>
          </Paper>
        </motion.div>

        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;
