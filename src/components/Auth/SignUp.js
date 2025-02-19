import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, Button, TextField, Typography, Container, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            
            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                gasCylinders: [],
                settings: {
                    lowGasNotifications: true,
                    notificationThreshold: 3,
                    emailNotifications: false
                }
            });

            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            setError(
                error.code === 'auth/email-already-in-use'
                    ? 'Email already in use'
                    : error.code === 'auth/invalid-email'
                    ? 'Invalid email address'
                    : error.code === 'auth/weak-password'
                    ? 'Password should be at least 6 characters'
                    : 'Failed to create an account. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        Sign Up
                    </Button>
                    <Link component={RouterLink} to="/signin" variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp; 