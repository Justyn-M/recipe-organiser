import React, { useState, useEffect } from 'react';
import Login from './Login';
import Invitation from './Invitation';
import RecipeDetails from './RecipeDetails';
import RecipeSteps from './RecipeSteps';
import { getAuth, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Box, Fab } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig'; // Import Firebase Storage setup
import EditRecipe from './EditRecipe';

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // Track current page
  const [recipeData, setRecipeData] = useState(null); // Store recipe data
  const [recipes, setRecipes] = useState([]); // Store recipes from Firestore
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Track the clicked recipe
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Track the current step for cooking
  const [shoppingList, setShoppingList] = useState([]); // Track all ingredients in the shopping list
  const [checkedIngredients, setCheckedIngredients] = useState([]); // Track checked ingredients

  useEffect(() => {
    // Set session persistence to localStorage => Enables setPersistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Session persistence set to localStorage");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    // Check user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (isLoggedIn && isCodeValidated) {
      setCurrentPage('home');
    }
  }, [isLoggedIn, isCodeValidated])

  useEffect(() => {
    const fetchRecipes = async () => {
      // Only fetch if on the home page, logged in, and code validated
      if (currentPage === 'home' && isLoggedIn && isCodeValidated) {
        try {
          const querySnapshot = await getDocs(collection(db, 'recipes'));
          const recipesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRecipes(recipesData);
        } catch (e) {
          console.error('Error fetching recipes:', e);
        }
      }
    };
  
    fetchRecipes();
  }, [currentPage, isLoggedIn, isCodeValidated]);  

  // For ensuring page is only accessed after a validated code is typed
  useEffect(() => {
    const validatedCode = localStorage.getItem('validatedCode');
    if (validatedCode) {
      setIsCodeValidated(true);
    }
  }, []);

  // Login Success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Code validation success
  const handleCodeValidationSuccess = (code) => {
    localStorage.setItem('validatedCode', code);
    setIsCodeValidated(true);
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setIsCodeValidated(false);
    //enabling the below sets it so that if a user logs out, admin has to make a new validation code.
    //localStorage.removeItem('validatedCode');
    // localStorage.removeItem('deviceId');
    window.location.reload(); // Redirect to login page
  };

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("You will be logged out in 1 minute due to inactivity.");
        setTimeout(handleLogout, 60 * 1000); // Log out after 1 minute
      }, (4 * 60 * 60 * 1000) - (60 * 1000)); // 4 hours minus 1 minute      
    };

    // User activity events
    const activityEvents = ["mousemove", "keydown", "click", "touchstart"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Initialize the timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  const handleAddRecipe = () => {
    setCurrentPage('add-recipe-details');
  };

  const handleNext = (data) => {
    setRecipeData(data);
    setCurrentPage('add-recipe-steps');
  };

  const handleComplete = async (steps) => {
    let imageUrl = null;

    if (recipeData.photo) {
      const imageRef = ref(storage, `recipes/${recipeData.photo.name}`); // Save image in "recipes" folder
      try {
        const snapshot = await uploadBytes(imageRef, recipeData.photo);
        imageUrl = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded image
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    const completeRecipe = {
      ...recipeData,
      steps,
      photo: imageUrl, // Store the URL of the uploaded image
      cookTime: recipeData.cookTime, // Include cook time
      timestamp: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'recipes'), completeRecipe);
      console.log('Recipe saved with ID:', docRef.id);
      setCurrentPage('home');
    } catch (e) {
      console.error('Error adding recipe:', e);
    }

    setCurrentPage('home');
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId)); // Delete the recipe document
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      ); // Update UI by removing the deleted recipe
      console.log('Recipe deleted successfully');
    } catch (e) {
      console.error('Error deleting recipe:', e);
    }
  };

