import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';

const SelectableText = ({ text, variant = 'body1', component = 'span', ...props }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent text cursor
        setIsSelected(!isSelected);
    };

    return (
        <Typography
            variant={variant}
            component={component}
            onClick={handleClick}
            sx={{
                cursor: 'pointer',
                userSelect: 'none', // Prevent text selection
                backgroundColor: isSelected ? 'primary.light' : 'transparent',
                color: isSelected ? 'white' : 'inherit',
                padding: '2px 4px',
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: isSelected ? 'primary.light' : 'action.hover',
                },
            }}
            {...props}
        >
            {text}
        </Typography>
    );
};

export default SelectableText; 