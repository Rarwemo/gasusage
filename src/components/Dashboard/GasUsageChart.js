import React, { useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { Typography, useTheme, useMediaQuery, Box } from '@mui/material';

const GasUsageChart = ({ cylinders }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const chartData = useMemo(() => {
        const last7Days = new Array(7).fill(0).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return isMobile ? 
                date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) :
                date.toLocaleDateString();
        });

        return last7Days.map(date => ({
            date,
            ...cylinders.reduce((acc, cylinder) => {
                // Calculate percentage remaining
                const percentageRemaining = (cylinder.currentWeight / cylinder.size) * 100;
                acc[`${cylinder.size}KG`] = percentageRemaining;
                return acc;
            }, {})
        }));
    }, [cylinders, isMobile]);

    const cylinderSizes = useMemo(() => 
        [...new Set(cylinders.map(c => `${c.size}KG`))],
        [cylinders]
    );

    if (cylinders.length === 0) {
        return (
            <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="textSecondary"
                >
                    No gas cylinders to display
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Typography 
                component="h2" 
                variant={isMobile ? "subtitle1" : "h6"} 
                color="primary" 
                gutterBottom
            >
                Gas Usage Over Time (% Remaining)
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 240}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date"
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                        interval={isMobile ? 1 : 0}
                    />
                    <YAxis 
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                        width={isMobile ? 30 : 40}
                        domain={[0, 100]}
                        label={{ 
                            value: '% Remaining', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: isMobile ? 12 : 14 }
                        }}
                    />
                    <Tooltip 
                        formatter={(value) => [`${value.toFixed(1)}%`, 'Remaining']}
                    />
                    <Legend 
                        wrapperStyle={{ 
                            fontSize: isMobile ? 12 : 14,
                            marginTop: isMobile ? -10 : 0
                        }}
                    />
                    {cylinderSizes.map((size, index) => (
                        <Line
                            key={size}
                            type="monotone"
                            dataKey={size}
                            stroke={`hsl(${(index * 137) % 360}, 70%, 50%)`}
                            strokeWidth={isMobile ? 1 : 2}
                            dot={{ r: isMobile ? 3 : 4 }}
                            activeDot={{ r: isMobile ? 6 : 8 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default GasUsageChart; 