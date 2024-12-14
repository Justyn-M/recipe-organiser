import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeSteps = ({ initialSteps = [], onSaveSteps, onComplete }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState('');

  // Add a step
  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setSteps([...steps, currentStep.trim()]);
      setCurrentStep('');
    }
  };

  // Delete a step
  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Save steps (for editing mode)
  const handleSave = () => {
    if (steps.length === 0) {
      alert('No steps to save!');
      return;
    }
    if (onSaveSteps) {
      onSaveSteps(steps);
    }
    alert('Steps saved successfully!');
  };

  // Complete the recipe (for adding a new recipe)
  const handleComplete = () => {
    // If there's a step typed but not yet added, add it now
    if (currentStep.trim() !== '') {
      const updatedSteps = [...steps, currentStep.trim()];
      setSteps(updatedSteps);
      setCurrentStep('');

      if (onComplete) {
        onComplete(updatedSteps);
        alert('Recipe completed and uploaded!');
      }
      return;
    }

    // If no steps exist at all
    if (steps.length === 0) {
      alert('Please add at least one step to complete the recipe.');
      return;
    }

    // If steps are ready and onComplete is provided
    if (onComplete) {
      onComplete(steps);
      alert('Recipe completed and uploaded!');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
        padding: 3,
        pb: 12,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Recipe Steps
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <TextField
          label={`Step ${steps.length + 1}`}
          variant="outlined"
          fullWidth
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddStep}>
          Add Step
        </Button>

        {onComplete && (
          <Button variant="contained" color="error" onClick={handleComplete}>
            Complete Recipe
          </Button>
        )}
      </Box>

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

      {onSaveSteps && (
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
      )}
    </Box>
  );
};

export default RecipeSteps;