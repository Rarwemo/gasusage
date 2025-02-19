import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Gas Usage Monitor
                </Typography>
                <Box>
                    {currentUser && (
                        <>
                            <IconButton 
                                color="inherit" 
                                onClick={() => navigate('/reports')}
                                sx={{ mr: 2 }}
                            >
                                <AssessmentIcon />
                            </IconButton>
                            <IconButton 
                                color="inherit" 
                                onClick={() => navigate('/settings')}
                                sx={{ mr: 2 }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </>
                    )}
                    {currentUser ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/signin')}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/signup')}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 