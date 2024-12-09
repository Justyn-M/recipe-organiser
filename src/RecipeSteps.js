import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeSteps = ({ initialSteps = [], onSaveSteps, onComplete }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState('');

  // Function to add a step
  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setSteps([...steps, currentStep]);
      setCurrentStep('');
    }
  };

  // Function to delete a step
  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Function to save steps
  const handleSave = () => {
    if (steps.length === 0) {
      alert('No steps to save!');
      return;
    }
    onSaveSteps(steps);
    alert('Steps saved successfully!');
  };

  // Function to complete the recipe
  const handleComplete = () => {
    if (steps.length === 0) {
      alert('Please add at least one step to complete the recipe.');
      return;
    }
    onComplete(steps); // Calls the function passed as a prop to upload the recipe
    alert('Recipe completed and uploaded!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
        padding: 3,
        pb: 12, // Add padding to prevent content overlap
      }}
    >
      {/* Page Title */}
      <Typography variant="h5" gutterBottom>
        Edit Recipe Steps
      </Typography>

      {/* Add Step Input */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'column', // Stack buttons vertically
          gap: 1, // Add spacing between buttons
        }}
      >
        <TextField
          label={`Step ${steps.length + 1}`}
          variant="outlined"
          fullWidth
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStep}
        >
          Add Step
        </Button>

        {/* Complete Recipe Button */}
        <Button
          variant="contained"
          color="error"
          onClick={() => onComplete(steps)} // Pass steps to parent handler
        >
          Complete Recipe
        </Button>
      </Box>

      {/* Steps List */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Steps:</Typography>
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography variant="body1">{`${index + 1}. ${step}`}</Typography>
            <IconButton color="error" onClick={() => handleDeleteStep(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Save Steps Button */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleSave}
          sx={{ fontFamily: 'Cantarell, sans-serif', fontWeight: 'bold' }}
        >
          Save Steps
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeSteps;

