import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth(app);

const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

const Invitation = ({ onValidationSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleValidateCode = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const deviceId = getDeviceId();

    try {
      const docRef = doc(db, 'invitations', code);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Check if the code is tied to the current shared user
        if (data.userId === user.email) {
          // If no deviceId is assigned, assign the current device
          if (!data.deviceId) {
            await updateDoc(docRef, { deviceId });
            localStorage.setItem('validatedCode', code); // Store validated code locally
            onValidationSuccess(code); // Notify App of successful validation
          } else if (data.deviceId === deviceId) {
            // Allow access if the code is already tied to this device
            localStorage.setItem('validatedCode', code);
            onValidationSuccess(code);
          } else {
            setError('This code is tied to another device.');
          }
        } else {
          setError('Invalid code for this user.');
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