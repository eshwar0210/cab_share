import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import axios from 'axios';

import { DirectionsCar, Flight, Train } from '@mui/icons-material';
// Predefined locations
const predefinedLocations = [
    "IIT Patna",
    "Patna Railway Station",
    "Pataliputra Railway Station",
    "Rajendranagar Terminal",
    "Danapur Railway Station",
    "Bihta Railway Station",
    "Ara Junction",
    "Patna Airport",
];

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

    const resetform = () =>{
        setFromLocation('');
        setToLocation('');
        setDepartureTime('');
        setDate('');
        setNumberOfPersons('');
        setPhoneNumber('');
    
    };

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
            await axios.post(`${process.env.REACT_APP_BASE_URL}/journey/`, journeyData); 
            resetform();
            setSnackbarMessage('Journey created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            
           
            navigate('/home');
            

        } catch (error) {
            console.error('Error saving journey:', error);
            setSnackbarMessage('Error saving journey. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleFromLocationChange = (e) => {
        const value = e.target.value;
        setFromLocation(value);

        if (value.length >= 1) {
            const filteredSuggestions = predefinedLocations.filter(location =>
                location.toLowerCase().includes(value.toLowerCase())
            );
            setFromSuggestions(filteredSuggestions);
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToLocationChange = (e) => {
        const value = e.target.value;
        setToLocation(value);

        if (value.length >= 1) {
            const filteredSuggestions = predefinedLocations.filter(location =>
                location.toLowerCase().includes(value.toLowerCase())
            );
            setToSuggestions(filteredSuggestions);
        } else {
            setToSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion, type) => {
        if (type === 'from') {
            setFromLocation(suggestion);
            setFromSuggestions([]);
        } else {
            setToLocation(suggestion);
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
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 3 }}>
                <Box>
                    <Flight sx={{ color: "#FF5722", fontSize: 50, marginBottom: 1 }} />
                    <Train sx={{ color: "#2196F3", fontSize: 50, marginBottom: 1 }} />
                    <DirectionsCar sx={{ color: "#4CAF50", fontSize: 50, marginBottom: 1 }} />
                </Box>

                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Plan Your Next Journey
                </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="From"
                            variant="outlined"
                            value={fromLocation}
                            required = {true}
                            onChange={handleFromLocationChange}
                        />
                        {fromSuggestions.length > 0 && (
                            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {fromSuggestions.map((suggestion, index) => (
                                    <ListItem button key={index} onClick={() => handleSuggestionClick(suggestion, 'from')}>
                                        <ListItemText primary={suggestion} />
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
                            required = {true}
                            onChange={handleToLocationChange}
                        />
                        {toSuggestions.length > 0 && (
                            <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {toSuggestions.map((suggestion, index) => (
                                    <ListItem button key={index} onClick={() => handleSuggestionClick(suggestion, 'to')}>
                                        <ListItemText primary={suggestion} />
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
                            required = {true}
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
                            required = {true}
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
                            required = {true}
                            onChange={(e) => setNumberOfPersons(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            required = {true}
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
                                    bgcolor: 'black', // Darker color on hover
                                    boxShadow: 4, // Increase shadow on hover
                                },
                                transition: '0.3s', // Smooth transition for hover effect
                                mt: 2, // Add margin top
                                display: 'flex', // Flexbox for icon alignment
                                alignItems: 'center', // Center icon and text vertically
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>📅</span> {/* Example icon */}
                            Save Journey
                        </Button>

                    </Grid>
                </Grid>
            </form>
            <Footer sx={{ mt: 'auto' ,mb:"0" }} />
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
