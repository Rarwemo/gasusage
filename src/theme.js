import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 16,
                    paddingRight: 16,
                    '@media (min-width: 600px)': {
                        paddingLeft: 24,
                        paddingRight: 24,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '@media (max-width: 600px)': {
                        padding: '16px !important',
                    },
                },
            },
        },
    },
});

export default theme; 