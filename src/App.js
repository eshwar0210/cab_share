import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import './App.css';
import Login from './pages/login';
import Homepage from './pages/home';

import Register from './pages/register';
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const PrivateRoute = ({ element: Component }) => {
  return isAuthenticated() ? Component : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute element={<Homepage />} />} />
          <Route path="/register" element={<Register />}  />

        </Routes>
      </Container>
    </Router>


  );
}

export default App;