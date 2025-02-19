import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Switch, 
    FormGroup, 
    FormControlLabel,
    TextField,
    Button,
    Divider
} from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { db } from '../../firebase';

const Settings = () => {
    const { currentUser } = useAuth();
    const { showNotification } = useNotification();
    const [settings, setSettings] = useState({
        lowGasNotifications: true,
        notificationThreshold: 3,
        emailNotifications: false,
        name: '',
        email: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setSettings(prev => ({
                    ...prev,
                    ...userData.settings,
                    name: userData.name,
                    email: userData.email
                }));
            }
        };

        fetchSettings();
    }, [currentUser]);

    const handleSettingChange = (setting) => (event) => {
        setSettings(prev => ({
            ...prev,
            [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        }));
    };

    const handleSave = async () => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                name: settings.name,
                settings: {
                    lowGasNotifications: settings.lowGasNotifications,
                    notificationThreshold: Number(settings.notificationThreshold),
                    emailNotifications: settings.emailNotifications
                }
            });
            showNotification('Settings saved successfully', 'success');
        } catch (error) {
            showNotification('Failed to save settings', 'error');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Profile Settings
                </Typography>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={settings.name}
                        onChange={handleSettingChange('name')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={settings.email}
                        disabled
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" gutterBottom>
                    Notification Preferences
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.lowGasNotifications}
                                onChange={handleSettingChange('lowGasNotifications')}
                            />
                        }
                        label="Low Gas Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.emailNotifications}
                                onChange={handleSettingChange('emailNotifications')}
                            />
                        }
                        label="Email Notifications"
                    />
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            type="number"
                            label="Low Gas Threshold (KG)"
                            value={settings.notificationThreshold}
                            onChange={handleSettingChange('notificationThreshold')}
                            inputProps={{ min: 1, max: 10 }}
                        />
                    </Box>
                </FormGroup>

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save Settings
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Settings; 