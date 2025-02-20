import React from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    Typography, 
    Box,
    useTheme,
    useMediaQuery,
    Divider,
    LinearProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification } from '../../contexts/NotificationContext';

const GasCylinderList = ({ cylinders, onDeleteCylinder }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [cylinderToDelete, setCylinderToDelete] = React.useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { showNotification } = useNotification();

    const getProgressColor = (percentage) => {
        if (percentage <= 5) return 'error';
        if (percentage <= 20) return 'warning';
        return 'success';
    };

    const handleDeleteClick = (cylinder) => {
        setCylinderToDelete(cylinder);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await onDeleteCylinder(cylinderToDelete.id);
            showNotification('Gas cylinder removed successfully', 'success');
        } catch (error) {
            showNotification('Failed to remove gas cylinder', 'error');
        }
        setDeleteDialogOpen(false);
        setCylinderToDelete(null);
    };

    return (
        <>
            <Typography 
                component="h2" 
                variant={isMobile ? "subtitle1" : "h6"} 
                color="primary" 
                gutterBottom
            >
                Your Gas Cylinders
            </Typography>
            <List sx={{ 
                width: '100%', 
                maxHeight: isMobile ? '100%' : 180, 
                overflow: isMobile ? 'visible' : 'auto'
            }}>
                {cylinders.length === 0 ? (
                    <ListItem>
                        <ListItemText 
                            primary="No gas cylinders added yet"
                            primaryTypographyProps={{
                                color: 'text.secondary',
                                align: 'center'
                            }}
                        />
                    </ListItem>
                ) : (
                    cylinders.map((cylinder, index) => {
                        const percentageRemaining = (cylinder.currentWeight / cylinder.size) * 100;
                        return (
                            <React.Fragment key={cylinder.id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete"
                                            onClick={() => handleDeleteClick(cylinder)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={`${cylinder.size}KG Cylinder`}
                                        primaryTypographyProps={{
                                            variant: isMobile ? 'body1' : 'h6'
                                        }}
                                        secondary={
                                            <Box sx={{ mt: isMobile ? 1 : 0 }}>
                                                <Typography 
                                                    component="span" 
                                                    variant={isMobile ? "body2" : "body1"}
                                                >
                                                    Current Weight: {cylinder.currentWeight}KG
                                                    ({percentageRemaining.toFixed(1)}%)
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={percentageRemaining}
                                                    color={getProgressColor(percentageRemaining)}
                                                    sx={{ my: 1 }}
                                                />
                                                <Typography 
                                                    component="span" 
                                                    variant="body2" 
                                                    color="textSecondary"
                                                >
                                                    Last Updated: {new Date(cylinder.lastUpdated).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < cylinders.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })
                )}
            </List>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this {cylinderToDelete?.size}KG gas cylinder?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GasCylinderList; 