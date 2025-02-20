import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { subscribeToGasUpdates, updateGasWeight, deleteCylinder } from '../../services/gasService';
import GasUsageChart from './GasUsageChart';
import AddGasModal from './AddGasModal';
import GasCylinderList from './GasCylinderList';
import SelectableText from '../common/SelectableText';

const LOW_GAS_THRESHOLD = 5; // Changed to 5%

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
            
            // Check for low gas levels
            data.gasCylinders?.forEach(cylinder => {
                const percentageRemaining = (cylinder.currentWeight / cylinder.size) * 100;
                if (percentageRemaining <= LOW_GAS_THRESHOLD) {
                    showNotification(
                        `Gas cylinder ${cylinder.size}KG is at ${percentageRemaining.toFixed(1)}% remaining`,
                        'warning'
                    );
                }
            });
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

    const handleDeleteCylinder = async (cylinderId) => {
        try {
            await deleteCylinder(currentUser.uid, cylinderId);
            showNotification('Gas cylinder removed successfully', 'success');
        } catch (error) {
            console.error('Error deleting cylinder:', error);
            showNotification('Failed to remove gas cylinder', 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper 
                        sx={{ 
                            p: { xs: 2, sm: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                        }}
                    >
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
                                Welcome, <SelectableText text={userData?.name || 'User'} />
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => setIsAddModalOpen(true)}
                                sx={{ 
                                    mt: isMobile ? 2 : 0,
                                    alignSelf: isMobile ? 'stretch' : 'flex-start',
                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    }
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
                            onDeleteCylinder={handleDeleteCylinder}
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