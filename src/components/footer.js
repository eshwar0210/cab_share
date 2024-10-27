import React from 'react';
import { Box, Typography, Link, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email'; // Import Gmail icon

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center the items vertically
                padding: '16px',
                marginTop: 'auto',
                width: '100%',
                maxWidth: { xs: '100%', sm: '600px', md: '800px' }, // Responsive maxWidth for footer
                marginLeft: 'auto', // Center horizontally
                marginRight: 'auto', // Center horizontally
            }}
        >
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                Designed by Eshwar
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {'© '}
                <Link color="inherit" href="https://cabshareiitp.onrender.com/">
                    Cab Share IITP 
                </Link>{' '}
                {new Date().getFullYear()}
                {'. All rights reserved.'}
            </Typography>

            {/* Contact Admin Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' , flexDirection : "column" }}>
                <Typography  color="text.secondary" sx = {{fontSize : "40"}} >
                    Contact Admin
                </Typography>
                <Button
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // For security
                    sx={{color : "primary.main" , ml : "0" ,mb : "0"}}
                    aria-label="Contact Admin"
                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=eshwarrachakonda02@gmail.com`, '_blank')}
                >
                    <EmailIcon />
                </Button>

            </Box>
        </Box>
    );
};

export default Footer;
