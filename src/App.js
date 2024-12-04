import './App.css';
import app from './firebaseConfig';
import React, { useState } from 'react';
import Login from './Login';
import { getAuth, signOut } from "firebase/auth";
import Invitation from './Invitation';

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCodeValidated, setIsCodeValidated] = useState(false);

  //Login Functionality
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleCodeValidationSuccess = () => {
    setIsCodeValidated(true);
  };


  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
    setIsCodeValidated(false);
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