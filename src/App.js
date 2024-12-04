import React, { useState, useEffect } from 'react';
import Login from './Login';
import Invitation from './Invitation';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);

  useEffect(() => {
    // Check for a validated code in localStorage
    const validatedCode = localStorage.getItem('validatedCode');
    if (validatedCode) {
      setIsCodeValidated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleCodeValidationSuccess = (code) => {
    localStorage.setItem('validatedCode', code);
    setIsCodeValidated(true);
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setIsCodeValidated(false);
    localStorage.removeItem('validatedCode'); // Clear stored code
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : !isCodeValidated ? (
        <Invitation onValidationSuccess={handleCodeValidationSuccess} />
      ) : (
        <div>
          <h1>Welcome to the Recipe Organizer!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