// Function that renders the UI of all non-login pages of the app
  const renderPage = () => {
    switch (currentPage) {
      // Home page UI
      case 'home':
        return (
          <Box
            sx={{
              height: '100vh', // Full height of the viewport
              overflowY: 'auto', // Enable scrolling if content overflows
              padding: 3,
            }}
          >
            <Typography variant="h4" gutterBottom textAlign="center">
              Welcome to the Recipe Organizer!
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2,
              }}
            >
              {recipes.map((recipe) => (
                <Box
                  key={recipe.id}
                  sx={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: '#ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedRecipe(recipe); // Set the selected recipe
                    setCurrentPage('recipe-details'); // Navigate to recipe details
                  }}
                >
                  {recipe.photo ? (
                    <img
                      src={recipe.photo}
                      alt={recipe.recipeName}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '150px',
                        backgroundColor: '#ccc',
                      }}
                    >
                      <Typography variant="h6" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: '#fff',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6">{recipe.recipeName}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        );

        // Recipe details page UI
      case 'recipe-details':
        return (
          <Box
            sx={{
              height: '100vh', // Full height of the viewport
              overflowY: 'auto', // Enable vertical scrolling
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '72px', // Add padding to ensure buttons are fully visible
            }}
          >
            {/* Delete and Edit Buttons */}
            <Box 
              sx={{
                display: 'flex', //Flex box container for aligning edit and delete buttons
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1, // Spacing between buttons
                mt: 2, // Adds margin below the app bar
                pr: 2,
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ fontFamily: 'Cantarell, sans-serif' }}
                onClick={async () => {
                  await handleDelete(selectedRecipe.id); // Delete the recipe
                  setSelectedRecipe(null);
                  setCurrentPage('home'); // Navigate back to the home page
                }}
              >
                Delete Recipe
              </Button>
              <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ fontFamily: 'Cantarell, sans-serif', width: '120px', ml: 'auto' }} //Set width and ml pushes button to the right
              onClick={() => setCurrentPage('edit-recipe')} 
              >
                Edit Recipe
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{fontFamily: 'Cantarell, sans-serif', width: '120px', ml: 'auto'}}
                onClick={() => setCurrentPage('edit-steps')}
              >
                Edit Steps
              </Button>

            </Box>

            {/* Recipe Content */}
            <Box sx={{ padding: 3 }}>
              {/* Recipe Photo */}
              {selectedRecipe.photo && (
                <img
                  src={selectedRecipe.photo}
                  alt={selectedRecipe.recipeName}
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              )}

              {/* Recipe Name */}
              <Typography variant="h4" gutterBottom>
                {selectedRecipe.recipeName}
              </Typography>
              
              {/* Recipe Cook time */}
              <Typography variant="h6" gutterBottom>
                Cooking Time: {selectedRecipe.cookTime}
              </Typography>

              {/* Recipe Creator */}
              <Typography variant="h6" gutterBottom  sx={{ fontSize: '20px' }}>
                Creator: {selectedRecipe.creatorName}
              </Typography>

              {/* Ingredients Section */}
              <Typography variant="h6" gutterBottom>
                Ingredients:
              </Typography>
              <Box
                sx={{
                  maxHeight: '200px',
                  overflowY: 'auto', // Enable scrolling for long ingredient lists
                  mt: 2,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <Typography key={index} variant="body1">
                    • {ingredient}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                padding: 3,
                mt: 'auto', // Push buttons to the bottom of the scrolling container
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb:2, fontFamily: 'Cantarell, sans-serif' }}
                onClick={() => {
                  setShoppingList((prev) => [...prev, ...selectedRecipe.ingredients]);
                  setCurrentPage('shopping-list'); // Navigate to the shopping list page
                }}
              >
                Add to Shopping List
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  setCurrentStepIndex(0); // Start from the first step
                  setCurrentPage('cooking-step'); // Navigate to the cooking steps
                }}
              >
                Start Cooking
              </Button>
            </Box>
          </Box>
        );

