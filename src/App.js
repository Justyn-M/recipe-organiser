import './App.css';
import app from './firebaseConfig';
import React, { useState } from 'react';
import Login from './Login';
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Login Functionality
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <h1>Welcome to the Recipe Organizer!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;