import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Button, TextField, Typography, Paper, Snackbar, Alert,
    CssBaseline, createTheme, ThemeProvider
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useAuth } from '../auth_temp/AuthContext';
import { loginUser as apiLoginUser } from '../services/AuthService';

const loginSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
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

const Login = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const { loginUser, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    // Prefill login form if redirected from Register
    useEffect(() => {
        if (location.state?.email && location.state?.password) {
            setValue('email', location.state.email);
            setValue('password', location.state.password);
        }

        if (location.state?.showSuccess) {
            setAlert({
                open: true,
                message: '🎉 Registration successful! You can now log in.',
                severity: 'success'
            });
        }
    }, [location.state, setValue]);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            const dashboard = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
            navigate(dashboard);
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await apiLoginUser(data.email, data.password);

            // Basic validation of API response
            if (!response || !response.user || !response.user.role) {
                throw new Error('❌ Invalid login response. Please try again.');
            }

            // 🚫 Handle suspended accounts
            if (response.user.isSuspended) {
                setAlert({
                    open: true,
                    message: '⚠️ Your account is suspended. Please contact support.',
                    severity: 'error'
                });
                setTimeout(() => {
                    navigate('/account-suspended');
                }, 5000);
                return;
            }

            // ✅ Save token to localStorage with the correct key for admins
            localStorage.setItem('adminToken', response.token);
            loginUser(response.user);

            setAlert({
                open: true,
                message: '✅ Login successful! Redirecting...',
                severity: 'success'
            });

            setTimeout(() => {
                const dashboard = response.user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
                navigate(dashboard);
            }, 6000);
        } catch (error) {
            setAlert({
                open: true,
                message: error?.message || '⚠️ Login failed. Please check credentials.',
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
                <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                    <Paper elevation={10} sx={{ padding: 4, width: { xs: 300, sm: 400 }, borderRadius: 4, backgroundColor: '#fffefa' }}>
                        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: '#e0ac1c' }}>
                            Login to Your Account
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                fullWidth label="Email Address" margin="normal" {...register('email')}
                                error={!!errors.email} helperText={errors.email?.message}
                            />
                            <TextField
                                fullWidth type="password" label="Password" margin="normal" {...register('password')}
                                error={!!errors.password} helperText={errors.password?.message}
                            />

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    type="submit" fullWidth variant="contained" disabled={loading}
                                    sx={{
                                        mt: 3,
                                        backgroundColor: '#f4c542',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#d4a51e' }
                                    }}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </motion.div>
                        </form>

                        <Typography variant="body2" textAlign="center" mt={2}>
                            Don't have an account?{' '}
                            <Link to="/register" state={{ fromLanding: true }} style={{ color: '#f4c542', fontWeight: 'bold', textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </Typography>

                        <Button
                            onClick={() => navigate('/')} fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: '#555',
                                color: '#fff',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#333' }
                            }}
                        >
                            ⬅ Back to Home
                        </Button>
                    </Paper>
                </motion.div>

                <Snackbar
                    open={alert.open} autoHideDuration={5000}
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

export default Login;