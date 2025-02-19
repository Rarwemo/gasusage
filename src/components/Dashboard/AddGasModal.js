import React, { useState } from 'react';
import { 
    Modal, 
    Box, 
    Typography, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';

const AddGasModal = ({ open, onClose, userId }) => {
    const [cylinderSize, setCylinderSize] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '90%' : 400,
        maxWidth: '100%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: isMobile ? 2 : 4,
        borderRadius: 1
    };

    const handleSubmit = async () => {
        try {
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                gasCylinders: arrayUnion({
                    id: Date.now().toString(),
                    size: parseInt(cylinderSize),
                    currentWeight: parseInt(cylinderSize),
                    lastUpdated: new Date().toISOString()
                })
            });

            onClose();
            setCylinderSize('');
        } catch (error) {
            console.error('Error adding gas cylinder:', error);
        }
    };

    return (
        <Modal 
            open={open} 
            onClose={onClose}
            aria-labelledby="add-gas-modal-title"
        >
            <Box sx={style}>
                <Typography 
                    id="add-gas-modal-title"
                    variant={isMobile ? "h6" : "h5"} 
                    component="h2" 
                    gutterBottom
                >
                    Add New Gas Cylinder
                </Typography>
                <FormControl 
                    fullWidth 
                    sx={{ mt: isMobile ? 1 : 2 }}
                >
                    <InputLabel>Cylinder Size</InputLabel>
                    <Select
                        value={cylinderSize}
                        label="Cylinder Size"
                        onChange={(e) => setCylinderSize(e.target.value)}
                        size={isMobile ? "small" : "medium"}
                    >
                        <MenuItem value={3}>3 KG</MenuItem>
                        <MenuItem value={6}>6 KG</MenuItem>
                        <MenuItem value={13}>13 KG</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ 
                    mt: isMobile ? 2 : 3, 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1
                }}>
                    <Button 
                        onClick={onClose}
                        size={isMobile ? "small" : "medium"}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        disabled={!cylinderSize}
                        size={isMobile ? "small" : "medium"}
                    >
                        Add Cylinder
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddGasModal; 