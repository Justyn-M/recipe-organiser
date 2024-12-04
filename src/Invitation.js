import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth(app);

const Invitation = ({ onValidationSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleValidateCode = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    try {
      const docRef = doc(db, 'invitations', code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Check if the code is assigned to this user or unassigned
        if (!data.userId || data.userId === user.email) {
          // Save validated code locally
          localStorage.setItem('validatedCode', code);

          // If the code is unassigned, assign it to the user
          if (!data.userId) {
            await updateDoc(docRef, { userId: user.email });
          }

          onValidationSuccess(code); // Notify App of successful validation
        } else {
          setError('This code is assigned to another user.');
        }
      } else {
        setError('Invalid code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Enter Invitation Code</h2>
      <form onSubmit={handleValidateCode}>
        <div>
          <label>Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Validate</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Invitation;
