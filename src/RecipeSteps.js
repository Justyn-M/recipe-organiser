import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecipeSteps = ({ initialSteps = [], onSaveSteps }) => {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState('');

  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setSteps([...steps, currentStep]);
      setCurrentStep('');
    }
  };

  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (steps.length === 0) {
      alert('No steps to save!');
      return;
    }
    onSaveSteps(steps);
    alert('Steps saved successfully!');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto', // Make the entire page scrollable
        padding: 3,
        pb: 12, // Add padding to prevent content overlap, 'save steps' does not overlap with 'add recipe' button
      }}
    >
      {/* Page Title */}
      <Typography variant="h5" gutterBottom>
        Edit Recipe Steps
      </Typography>

      {/* Add Step Input */}
      <Box sx={{ mb: 2 }}>
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
          sx={{ mt: 1 }}
        >
          Add Step
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
