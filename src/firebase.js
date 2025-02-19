// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMaozqMSeRjoskXW-fvhB7Y3G0r4wqWd8",
  authDomain: "gasusage-afd48.firebaseapp.com",
  projectId: "gasusage-afd48",
  storageBucket: "gasusage-afd48.appspot.com",
  messagingSenderId: "50951784637",
  appId: "1:50951784637:web:92b4dc5b3c817585430fd4",
  measurementId: "G-GR3V4EJGM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Only initialize analytics if window is defined (client-side)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };