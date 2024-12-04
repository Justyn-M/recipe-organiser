import React, { useState, useEffect } from 'react';
import Login from './Login';
import Invitation from './Invitation';
import { getAuth, signOut } from 'firebase/auth';
import { Button, Typography, Box } from '@mui/material';

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);

  useEffect(() => {
    // Check for a validated code in localStorage
    const validatedCode = localStorage.getItem('validatedCode');
    if (validatedCode) {
      setIsCodeValidated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleCodeValidationSuccess = (code) => {
    localStorage.setItem('validatedCode', code);
    setIsCodeValidated(true);
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setIsCodeValidated(false);
    localStorage.removeItem('validatedCode'); // Clear stored code
    localStorage.removeItem('deviceId');
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : !isCodeValidated ? (
        <Invitation onValidationSuccess={handleCodeValidationSuccess} />
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome to the Recipe Organizer!
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}


export default App;