import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';


const db = getFirestore(app);
const auth = getAuth(app);

const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
      console.log('Generating new deviceId');
      deviceId = crypto.randomUUID(); // Generate a new deviceId
      localStorage.setItem('deviceId', deviceId); // Store it persistently
  } else {
      console.log('Using existing deviceId:', deviceId);
  }
  return deviceId;
};



const Invitation = ({ onValidationSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleValidateCode = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const deviceId = getDeviceId();

    try {
      const docRef = doc(db, 'invitations', code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Check if the code is tied to the current shared user
        if (data.userId === user.email) {
          // If no deviceId is assigned, assign the current device
          if (!data.deviceId) {
            await updateDoc(docRef, { deviceId });
            localStorage.setItem('validatedCode', code); // Store validated code locally
            onValidationSuccess(code); // Notify App of successful validation
          } else if (data.deviceId === deviceId) {
            // Allow access if the code is already tied to this device
            localStorage.setItem('validatedCode', code);
            onValidationSuccess(code);
          } else {
            setError('This code is tied to another device.');
          }
        } else {
          setError('Invalid code for this user.');
        }
      } else {
        setError('Invalid code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };


  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh' }}
    >
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
          Enter Invitation Code
        </Typography>
        <form onSubmit={handleValidateCode}>
          <TextField
            label="Code"
            variant="outlined"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Validate
          </Button>
        </form>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Grid>
  );
};

export default Invitation;