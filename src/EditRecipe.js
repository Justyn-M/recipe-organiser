import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

const EditRecipe = ({ selectedRecipe, onComplete }) => {
  const [recipeName, setRecipeName] = useState(selectedRecipe.recipeName);
  const [ingredients, setIngredients] = useState(selectedRecipe.ingredients.join(','));
  const [creatorName, setCreatorName] = useState(selectedRecipe.creatorName);
  const [photo, setPhoto] = useState(null);
  const [cookTime, setCookTime] = useState(selectedRecipe.cookTime);

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSaveChanges = async () => {
    let imageUrl = selectedRecipe.photo; // Keep the existing photo if no new photo is uploaded

    if (photo) {
      const imageRef = ref(storage, `recipes/${photo.name}`);
      const snapshot = await uploadBytes(imageRef, photo);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedRecipe = {
      recipeName,
      ingredients: ingredients.split(','),
      creatorName,
      cookTime,
      photo: imageUrl,
    };

    try {
      const recipeRef = doc(db, 'recipes', selectedRecipe.id); // Reference to the document
      await updateDoc(recipeRef, updatedRecipe);
      onComplete(); // Callback to navigate back after saving
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Recipe
      </Typography>

      <TextField
        label="Dish Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
      />
      <TextField
        label="Cook Time"
        variant="outlined"
        fullWidth
        margin="normal"
        value={cookTime}
        onChange={(e) => setCookTime(e.target.value)}
      />
      <TextField
        label="Ingredients (comma-separated)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <TextField
        label="Creator Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={creatorName}
        onChange={(e) => setCreatorName(e.target.value)}
      />

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
        fullWidth
        onClick={handleSaveChanges}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default EditRecipe;
