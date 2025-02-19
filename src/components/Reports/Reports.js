import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    useTheme,
    useMediaQuery,
    Tab,
    Tabs
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const Reports = () => {
    const { currentUser } = useAuth();
    const [usageData, setUsageData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    useEffect(() => {
        const fetchUsageData = async () => {
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                setUsageData(userDoc.data());
            }
        };
        
        fetchUsageData();
    }, [currentUser]);

    const calculateUsageStats = () => {
        if (!usageData?.gasCylinders) return null;

        const stats = usageData.gasCylinders.reduce((acc, cylinder) => {
            const initialWeight = cylinder.size;
            const currentWeight = cylinder.currentWeight;
            const usage = initialWeight - currentWeight;
            
            acc.totalUsage += usage;
            acc.cylinders.push({
                size: cylinder.size,
                usage,
                percentageUsed: (usage / initialWeight) * 100
            });
            
            return acc;
        }, { totalUsage: 0, cylinders: [] });

        return stats;
    };

    const calculateDailyUsage = () => {
        if (!usageData?.gasCylinders) return [];
        
        const dailyUsage = usageData.gasCylinders.reduce((acc, cylinder) => {
            const date = new Date(cylinder.lastUpdated).toLocaleDateString();
            acc[date] = (acc[date] || 0) + (cylinder.size - cylinder.currentWeight);
            return acc;
        }, {});

        return Object.entries(dailyUsage).map(([date, usage]) => ({
            date,
            usage
        }));
    };

    const exportToCSV = () => {
        const stats = calculateUsageStats();
        if (!stats) return;

        const csvContent = [
            ['Cylinder Size (KG)', 'Usage (KG)', 'Usage Percentage'],
            ...stats.cylinders.map(cylinder => [
                cylinder.size,
                cylinder.usage.toFixed(2),
                `${cylinder.percentageUsed.toFixed(2)}%`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gas_usage_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToExcel = () => {
        const stats = calculateUsageStats();
        if (!stats) return;

        const dailyUsage = calculateDailyUsage();
        const workbook = {
            SheetNames: ['Summary', 'Daily Usage'],
            Sheets: {
                Summary: {
                    '!ref': 'A1:D' + (stats.cylinders.length + 1),
                    A1: { t: 's', v: 'Cylinder Size (KG)' },
                    B1: { t: 's', v: 'Usage (KG)' },
                    C1: { t: 's', v: 'Usage Percentage' },
                    D1: { t: 's', v: 'Last Updated' },
                    ...stats.cylinders.reduce((acc, cylinder, idx) => ({
                        ...acc,
                        [`A${idx + 2}`]: { t: 'n', v: cylinder.size },
                        [`B${idx + 2}`]: { t: 'n', v: cylinder.usage },
                        [`C${idx + 2}`]: { t: 'n', v: cylinder.percentageUsed },
                        [`D${idx + 2}`]: { t: 's', v: new Date(cylinder.lastUpdated).toLocaleDateString() }
                    }), {})
                },
                'Daily Usage': {
                    '!ref': 'A1:B' + (dailyUsage.length + 1),
                    A1: { t: 's', v: 'Date' },
                    B1: { t: 's', v: 'Usage (KG)' },
                    ...dailyUsage.reduce((acc, day, idx) => ({
                        ...acc,
                        [`A${idx + 2}`]: { t: 's', v: day.date },
                        [`B${idx + 2}`]: { t: 'n', v: day.usage }
                    }), {})
                }
            }
        };

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gas_usage_detailed_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Helper function to convert string to array buffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };

    const stats = calculateUsageStats();

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between', 
                            alignItems: isMobile ? 'stretch' : 'center',
                            mb: 3 
                        }}>
                            <Typography variant={isMobile ? "h6" : "h5"}>
                                Gas Usage Report
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 1,
                                mt: isMobile ? 2 : 0 
                            }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => exportToCSV()}
                                    startIcon={<DownloadIcon />}
                                >
                                    CSV
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={() => exportToExcel()}
                                    startIcon={<DownloadIcon />}
                                >
                                    Excel
                                </Button>
                            </Box>
                        </Box>

                        <Tabs 
                            value={activeTab} 
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{ mb: 3 }}
                        >
                            <Tab label="Summary" />
                            <Tab label="Daily Usage" />
                            <Tab label="Charts" />
                        </Tabs>

                        {stats && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Total Gas Usage: {stats.totalUsage.toFixed(2)} KG
                                </Typography>

                                <TableContainer component={Paper} sx={{ mt: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Cylinder Size</TableCell>
                                                <TableCell>Usage (KG)</TableCell>
                                                <TableCell>Usage Percentage</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.cylinders.map((cylinder, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{cylinder.size} KG</TableCell>
                                                    <TableCell>{cylinder.usage.toFixed(2)} KG</TableCell>
                                                    <TableCell>{cylinder.percentageUsed.toFixed(2)}%</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Reports; 