import React, { useState, useEffect } from 'react';
import Login from './Login';
import Invitation from './Invitation';
import { getAuth, signOut } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Box, Fab } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // Track current page

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

  const handleAddRecipe = () => {
    console.log('Add Recipe clicked'); // Placeholder for recipe creation
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Welcome to the Recipe Organizer!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Your recipes will be displayed here.
            </Typography>
          </Box>
        );
      case 'shopping-list':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Ingredient Shopping List
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Your shopping list will be displayed here.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : !isCodeValidated ? (
        <Invitation onValidationSuccess={handleCodeValidationSuccess} />
      ) : (
        <>
          {/* AppBar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Recipe Organizer
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1 }}>{renderPage()}</Box>

          {/* Bottom Navigation */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderTop: '1px solid #ddd',
              zIndex: 1200,
            }}
          >
            <BottomNavigation
              value={currentPage}
              onChange={(event, newValue) => setCurrentPage(newValue)}
              showLabels
            >
              <BottomNavigationAction
                label="Home"
                value="home"
                icon={<HomeIcon />}
              />
              <Box sx={{ position: 'relative' }}>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleAddRecipe}
                  sx={{
                    position: 'absolute',
                    top: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <AddIcon />
                </Fab>
              </Box>
              <BottomNavigationAction
                label="Shopping List"
                value="shopping-list"
                icon={<ShoppingCartIcon />}
              />
            </BottomNavigation>
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
