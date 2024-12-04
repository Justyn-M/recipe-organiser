// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
export default app