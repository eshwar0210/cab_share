import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const CabDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch driver details on component mount
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/driver`); // Update with the actual API endpoint
                setDrivers(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {


        return (

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="error">Failed to load driver details</Typography>
            </Box>)
            ;
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom sx ={{color : "primary.main"}}>
                    Cab Drivers
                </Typography>
                <Grid container spacing={4}>
                    {drivers.map((driver) => (
                        <Grid item xs={12} sm={6} md={4} key={driver.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{driver.name}</Typography>
                                    <Typography color="textSecondary">Phone: {driver.phone}</Typography>
                                    <Typography color="textSecondary">Vehicle Name: {driver.vehicleName}</Typography>
                                    <Typography color="textSecondary">Vehicle Capacity: {driver.vehicleCapacity}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer sx={{ mt: 'auto' }} />
        </Box>
    );
};

export default CabDrivers;
