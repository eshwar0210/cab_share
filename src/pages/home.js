import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Box, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import LuggageIcon from '@mui/icons-material/Luggage';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router';
const Homepage = () => {

  const navigate = useNavigate();
  const handleaddjourney = () =>{
    navigate("/add-journey");
  };
  const handlecalendarclick = ()=>{
    navigate("/browse-calendar");
  };
  const handleeditjourney = () =>{
    navigate("/edit-journey")
  };
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box sx={{ padding: 4, flexGrow: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardActionArea onClick={handleaddjourney}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LuggageIcon sx={{ fontSize: 60 , color:"primary.main" }} />
                  <Typography variant="h6" mt={2} sx = {{color:"primary.main"}}>
                    Add Journey
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardActionArea onClick={handleeditjourney}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EditIcon sx={{ fontSize: 60 , color:"primary.main" }}  />
                  <Typography variant="h6" mt={2} sx = {{color:"primary.main"}}>
                    Edit Journey
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardActionArea onClick={handlecalendarclick}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CalendarTodayIcon sx={{ fontSize: 60 , color:"primary.main" }} />
                  <Typography variant="h6" mt={2} sx = {{color:"primary.main"}}>
                    Browse Calendar
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardActionArea  onClick={() => navigate('/cab-drivers')}>
                <CardContent sx={{ textAlign: 'center'  }}>
                  <PeopleIcon sx={{ fontSize: 60 , color:"primary.main" }}  />
                  <Typography variant="h6" mt={2} sx = {{color:"primary.main"}}>
                    Cab Drivers
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Footer sx={{ mt: 'auto' }} />
    </Box>
  );
};

export default Homepage;
