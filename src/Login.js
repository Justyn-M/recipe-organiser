import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebaseConfig';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';

// Login file for web app
const auth = getAuth(app);

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function that handles the login functionality
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in with the shared credentials
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  // Login UI
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #4caf50, #81c784)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: '100vh' }}
      >
        {/* Add the main title above the login box */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Custom Recipe Organizer
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Organize your recipes with ease
          </Typography>
        </Box>

        <Box
          sx={{
            maxWidth: 400,
            p: 3,
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            bgcolor: '#fff',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};


export default Login;
