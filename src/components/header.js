import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Toolbar,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ButtonBase
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [openInfoDialog, setOpenInfoDialog] = useState(false); // State for the info dialog
    const navigate = useNavigate();

    // Fetch user details by UID from localStorage
    useEffect(() => {
        const uid = localStorage.getItem('uid');
        if (uid) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/auth/user/${uid}`)
                .then((response) => {
                    const { name, profilePhotoUrl } = response.data;
                    setName(name);
                    setProfilePhoto(profilePhotoUrl);
                    localStorage.setItem('name', name);
                    localStorage.setItem('profile', profilePhotoUrl);
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('uid');
        localStorage.removeItem('name');
        localStorage.removeItem('profile');
        setAnchorEl(null);
        navigate('/login');
    };

    const handleEditProfile = () => {
        setAnchorEl(null);
        navigate('/editprofile');
    };

    const handleHomeClick = () => {
        setAnchorEl(null);
        navigate('/home');
    };



    // Function to open the info dialog
    const handleInfoDialogOpen = () => {
        setOpenInfoDialog(true);
    };

    // Function to close the info dialog
    const handleInfoDialogClose = () => {
        setOpenInfoDialog(false);
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    paddingX: 2,
                }}
            >
                {/* Logo/Brand with Hover Effect */}
                <ButtonBase onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
        <DriveEtaIcon sx={{ fontSize: '1.8rem', color: 'primary.main', transition: 'color 0.3s' }} />
        <Typography
            variant="h6"
            sx={{
                transition: 'color 0.3s',
                '&:hover': {
                    color: 'black',
                },
                fontFamily: 'cursive',
                 color: 'primary.main'
            }}
        >
            Cab Share
        </Typography>
    </Box>
</ButtonBase>

                {/* Account Circle Icon for Profile/Logout */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                     <Typography sx={{ marginRight: 1 , fontWeight: "bold"}}>
                            Hi! {name}
                        </Typography>

                    {/* Info Button with Decoration */}
                    <IconButton
                        onClick={handleInfoDialogOpen}
                        sx={{
                            marginRight: 2, // Adds margin to the right of the Info button
                            bgcolor: 'primary.main', // Set background color
                            color: 'white', // Set text color
                            '&:hover': {
                                bgcolor: 'primary.dark', // Darker background on hover
                            },
                            borderRadius: '50%', // Make it circular
                        }}
                    >
                        <InfoIcon />
                    </IconButton>

                    <IconButton
                        onClick={handleMenuOpen}
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        {profilePhoto ? (
                            <Avatar src={profilePhoto} alt={name} style={{ width: 40, height: 40 }} />
                        ) : (
                            <Avatar>{name.charAt(0)}</Avatar> // Fallback if profileImage is missing
                        )}
                    </IconButton>
                </Box>

                {/* Dropdown Menu for Profile and Logout */}
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleHomeClick}>Home </MenuItem>
                   
                    <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>


            </Toolbar>

            {/* Info Dialog for Rules and Regulations */}
            <Dialog
                open={openInfoDialog}
                onClose={handleInfoDialogClose}
                fullWidth // Make the dialog full width on small devices
                maxWidth="sm" // Limit maximum width
            >
                <DialogTitle>Rules and Regulations</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Welcome to the Cabshare app! Please adhere to the following rules:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        1. Respect other users.
                    </Typography>
                    <Typography variant="body2">
                        2. Only post about journeys that you are involved.
                    </Typography>
                    <Typography variant="body2">
                        3. Report any inappropriate content to the admin.
                    </Typography>
                    <Typography variant="body2">
                        4. Use the contact options responsibly and talk politely to other users.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        By using this app, you agree to abide by these rules.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInfoDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Header;
