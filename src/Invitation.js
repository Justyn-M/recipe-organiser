import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

const Invitation = ({ onValidationSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleValidateCode = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'invitations', code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && !docSnap.data().used) {
        // Mark the code as used
        await updateDoc(docRef, { used: true });
        onValidationSuccess();
      } else {
        setError('Invalid or already used code.');
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
