import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const RecipeDetails = ({ onNext }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cookTime, setCookTime] = useState(''); // New state for cook time

  // Function for handling photo changes
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleNext = () => {
    const recipeData = {
      recipeName,
      ingredients: ingredients.split(','), // Split ingredients by commas
      creatorName,
      photo,
      cookTime, // Add cook time to recipe data
    };
    onNext(recipeData);
  };


  // App UI for adding recipe details page
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Add Recipe Details
      </Typography>

      <Box sx={{ my: 2 }}>
        <TextField
          label="Dish Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          required
        />
         <TextField
          label="Cook Time (e.g., 30 minutes)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cookTime}
          onChange={(e) => setCookTime(e.target.value)}
          required
        />
        <TextField
          label="Ingredients (comma-separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        <TextField
          label="Creator Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          required
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-photo"
          type="file"
          onChange={handlePhotoChange}
        />
        <label htmlFor="upload-photo">
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        {photo && <Typography>{photo.name}</Typography>}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        disabled={!recipeName || !ingredients || !creatorName}
      >
        Next
      </Button>
    </Box>
  );
};

export default RecipeDetails;
