import React from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    Typography, 
    Box,
    useTheme,
    useMediaQuery,
    Divider
} from '@mui/material';

const GasCylinderList = ({ cylinders }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                                variant: isMobile ? 'body2' : 'body1'
                            }}
                        />
                    </ListItem>
                ) : (
                    cylinders.map((cylinder, index) => (
                        <React.Fragment key={cylinder.id}>
                            <ListItem>
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
                                            </Typography>
                                            <br />
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
                    ))
                )}
            </List>
        </>
    );
};

export default GasCylinderList; 