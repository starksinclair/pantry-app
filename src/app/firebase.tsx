// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpFoBPhjWokC2uyvLSbebwmRd5RJOLzlQ",
  authDomain: "pantry-app-43661.firebaseapp.com",
  projectId: "pantry-app-43661",
  storageBucket: "pantry-app-43661.appspot.com",
  messagingSenderId: "852692902278",
  appId: "1:852692902278:web:9c4665d914251285044c07",
  measurementId: "G-H04X66MNRR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
isSupported().then((supported) => {
  if (supported) {
    const analyticsInstance = getAnalytics(app);
  }
});
const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth(app);
export {
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};
