import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const RecipeSteps = ({ onComplete }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setSteps([...steps, currentStep]);
      setCurrentStep('');
    }
  };

  const handleComplete = () => {
    onComplete(steps);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto', // This section scrolls
          padding: 3,
          textAlign: 'center',
          paddingBottom: '80px', // Extra space to avoid hiding steps behind the button
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add Recipe Steps
        </Typography>

        <TextField
          label={`Step ${steps.length + 1}`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStep}
          sx={{ mt: 2 }}
        >
          Add Step
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleComplete}
          sx={{ mt: 2 }}
        >
          Complete Recipe
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Steps Added:</Typography>
          {steps.map((step, index) => (
            <Typography key={index} variant="body1" sx={{ mt: 1 }}>
              {index + 1}. {step}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Fixed Footer Bar for the Complete Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #ddd',
          padding: 2,
          textAlign: 'center',
        }}
      >
      </Box>
    </Box>
  );
};

export default RecipeSteps;
