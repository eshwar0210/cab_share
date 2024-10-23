import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    useMediaQuery,
} from '@mui/material';
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from '@mui/material';
import { ManageHistory } from '@mui/icons-material';

import CircularProgress from '@mui/material/CircularProgress';

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

const EditJourney = () => {
    const [journeys, setJourneys] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
    const [editingJourney, setEditingJourney] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [journeyToDelete, setJourneyToDelete] = useState(null);
    const userId = localStorage.getItem('uid'); // Get the UID from local storage
    const [loading, setLoading] = useState(true);

    // Responsive breakpoint
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchJourneys = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/journey/${userId}`);
                setJourneys(response.data);
            } catch (error) {
                console.error('Error fetching journeys:', error);
                setSnackbarMessage('Error fetching journeys. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
            finally {
                setLoading(false);
            }
        };

        fetchJourneys();
    }, [userId]);

    const handleEditClick = (journey) => {
        setEditingJourney(journey);
        setDialogOpen(true);
    };

    const handleDeleteClick = (journey) => {
        setJourneyToDelete(journey);
        setDeleteConfirmOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingJourney(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/journey/${journeyToDelete._id}`);
            setJourneys(journeys.filter(journey => journey._id !== journeyToDelete._id));
            setSnackbarMessage('Journey deleted successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error deleting journey:', error);
            setSnackbarMessage('Error deleting journey. Please try again.');
            setSnackbarSeverity('error');
        }
        setDeleteConfirmOpen(false);
        setSnackbarOpen(true);
        setJourneyToDelete(null);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleJourneyUpdate = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/journey/${editingJourney._id}`, editingJourney);
            setJourneys(journeys.map(journey => (journey._id === editingJourney._id ? editingJourney : journey)));
            setSnackbarMessage('Journey updated successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error updating journey:', error);
            setSnackbarMessage('Error updating journey. Please try again.');
            setSnackbarSeverity('error');
        }
        setDialogOpen(false);
        setSnackbarOpen(true);
        setEditingJourney(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {loading && ( // Add loading spinner
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: `calc(100vh - ${isSmallScreen ? '120px' : '200px'})`, // Adjust based on your layout
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {!loading && ( // Only show journeys when not loading


                <Box sx={{ padding: 2, paddingX: isSmallScreen ? 1 : 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#e0f7fa', padding: 2, borderRadius: 1 }}>
                        <ManageHistory sx={{ color: '#00796b', fontSize: 40, marginRight: 1 }} />
                        <Typography variant="h4" sx={{ color: '#004d40', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
                            Explore Your Travels
                        </Typography>
                    </Box>

                    <List>
                        {journeys.map((journey) => {
                            const formattedDate = new Date(journey.date).toLocaleDateString('en-GB').replace(/\//g, '-');

                            return (
                                <ListItem key={journey._id} sx={{ borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1" sx={{ display: 'block' }}>
                                            From: {journey.fromLocation}
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'block' }}>
                                            To: {journey.toLocation}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Departure: {journey.departureTime} on {formattedDate}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton onClick={() => handleEditClick(journey)} sx={{ marginRight: 1, color: 'green' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(journey)} sx={{ color: 'red' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

            )}

            {/* Snackbar for notifications */}
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

            {/* Dialog for editing journey */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Edit Journey</DialogTitle>
                <DialogContent>
                    {editingJourney && (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Autocomplete
                                    options={predefinedLocations} // Use predefined locations
                                    freeSolo // Allows users to enter custom text
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="dense"
                                            label="From"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    value={editingJourney.fromLocation}
                                    onChange={(event, newValue) => {
                                        setEditingJourney({ ...editingJourney, fromLocation: newValue });
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setEditingJourney({ ...editingJourney, fromLocation: newInputValue });
                                    }}
                                />

                                <Autocomplete
                                    options={predefinedLocations} // Use predefined locations
                                    freeSolo // Allows users to enter custom text
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="dense"
                                            label="To"
                                            variant="outlined"
                                            fullWidth

                                        />
                                    )}
                                    value={editingJourney.toLocation}
                                    onChange={(event, newValue) => {
                                        setEditingJourney({ ...editingJourney, toLocation: newValue });
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setEditingJourney({ ...editingJourney, toLocation: newInputValue });
                                    }}
                                />
                            </Box>

                            <TextField
                                margin="dense"
                                label="Departure Time"
                                type="time"
                                fullWidth
                                variant="outlined"
                                value={editingJourney.departureTime}
                                onChange={(e) => setEditingJourney({ ...editingJourney, departureTime: e.target.value })}
                            />

                            <TextField
                                margin="dense"
                                label="Date of Journey"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={editingJourney.date ? editingJourney.date.split('T')[0] : ''}
                                onChange={(e) => {
                                    const selectedDate = e.target.value; // yyyy-mm-dd format
                                    const formattedDate = selectedDate.split('-').reverse().join('-'); // Convert to dd-mm-yyyy format
                                    setEditingJourney({ ...editingJourney, date: formattedDate });
                                }}
                            />

                            <TextField
                                margin="dense"
                                label="Persons Along with you"
                                type="number" // Change to 'number' for input validation
                                fullWidth
                                variant="outlined"
                                value={editingJourney.numberOfPersons}
                                onChange={(e) => setEditingJourney({ ...editingJourney, numberOfPersons: e.target.value })}
                            />

                            <TextField
                                margin="dense"
                                label="Contact"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={editingJourney.phoneNumber}
                                onChange={(e) => setEditingJourney({ ...editingJourney, phoneNumber: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" startIcon={<CloseIcon />}>
                        Cancel
                    </Button>
                    <Button onClick={handleJourneyUpdate} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog for Deleting Journey */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this journey?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer sx={{ mt: 'auto' }} />

        </Box>


    );

};

export default EditJourney;
