import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeSteps = ({ initialSteps = [], onSaveSteps, onComplete }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState('');

  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setSteps([...steps, currentStep.trim()]);
      console.log('Step added:', currentStep.trim());
      setCurrentStep('');
    }
  };

  const handleDeleteStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    console.log('Step deleted. Updated steps:', updatedSteps);
  };

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

  const handleComplete = () => {
    // If there's a step typed but not yet added, add it now
    let finalSteps = steps;
    if (currentStep.trim() !== '') {
      finalSteps = [...steps, currentStep.trim()];
      setSteps(finalSteps);
      setCurrentStep('');
    }

    if (finalSteps.length === 0) {
      alert('Please add at least one step to complete the recipe.');
      return;
    }

    console.log('Completing recipe with steps:', finalSteps);
    if (onComplete) {
      onComplete(finalSteps);
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

      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
