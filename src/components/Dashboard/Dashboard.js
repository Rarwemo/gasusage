import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { subscribeToGasUpdates, updateGasWeight } from '../../services/gasService';
import GasUsageChart from './GasUsageChart';
import AddGasModal from './AddGasModal';
import GasCylinderList from './GasCylinderList';

const LOW_GAS_THRESHOLD = 3; // KG

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { showNotification } = useNotification();
    const [userData, setUserData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const unsubscribe = subscribeToGasUpdates(currentUser.uid, (data) => {
            setUserData(data);
            
            // Check for low gas levels using user's settings
            if (data.settings?.lowGasNotifications) {
                const threshold = data.settings.notificationThreshold || 3;
                data.gasCylinders?.forEach(cylinder => {
                    if (cylinder.currentWeight <= threshold) {
                        showNotification(
                            `Gas cylinder ${cylinder.size}KG is running low (${cylinder.currentWeight}KG remaining)`,
                            'warning'
                        );
                    }
                });
            }
        });

        return () => unsubscribe();
    }, [currentUser.uid, showNotification]);

    const handleWeightUpdate = async (cylinderId, newWeight) => {
        try {
            const success = await updateGasWeight(currentUser.uid, cylinderId, newWeight);
            if (success) {
                showNotification('Gas weight updated successfully', 'success');
            } else {
                showNotification('Failed to update gas weight', 'error');
            }
        } catch (error) {
            console.error('Error updating weight:', error);
            showNotification('Error updating gas weight', 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12}>
                    <Paper sx={{ 
                        p: { xs: 2, sm: 3 },
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography 
                                component="h1" 
                                variant={isMobile ? "h5" : "h4"} 
                                color="primary" 
                                gutterBottom
                            >
                                Welcome, {userData?.name || 'User'}
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => setIsAddModalOpen(true)}
                                sx={{ 
                                    mt: isMobile ? 2 : 0,
                                    alignSelf: isMobile ? 'stretch' : 'flex-start'
                                }}
                            >
                                Add New Gas Cylinder
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                        p: { xs: 2, sm: 3 },
                        display: 'flex',
                        flexDirection: 'column',
                        height: { xs: 300, sm: 240 }
                    }}>
                        <GasUsageChart cylinders={userData?.gasCylinders || []} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: { xs: 2, sm: 3 },
                        display: 'flex',
                        flexDirection: 'column',
                        height: { xs: 'auto', sm: 240 }
                    }}>
                        <GasCylinderList 
                            cylinders={userData?.gasCylinders || []}
                            onUpdateWeight={handleWeightUpdate}
                        />
                    </Paper>
                </Grid>
            </Grid>

            <AddGasModal 
                open={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                userId={currentUser.uid}
                onAdd={() => showNotification('Gas cylinder added successfully', 'success')}
            />
        </Container>
    );
};

export default Dashboard; 