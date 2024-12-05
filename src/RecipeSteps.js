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
    <Box sx={{ p: 3, textAlign: 'center' }}>
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Steps Added:</Typography>
        {steps.map((step, index) => (
          <Typography key={index} variant="body1">
            {index + 1}. {step}
          </Typography>
        ))}
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleComplete}
        sx={{ mt: 3 }}
      >
        Complete Recipe
      </Button>
    </Box>
  );
};

export default RecipeSteps;
