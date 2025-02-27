import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent,
    Grid,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert 
} from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import { subscribeToDHT11Data } from '../../services/sensorService';

const SensorReadings = () => {
    const [sensorData, setSensorData] = useState({
        temperature: { value: null, error: false },
        humidity: { value: null, error: false }
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const unsubscribe = subscribeToDHT11Data((data) => {
            setSensorData(prev => ({
                ...prev,
                [data.type]: {
                    value: data.error ? null : data.value,
                    error: data.error
                }
            }));
        });

        return () => unsubscribe();
    }, []);

    const renderSensorCard = (type, icon, color) => {
        const data = sensorData[type];
        const unit = type === 'temperature' ? '°C' : '%';
        const Icon = icon;

        return (
            <Card 
                elevation={3}
                sx={{ 
                    bgcolor: data.error ? 'error.light' : color,
                    color: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6]
                    }
                }}
            >
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Icon />
                        <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ textTransform: 'capitalize' }}>
                            {type}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={60}>
                        {data.error ? (
                            <Typography color="error" variant={isMobile ? 'body2' : 'body1'}>
                                Error fetching data
                            </Typography>
                        ) : data.value === null ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="bold">
                                {data.value}{unit}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Real-time Sensor Readings
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    {renderSensorCard('temperature', ThermostatIcon, theme.palette.primary.main)}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderSensorCard('humidity', OpacityIcon, theme.palette.info.main)}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SensorReadings; 