// UI for cooking steps shown in each recipe
      case 'cooking-step':
        const step = selectedRecipe.steps[currentStepIndex];
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Step {currentStepIndex + 1} of {selectedRecipe.steps.length}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {step}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentStepIndex === 0}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setCurrentStepIndex((prev) =>
                    Math.min(prev + 1, selectedRecipe.steps.length - 1)
                  )
                }
                disabled={currentStepIndex === selectedRecipe.steps.length - 1}
              >
                Next Step
              </Button>
            </Box>
          </Box>
        );

        // Shopping List Page UI
      case 'shopping-list':
        return (
          <Box
            sx={{
              height: '100vh', // Full viewport height
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Scrollable Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto', // Enable vertical scrolling
                padding: 3,
              }}
            >
              <Typography variant="h4" gutterBottom textAlign="center">
                Shopping List
              </Typography>

              {/* Ingredients to Buy */}
              <Box
                sx={{
                  maxHeight: '40vh',
                  overflowY: 'auto', // Scrolling within this box
                  mb: 3,
                  p: 2,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: 'Cantarell, sans-serif' }}
                >
                  To Buy
                </Typography>
                {shoppingList
                  .filter((ingredient) => !checkedIngredients.includes(ingredient))
                  .map((ingredient, index) => (
                    <Box
                      key={index}
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          setCheckedIngredients((prev) => [...prev, ingredient]); // Move to checked
                        }}
                      />
                      <Typography sx={{ ml: 2 }}>{ingredient}</Typography>
                    </Box>
                  ))}
              </Box>

              {/* Bought Ingredients */}
              <Box
                sx={{
                  maxHeight: '40vh',
                  overflowY: 'auto', // Scrolling within this box
                  p: 2,
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontFamily: 'Cantarell, sans-serif' }}
                >
                  Bought
                </Typography>
                {checkedIngredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {
                        setCheckedIngredients((prev) =>
                          prev.filter((item) => item !== ingredient)
                        ); // Move back to unchecked
                      }}
                    />
                    <Typography sx={{ ml: 2 }}>{ingredient}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Clear All Button */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 72, // Place above the navigation bar
                right: 16,
                zIndex: 1200, // Ensure it appears above other elements
              }}
            >
              <Button
                variant="contained"
                color="error"
                sx={{ fontFamily: 'Cantarell, sans-serif' }}
                onClick={() => {
                  setShoppingList([]); // Clear all ingredients
                  setCheckedIngredients([]); // Clear checked ingredients
                }}
              >
                Clear All
              </Button>
            </Box>
          </Box>
        );

        //Cases that render the UI of other files
      case 'add-recipe-details':
        return <RecipeDetails onNext={handleNext} />;

      case 'add-recipe-steps':
        return <RecipeSteps onComplete={handleComplete} />;
      default:
        return null;

        case 'edit-recipe':
          return (
            <EditRecipe
              selectedRecipe={selectedRecipe} // Pass the recipe to edit
              onComplete={() => setCurrentPage('recipe-details')} // Return to details page
            />
          );

         case 'edit-steps':
  return (
    <RecipeSteps
      initialSteps={selectedRecipe.steps} // Pass existing steps
      onSaveSteps={async (updatedSteps) => {
        try {
          const recipeRef = doc(db, 'recipes', selectedRecipe.id);
          await updateDoc(recipeRef, { steps: updatedSteps }); // Update Firestore
          setSelectedRecipe({ ...selectedRecipe, steps: updatedSteps }); // Update local state
          setCurrentPage('recipe-details'); // Navigate back to details
        } catch (error) {
          console.error('Error updating steps:', error);
        }
      }}
    />
  );

          
        
    }
  };

  // === AppBar & Navigation bar UI ===
  //elevation makes appbar pop out due to shadows
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : !isCodeValidated ? (
        <Invitation onValidationSuccess={handleCodeValidationSuccess} />
      ) : (
        <>
          <AppBar position="static" elevation={4}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Recipe Organizer
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1 }}>{renderPage()}</Box>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              borderTop: '1px solid #ddd',
              zIndex: 1200,
            }}
          >
            <BottomNavigation
              value={currentPage}
              onChange={(event, newValue) => setCurrentPage(newValue)}
              showLabels
            >
              <BottomNavigationAction
                label="Home"
                value="home"
                icon={<HomeIcon />}
              />
              <Box sx={{ position: 'relative' }}>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleAddRecipe}
                  sx={{
                    position: 'absolute',
                    top: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <AddIcon />
                </Fab>
              </Box>
              <BottomNavigationAction
                label="Shopping List"
                value="shopping-list"
                icon={<ShoppingCartIcon />}
              />
            </BottomNavigation>
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
