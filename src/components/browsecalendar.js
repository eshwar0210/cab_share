import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

const BrowseCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [journeys, setJourneys] = useState([]);
    const [journeysByDate, setJourneysByDate] = useState({}); // To store journeys grouped by date
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    // Function to convert date to Indian Standard Time (IST)
    const toIST = (dateObj) => {
        const indianTimeOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        return new Date(dateObj.getTime() + indianTimeOffset);
    };

    const fetchJourneys = async (selectedDate) => {
        try {
            const indianDate = toIST(selectedDate); // Convert the selected date to IST
            const formattedDate = indianDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/journey/date/${formattedDate}`); // Adjust the endpoint accordingly
            setJourneys(response.data);
            setJourneysByDate(prevState => ({
                ...prevState,
                [formattedDate]: response.data,
            }));
        } catch (error) {
            setSnackbarMessage('Error fetching journeys');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchJourneys(date);
    }, [date]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const hasJourneysOnDate = (day) => {
        const indianDate = toIST(day); // Convert the day to IST
        const formattedDate = indianDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
        return journeysByDate[formattedDate]?.length > 0; // Check if there are journeys on that date
    };


    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" alignItems="center">
            <Header />
            <Box flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={4} width="100%">
                <Typography variant="h4" align="center" gutterBottom>
                    Events Calendar
                </Typography>
                {/* Calendar Section */}
                <Box
                    display="flex"
                    justifyContent="center"
                    margin="20px 0"
                    width={{ xs: '100%', md: '50%' }} // Responsive width for calendar
                >
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        locale="en-IN"
                        tileContent={({ date, view }) => {
                            if (view === 'month' && hasJourneysOnDate(date)) {
                                return (
                                    <div
                                        style={{
                                            background: 'red',
                                            borderRadius: '50%',
                                            width: '10px',
                                            height: '10px',
                                            margin: 'auto',
                                        }}
                                    />
                                );
                            }
                            return null;
                        }}
                    />
                </Box>

                {/* Events Section */}
                <Box width="100%" padding={2}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Journeys
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {journeys.length > 0 ? (
                            journeys.map((journey) => (
                                <Grid item key={journey._id}>
                                    <Card
                                        variant="outlined"
                                        style={{
                                            margin: '10px',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                            borderRadius: '12px',
                                            transition: 'transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '8px' }}>{journey.fromLocation}</span>
                                                <span style={{ fontSize: '24px', marginRight: '8px' }}>➡️</span>
                                                <span>{journey.toLocation}</span>
                                            </Typography>
                                            <Typography>Name: {journey.name}</Typography>
                                            <Typography>Contact: {journey.phoneNumber}</Typography>

                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                Date: {journey.date.split('T')[0]}
                                            </Typography>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                Time: {journey.departureTime}
                                            </Typography>
                                            <Typography>Persons: {journey.numberOfPersons}</Typography>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center" style={{ fontSize: '1.5rem', marginTop: '20px' }}>
                                    No journeys found for this date.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
            <Footer />
        </Box>
    );
};

export default BrowseCalendar;
