import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXHxxIjzq5tqYG5QTd2OIrshw4GfvogUs",
  authDomain: "recipe-organiser-29e0f.firebaseapp.com",
  projectId: "recipe-organiser-29e0f",
  storageBucket: "recipe-organiser-29e0f.firebasestorage.app",
  messagingSenderId: "945545378207",
  appId: "1:945545378207:web:a0b52881b7af381ed1e5aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Export Firestore
export default app;
