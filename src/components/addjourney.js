import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import axios from 'axios';

const JourneyForm = () => {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [date, setDate] = useState('');
    const [numberOfPersons, setNumberOfPersons] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('uid'); // Get the UID from local storage
        const name = localStorage.getItem('name');
        const journeyData = {
            userId,
            name,
            fromLocation,
            toLocation,
            departureTime,
            date,
            numberOfPersons,
            phoneNumber,
        };

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/journey/`, journeyData); // Adjust the endpoint accordingly
            setSnackbarMessage('Journey created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/home');
            }, 1000);
            
        } catch (error) {
            console.error('Error saving journey:', error);
            setSnackbarMessage('Error saving journey. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleFromLocationChange = async (e) => {
        const value = e.target.value;
        setFromLocation(value);

        if (value.length >= 1) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`);
                setFromSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching from location suggestions:', error);
            }
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToLocationChange = async (e) => {
        const value = e.target.value;
        setToLocation(value);

        if (value.length >= 1) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`);
                setToSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching to location suggestions:', error);
            }
        } else {
            setToSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion, type) => {
        if (type === 'from') {
            setFromLocation(suggestion.display_name);
            setFromSuggestions([]);
        } else {
            setToLocation(suggestion.display_name);
            setToSuggestions([]);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ padding: { xs: 2, sm: 4 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Typography variant="h5" gutterBottom align="center">
                Add Journey Details
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="From"
                            variant="outlined"
                            value={fromLocation}
                            onChange={handleFromLocationChange}
                        />
                        {fromSuggestions.length > 0 && (
                            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {fromSuggestions.map((suggestion) => (
                                    <ListItem button key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, 'from')}>
                                        <ListItemText primary={suggestion.display_name} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="To"
                            variant="outlined"
                            value={toLocation}
                            onChange={handleToLocationChange}
                        />
                        {toSuggestions.length > 0 && (
                            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {toSuggestions.map((suggestion) => (
                                    <ListItem button key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion, 'to')}>
                                        <ListItemText primary={suggestion.display_name} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Departure Time"
                            variant="outlined"
                            type="time"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: { paddingTop: '16px' } // Adjust padding to align text field
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Journey"
                            variant="outlined"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: { paddingTop: '16px' } // Adjust padding to align text field
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Number of Persons along with you"
                            variant="outlined"
                            type="number"
                            value={numberOfPersons}
                            onChange={(e) => setNumberOfPersons(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                bgcolor: 'primary.secondary', // Change background color
                                color: 'white',
                                padding: '12px 24px', // Add padding for a larger button
                                borderRadius: '8px', // Round the corners
                                boxShadow: 2, // Add shadow for depth
                                '&:hover': {
                                    bgcolor: 'black', // Darker green on hover
                                    boxShadow: 4, // Increase shadow on hover
                                },
                                transition: '0.3s', // Smooth transition for hover effect
                            }}
                        >
                            Submit Journey
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Footer sx={{ mt: 'auto' }} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JourneyForm;
